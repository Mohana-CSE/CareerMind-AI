import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Analyses, Resumes, CareerRoles, Projects } from '../models';
import { analyzeResumeWithGemini, buildDeterministicAnalysis } from '../services/aiService';
import { validateResumeContent } from '../services/validatorService';

export async function createAnalysis(req: AuthenticatedRequest, res: Response) {
  try {
    const { text, resumeId, targetCareerId, targetCompany } = req.body;
    const userId = req.user?._id || 'guest-user';

    let resumeText = text;
    let targetResumeId = resumeId || '';

    if (!resumeText && resumeId) {
      const resume = Resumes.findById(resumeId);
      if (resume) {
        resumeText = resume.extractedText;
      }
    }

    if (!resumeText || resumeText.trim().length < 40) {
      return res.status(400).json({
        success: false,
        error: "This document doesn't contain enough readable content to analyze as a resume.",
      });
    }

    // Validate that content is a resume
    const validation = validateResumeContent(resumeText);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        error: validation.error || "This file doesn't appear to be a resume. Please upload a valid resume or CV.",
      });
    }

    const analysisData = await analyzeResumeWithGemini(
      resumeText,
      userId,
      targetResumeId,
      targetCareerId,
      targetCompany
    );

    analysisData.userId = userId;
    analysisData.resumeId = targetResumeId;
    analysisData.isDemo = false;

    const saved = Analyses.create(analysisData);

    return res.status(201).json({
      success: true,
      analysisId: saved._id,
      analysis: saved,
    });
  } catch (err: any) {
    console.error('Create analysis error:', err);
    return res.status(500).json({
      success: false,
      error: `Unable to analyze this resume: ${err?.message || 'Processing error.'}`,
    });
  }
}

export async function getAnalysisById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    // Dedicated demo analysis route
    if (id === 'demo') {
      return getDemoAnalysis(req, res);
    }

    const analysis = Analyses.findById(id);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found.',
      });
    }

    return res.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    console.error('Get analysis by ID error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve analysis.' });
  }
}

export async function getAnalysisHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?._id || 'guest-user';
    const history = Analyses.find(a => a.userId === userId && !a.isDemo);

    return res.json({
      success: true,
      history: history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    });
  } catch (err: any) {
    console.error('Get history error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load history.' });
  }
}

/**
 * Updates target career and/or target company for an existing analysis.
 * Dynamically recalculates match score, readiness score, skill gaps,
 * courses, LeetCode problems, projects, and interview questions!
 */
export async function updateTarget(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { targetCareerId, targetCompany } = req.body;
    const userId = req.user?._id || 'guest-user';

    const existingAnalysis = Analyses.findById(id);
    if (!existingAnalysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found.' });
    }

    // Retrieve resume text
    let resumeText = '';
    if (existingAnalysis.resumeId) {
      const resume = Resumes.findById(existingAnalysis.resumeId);
      if (resume) resumeText = resume.extractedText;
    }

    if (!resumeText) {
      // Re-create from profile or fallback
      resumeText = `${existingAnalysis.candidateProfile?.name || 'Developer'}\n${existingAnalysis.skillsDetected.map(s => s.skill).join(', ')}`;
    }

    // Recompute analysis for the newly selected target career and target company
    const updatedAnalysisData = await analyzeResumeWithGemini(
      resumeText,
      userId,
      existingAnalysis.resumeId,
      targetCareerId,
      targetCompany
    );

    updatedAnalysisData._id = existingAnalysis._id;
    updatedAnalysisData.userId = existingAnalysis.userId;
    updatedAnalysisData.resumeId = existingAnalysis.resumeId;
    updatedAnalysisData.isDemo = existingAnalysis.isDemo;

    const saved = Analyses.findByIdAndUpdate(id, updatedAnalysisData);

    return res.json({
      success: true,
      analysis: saved || updatedAnalysisData,
      message: 'Target career and target company updated successfully.',
    });
  } catch (err: any) {
    console.error('Update target error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update target selection.' });
  }
}

/**
 * Independent comparison of up to 3 careers based on this resume
 */
