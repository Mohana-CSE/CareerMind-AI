import { Response } from 'express';
import multer from 'multer';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { parseResumeFile } from '../services/parserService';
import { validateFileFormat, validateResumeContent } from '../services/validatorService';
import { analyzeResumeWithGemini } from '../services/aiService';
import { Resumes, Analyses, ProgressCollection } from '../models';

// Configure Multer for in-memory handling
const uploadStorage = multer.memoryStorage();
const uploadSingle = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
  fileFilter: (req: any, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    // Only accept PDF and DOCX
    if (
      ['pdf', 'docx'].includes(ext || '') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Unsupported file format. Please upload your resume as PDF or DOCX.';
      cb(null, false);
    }
  },
}).single('resume');

export const uploadMiddleware = (req: any, res: any, next: any) => {
  uploadSingle(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Error processing file. Please upload a valid PDF or DOCX resume.',
      });
    }
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        error: req.fileValidationError,
      });
    }
    next();
  });
};

export async function uploadResume(req: AuthenticatedRequest, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No resume file received or unsupported format. Please upload your resume as PDF or DOCX.',
      });
    }

    // Step 1: Strict File Format Validation
    const formatCheck = validateFileFormat(file.originalname, file.mimetype);
    if (!formatCheck.isAllowed) {
      return res.status(400).json({
        success: false,
        error: formatCheck.error || 'Unsupported file format. Please upload your resume as PDF or DOCX.',
      });
    }

    const userId = req.user?._id || 'guest-user';
    const targetCareerId = (req.body?.targetCareerId || req.body?.careerRole || req.body?.targetCareer) as string | undefined;
    const targetCompany = (req.body?.targetCompany || req.body?.company) as string | undefined;

    console.log(`[ResumeController] Upload received: "${file.originalname}" (${file.size} bytes, ${file.mimetype})`);
    console.log(`[ResumeController] Personalization params -> Career: "${targetCareerId || 'Auto-detect'}", Company: "${targetCompany || 'Auto-detect'}"`);

    // Step 2: Text Extraction
    const parseResult = await parseResumeFile(file.buffer, file.mimetype, file.originalname);
    console.log(`[ResumeController] Extraction complete: isReadable=${parseResult.isReadable}, chars=${parseResult.charCount}, words=${parseResult.wordCount}, isOcr=${Boolean(parseResult.isOcrApplied)}`);

    if (!parseResult.isReadable || !parseResult.text) {
      console.warn(`[ResumeController] Text extraction failed for "${file.originalname}": ${parseResult.error}`);
      return res.status(422).json({
        success: false,
        error: parseResult.error || "We couldn't read this file. Please upload a valid, readable resume.",
      });
    }

    console.log(`[ResumeController] Extracted text sample: "${parseResult.text.slice(0, 180).replace(/\n/g, ' ')}"`);

    // Step 3: Document Content Analysis & Resume/CV Validation
    // Validates that file is actually a candidate resume and NOT an assignment, certificate,
    // college notes, project report, question paper, or random document.
    const validation = validateResumeContent(parseResult.text, file.originalname);
    if (!validation.isValid) {
      console.warn(`[ResumeController] Validation rejected "${file.originalname}": ${validation.error} (code: ${validation.errorCode})`);
      // STOP THE ANALYSIS. Do NOT extract fake skills, do NOT calculate scores, do NOT save analysis!
      return res.status(422).json({
        success: false,
        error: validation.error || "This file doesn't appear to be a resume. Please upload a valid resume or CV.",
        errorCode: validation.errorCode,
      });
    }

    console.log(`[ResumeController] Resume validated successfully! Saving to database and analyzing...`);

    // Step 4: Save verified resume to database
    const savedResume = Resumes.create({
      userId,
      filename: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      extractedText: parseResult.text,
      charCount: parseResult.charCount,
      wordCount: parseResult.wordCount,
      createdAt: new Date().toISOString(),
    });

    // Step 5: Analyze ACTUAL uploaded resume using deterministic scoring & Gemini AI enrichment
    const analysisData = await analyzeResumeWithGemini(
      parseResult.text,
      userId,
      savedResume._id,
      targetCareerId,
      targetCompany
    );

    if (parseResult.candidateProfile && !analysisData.candidateProfile) {
      analysisData.candidateProfile = parseResult.candidateProfile;
    }

    console.log(`[ResumeController] Analysis completed -> Candidate: "${analysisData.candidateProfile?.name}", Role: "${analysisData.targetCareerTitle}", Company: "${analysisData.targetCompany}", Readiness: ${analysisData.careerReadinessScore}`);

    analysisData.userId = userId;
    analysisData.resumeId = savedResume._id;
    analysisData.isDemo = false;

    // Step 6: Save real analysis to Database
    const savedAnalysis = Analyses.create(analysisData);

    // Step 7: Initialize or update progress record
    const existingProgress = ProgressCollection.findOne(p => p.userId === userId);
    if (!existingProgress) {
      ProgressCollection.create({
        userId,
        skillStatus: {},
        projectStatus: {},
        completedRoadmapSteps: [1],
        updatedAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      analysisId: savedAnalysis._id,
      resumeId: savedResume._id,
      analysis: savedAnalysis,
      message: 'Resume analyzed successfully.',
    });
  } catch (err: any) {
    console.error('Error in uploadResume handler:', err);
    const msg = err?.message || 'Server processing error.';
    return res.status(400).json({
      success: false,
      error: msg.includes('Unsupported file format')
        ? 'Unsupported file format. Please upload your resume as PDF or DOCX.'
        : `Unable to analyze this resume: ${msg}`,
    });
  }
}