export async function compareCareers(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { careerIds } = req.body;

    if (!Array.isArray(careerIds) || careerIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide careerIds array to compare.' });
    }

    const analysis = Analyses.findById(id);
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found.' });
    }

    let resumeText = '';
    if (analysis.resumeId) {
      const resume = Resumes.findById(analysis.resumeId);
      if (resume) resumeText = resume.extractedText;
    }

    const allRoles = CareerRoles.find();
    const selectedRoles = allRoles.filter(r => careerIds.includes(r._id) || careerIds.includes(r.title));

    // Calculate independent scores for each
    const comparisonResults = selectedRoles.slice(0, 3).map(role => {
      // If we already have this in allCareerScores, retrieve it
      const existing = analysis.allCareerScores?.find(c => c.roleId === role._id || c.title.toLowerCase() === role.title.toLowerCase());
      if (existing) {
        return {
          role,
          matchPercentage: existing.matchPercentage,
          readinessScore: existing.readinessScore,
          strongSkills: existing.strongSkills,
          missingSkills: existing.missingSkills,
        };
      }

      // Or compute on the fly
      const tempAnalysis = buildDeterministicAnalysis(resumeText, analysis.userId, analysis.resumeId, role._id, analysis.targetCompany);
      return {
        role,
        matchPercentage: tempAnalysis.topCareerMatch.matchPercentage,
        readinessScore: tempAnalysis.careerReadinessScore,
        strongSkills: tempAnalysis.topCareerMatch.strongSkills,
        missingSkills: tempAnalysis.topCareerMatch.missingSkills,
      };
    });

    return res.json({
      success: true,
      comparison: comparisonResults,
    });
  } catch (err: any) {
    console.error('Compare careers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to compare careers.' });
  }
}

/**
 * Generates an explicitly labeled Demo Analysis
 */
export async function getDemoAnalysis(_req: AuthenticatedRequest, res: Response) {
  const sampleResumeText = `ALEXANDER VANCE
Full Stack Engineer | React, TypeScript & Node.js
Email: alex.vance@example.com | GitHub: github.com/alexvance | Phone: (555) 234-5678 | San Francisco, CA

PROFESSIONAL SUMMARY:
Results-driven software engineer with 3+ years of experience engineering scalable web applications. Proficient in React, TypeScript, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, Node.js, Express, and REST APIs. Passionate about building modular component systems and high-throughput backend services.

TECHNICAL SKILLS:
• Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux Toolkit, Responsive Design
• Backend & Databases: Node.js, Express, REST APIs, PostgreSQL, MongoDB, Git
• Tools & Methodologies: Git, GitHub Actions, Docker (Basics), Jest, Agile / Scrum

EXPERIENCE:
Full Stack Developer | CloudScale Solutions (2023 - Present)
• Architected dynamic client dashboards with React and TypeScript, improving user engagement by 32%.
• Built RESTful API microservices in Node.js and Express handling over 80,000 daily requests.
• Optimized PostgreSQL indexing and database query execution times by 40%.

Frontend Engineer | DevNexus Innovations (2021 - 2023)
• Developed responsive web applications using React, Tailwind CSS, and HTML5.
• Collaborated in Git branching workflows, peer code reviews, and unit testing.

PROJECTS:
• Enterprise Cloud Task Tracker: Built an interactive Kanban task management system with React, Node.js, and MongoDB.
• E-Commerce Storefront: Developed responsive shopping catalog in Next.js with client-side state and REST API checkout.

EDUCATION:
B.S. in Computer Science | University of California, Berkeley (2017 - 2021)
GPA: 3.8 / 4.0`;

  const demoAnalysis = buildDeterministicAnalysis(
    sampleResumeText,
    'demo-user',
    'demo-resume',
    'Full Stack Developer',
    'Google'
  );

  demoAnalysis._id = 'demo';
  demoAnalysis.isDemo = true;

  // Persist demo recommended projects to Projects collection so blueprint endpoints always succeed
  if (demoAnalysis.recommendedProjects && demoAnalysis.recommendedProjects.length > 0) {
    for (const proj of demoAnalysis.recommendedProjects) {
      const existing = Projects.findById(proj._id);
      if (!existing) {
        try {
          Projects.create(proj);
        } catch {
          // ignore
        }
      }
    }
  }

  // Also upsert into Analyses collection
  const existingDemo = Analyses.findById('demo');
  if (!existingDemo) {
    Analyses.create(demoAnalysis);
  } else {
    Analyses.findByIdAndUpdate('demo', demoAnalysis);
  }

  return res.json({
    success: true,
    isDemo: true,
    analysis: demoAnalysis,
  });
}
