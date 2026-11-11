import { extractText as extractPdfWithUnpdf, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';
import zlib from 'zlib';
import { ICandidateProfile } from '../models/types';

export interface ParseResult {
  text: string;
  charCount: number;
  wordCount: number;
  isReadable: boolean;
  isOcrApplied?: boolean;
  candidateProfile?: ICandidateProfile;
  error?: string;
}

/**
 * Robust extraction of text from PDF buffers supporting multi-page,
 * compressed FlateDecode streams, cross-reference streams, coordinate spacing, and scanned documents.
 */
async function extractPdfText(buffer: Buffer, filename?: string): Promise<{ text: string; isOcrApplied: boolean }> {
  if (!buffer || buffer.length === 0) {
    throw new Error('The uploaded file is empty. Please upload a valid resume.');
  }

  // Check valid PDF magic header (%PDF-)
  const headerSlice = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('latin1');
  if (!headerSlice.includes('%PDF-')) {
    throw new Error('This PDF file appears to be corrupted or invalid. Please re-export your resume as a fresh PDF or DOCX.');
  }

  const uint8 = new Uint8Array(buffer);
  console.log(`[ResumeParser] Starting extraction for ${filename || 'resume.pdf'} (${buffer.length} bytes)`);

  // Method 1: Precision Coordinate-Aware Page Extraction
  // Retains line breaks when vertical Y shifts and inserts spaces between horizontal word items
  try {
    const pdf = await getDocumentProxy(uint8);
    const numPages = pdf.numPages;
    console.log(`[ResumeParser] PDF loaded successfully with ${numPages} page(s). Checking for selectable text...`);

    const pageTexts: string[] = [];
    let totalItemsFound = 0;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = (content.items || []) as any[];
      totalItemsFound += items.length;

      let lastY: number | null = null;
      let pageText = '';

      for (const item of items) {
        if (!item || typeof item.str !== 'string') continue;
        const str = item.str;
        if (!str) continue;

        const currentY = Array.isArray(item.transform) ? item.transform[5] : null;

        // Line break when vertical position changes significantly or item explicitly marks EOL
        if (item.hasEOL || (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 3.0)) {
          if (!pageText.endsWith('\n')) {
            pageText += '\n';
          }
        } else if (
          pageText.length > 0 &&
          !pageText.endsWith(' ') &&
          !pageText.endsWith('\n') &&
          !str.startsWith(' ')
        ) {
          pageText += ' ';
        }

        pageText += str;
        if (currentY !== null) lastY = currentY;
      }

      if (pageText.trim()) {
        pageTexts.push(pageText.trim());
      }
    }

    const combined = pageTexts.join('\n\n');
    console.log(`[ResumeParser] Method 1 (Coordinate-aware): Found ${totalItemsFound} items, extracted ${combined.length} chars.`);

    if (combined.trim().length >= 40) {
      console.log('[ResumeParser] Selectable text successfully extracted via precision page parser.');
      return { text: combined, isOcrApplied: false };
    }
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('password') || err?.name === 'PasswordException' || msg.includes('encrypted')) {
      throw new Error('This PDF file is password-protected. Please upload an unprotected PDF or DOCX resume.');
    }
    console.warn('[ResumeParser] Method 1 coordinate extraction exception:', err?.message || err);
  }

  // Method 2: Direct unpdf text extraction fallback
  try {
    const res = await extractPdfWithUnpdf(uint8);
    let combinedText = '';
    if (Array.isArray(res?.text)) {
      combinedText = res.text.join('\n\n');
    } else if (typeof res?.text === 'string') {
      combinedText = res.text;
    }

    console.log(`[ResumeParser] Method 2 (unpdf direct): extracted ${combinedText.length} chars.`);
    if (combinedText.trim().length >= 40) {
      return { text: combinedText, isOcrApplied: false };
    }
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('password') || err?.name === 'PasswordException' || msg.includes('encrypted')) {
      throw new Error('This PDF file is password-protected. Please upload an unprotected PDF or DOCX resume.');
    }
    console.warn('[ResumeParser] Method 2 direct extraction failed:', err?.message || err);
  }

  // Method 3: Stream Decompression Fallback (FlateDecode)
  // Extracts text strings directly from decompressed internal streams
  try {
    console.log('[ResumeParser] Method 3: Attempting raw /FlateDecode stream extraction...');
    const rawLatin = buffer.toString('latin1');
    const decompressedTexts: string[] = [];

    // Search for stream ... endstream blocks
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let streamMatch;

    while ((streamMatch = streamRegex.exec(rawLatin)) !== null) {
      const streamBytes = Buffer.from(streamMatch[1], 'latin1');
      let inflated: Buffer | null = null;
      try {
        inflated = zlib.inflateSync(streamBytes);
      } catch {
        try {
          inflated = zlib.inflateRawSync(streamBytes);
        } catch {}
      }

      if (inflated) {
        const decompressedStr = inflated.toString('utf-8');
        // Extract Tj strings: (some text) Tj
        const tjRegex = /\(([^\(\)\\]*(?:\\.[^\(\)\\]*)*)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(decompressedStr)) !== null) {
          const t = tjMatch[1].replace(/\\([()\\])/g, '$1').trim();
          if (t) decompressedTexts.push(t);
        }

        // Extract TJ array strings: [ (text1) 12 (text2) ] TJ
        const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
        let arrayMatch;
        while ((arrayMatch = tjArrayRegex.exec(decompressedStr)) !== null) {
          const innerTj = arrayMatch[1];
          const innerStrings = innerTj.match(/\(([^\(\)\\]*(?:\\.[^\(\)\\]*)*)\)/g);
          if (innerStrings) {
            const joined = innerStrings
              .map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
              .join('');
            if (joined.trim()) decompressedTexts.push(joined.trim());
          }
        }
      }
    }

    if (decompressedTexts.length > 0) {
      const combinedDecompressed = decompressedTexts.join(' ');
      console.log(`[ResumeParser] Method 3: Extracted ${combinedDecompressed.length} characters from FlateDecode streams.`);
      if (combinedDecompressed.length >= 40) {
        return { text: combinedDecompressed, isOcrApplied: false };
      }
    }
  } catch (err: any) {
    console.warn('[ResumeParser] Method 3 stream decompression non-fatal failure:', err?.message);
  }

  // Method 4: OCR Fallback for Scanned or Image-Based PDFs
  console.log('[ResumeParser] Normal text extraction yielded insufficient selectable text. Checking for OCR capability...');
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      console.log('[ResumeParser] OCR Fallback: Calling Gemini Multimodal OCR on PDF...');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const ocrPrompt = `You are a high-precision document OCR and resume transcription system.
The provided PDF file is a candidate's resume (or CV) that may be scanned, image-based, or formatted with non-standard fonts.
Perform complete, verbatim Optical Character Recognition (OCR) and transcribe all readable text.
Preserve all candidate details:
- Candidate Name, Email, Phone, LinkedIn, GitHub
- Career Objective / Professional Summary
- Education (Degrees, College/University, CGPA/GPA, Year)
- Technical Skills (Languages, Frameworks, Tools)
- Soft Skills
- Projects (Academic, Personal, Capstone)
- Internships / Work Experience
- Certifications (NPTEL, Coursera, IBM, Zscaler, etc.)
- Professional Memberships (CSI, IEEE, ACM, etc.)
- Achievements & Extracurricular Activities

Return ONLY the transcribed plain text with natural line breaks. Do not include markdown code fences, JSON wrapping, or introductory conversation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: buffer.toString('base64'),
            },
          },
          { text: ocrPrompt },
        ],
      });

      const ocrText = response.text?.trim() || '';
      console.log(`[ResumeParser] Gemini OCR transcribed ${ocrText.length} characters.`);
      if (ocrText.length >= 40) {
        return { text: ocrText, isOcrApplied: true };
      }
    } catch (ocrErr: any) {
      console.warn('[ResumeParser] Gemini OCR attempt encountered error:', ocrErr?.message || ocrErr);
    }
  } else {
    console.warn('[ResumeParser] GEMINI_API_KEY is not configured or is a placeholder. Skipping Gemini Multimodal OCR.');
  }

  // Method 5: Plain ASCII/latin1 Tj tokens (for uncompressed legacy PDFs)
  try {
    const raw = buffer.toString('latin1');
    const tjRegex = /\(([^\(\)\\]*(?:\\.[^\(\)\\]*)*)\)\s*Tj/g;
    let tjMatch;
    const tjTokens: string[] = [];
    while ((tjMatch = tjRegex.exec(raw)) !== null) {
      const unescaped = tjMatch[1].replace(/\\([()\\])/g, '$1').replace(/\\n/g, '\n').replace(/\\r/g, '');
      if (unescaped.trim()) tjTokens.push(unescaped.trim());
    }
    if (tjTokens.length > 0) {
      const combinedTj = tjTokens.join(' ');
      if (combinedTj.length >= 40) {
        return { text: combinedTj, isOcrApplied: false };
      }
    }
  } catch {}

  return { text: '', isOcrApplied: false };
}

/**
 * Cleans and normalizes extracted resume text to remove page artifacts,
 * unglue joined words, standardize bullet characters, and normalize spacing.
 */
function cleanExtractedResumeText(rawText: string): string {
  let cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\0/g, '') // remove null characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
    // Remove page footer markers like "-- 1 of 2 --" or "Page 1 of 3"
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
    .replace(/Page\s+\d+\s+of\s+\d+/gi, '')
    // Normalize bullet symbols to standard dash
    .replace(/[\u2022\u25cf\u25aa\u2023\u2043\u2219\u25cb\u25e6]/g, '-')
    // Normalize horizontal whitespaces
    .replace(/[ \t]+/g, ' ');

  // Unglue joined words (e.g. "EngineeringSkills" -> "Engineering Skills", "BasicsHTML" -> "Basics HTML")
  cleaned = cleaned
    .replace(/([a-z0-9])([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  // Normalize multiple consecutive empty lines to maximum 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

/**
 * Extracts structured candidate profile data directly from the cleaned resume text
 */
export function extractCandidateProfileFromText(text: string): ICandidateProfile {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // 2. Extract Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // 3. Extract GitHub
  const githubMatch = text.match(/(?:github\.com\/)([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? `github.com/${githubMatch[1]}` : undefined;

  // 4. Extract LinkedIn
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/)([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : undefined;

  // 5. Extract Candidate Name (First clean line that isn't a heading or contact info)
  let name = 'Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const isHeaderWord = /^(resume|curriculum|vitae|cv|contact|summary|profile|about|objective)$/i.test(line);
    const hasContactSymbols = line.includes('@') || line.includes('http') || line.includes('github') || line.includes('linkedin');
    const isJobTitleOnly = /^(software engineer|frontend developer|backend developer|full stack developer|web developer)$/i.test(line);

    if (!isHeaderWord && !hasContactSymbols && !isJobTitleOnly && line.length >= 3 && line.length <= 40) {
      name = line.replace(/^(name\s*:\s*)/i, '').replace(/[\(\[].*?[\)\]]/g, '').trim();
      break;
    }
  }

  // 6. Extract Headline / Current Role
  let headline = 'Software Engineer';
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (
      /(engineer|developer|architect|analyst|scientist|specialist|lead|student|intern|fresher)/i.test(line) &&
      line !== name &&
      !line.includes('@') &&
      !line.includes('http')
    ) {
      headline = line.replace(/^(title\s*:\s*)/i, '').slice(0, 70).trim();
      break;
    }
  }

  // 7. Extract Years of Experience
  const expMatch = text.match(/(\d+[\+]?)\s*(?:years|yrs)\s*(?:of)?\s*experience/i);
  const yearsOfExperience = expMatch ? `${expMatch[1]} years` : 'Student / Fresher';

  // 8. Extract Summary snippet
  let summary = '';
  const summaryIdx = lines.findIndex(l => /^(summary|professional summary|about me|profile|objective|career objective)/i.test(l));
  if (summaryIdx !== -1 && summaryIdx + 1 < lines.length) {
    summary = lines.slice(summaryIdx + 1, summaryIdx + 4).join(' ').slice(0, 300);
  }

  return {
    name,
    headline,
    email,
    phone,
    github,
    linkedin,
    yearsOfExperience,
    summary: summary || undefined,
  };
}

export async function parseResumeFile(
  buffer: Buffer,
  mimeType: string,
  originalName: string
): Promise<ParseResult> {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';

  if (!buffer || buffer.length === 0) {
    console.warn('[ResumeParser] Uploaded file is 0 bytes.');
    return {
      text: '',
      charCount: 0,
      wordCount: 0,
      isReadable: false,
      error: 'The uploaded file is empty. Please upload a valid resume.',
    };
  }

  let rawText = '';
  let isOcrApplied = false;

  try {
    if (
      mimeType === 'application/pdf' ||
      extension === 'pdf'
    ) {
      const extraction = await extractPdfText(buffer, originalName);
      rawText = extraction.text;
      isOcrApplied = extraction.isOcrApplied;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === 'docx'
    ) {
      try {
        console.log(`[ResumeParser] Parsing DOCX resume ${originalName}...`);
        const docxResult = await mammoth.extractRawText({ buffer });
        rawText = docxResult.value || '';
        console.log(`[ResumeParser] DOCX extracted ${rawText.length} characters.`);
      } catch (docxErr: any) {
        console.error('[ResumeParser] DOCX extraction error:', docxErr);
        return {
          text: '',
          charCount: 0,
          wordCount: 0,
          isReadable: false,
          error: 'Could not read this DOCX file. It may be corrupted or password-protected. Please upload a valid PDF or DOCX resume.',
        };
      }
    } else {
      return {
        text: '',
        charCount: 0,
        wordCount: 0,
        isReadable: false,
        error: 'Unsupported file format. Please upload your resume as PDF or DOCX.',
      };
    }

    // Clean up and normalize extracted text
    const cleanedText = cleanExtractedResumeText(rawText);
    const charCount = cleanedText.length;
    const wordCount = cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0;

    console.log(`[ResumeParser] Cleaned text -> chars: ${charCount}, words: ${wordCount}, isOcr: ${isOcrApplied}`);

    // Minimum meaningful resume text check
    if (charCount < 35 || wordCount < 8) {
      console.warn(`[ResumeParser] Extracted text too brief: ${charCount} chars, ${wordCount} words.`);
      return {
        text: '',
        charCount,
        wordCount,
        isReadable: false,
        isOcrApplied,
        error: 'The uploaded PDF contains insufficient readable text (it may be a scanned image or photo). Please upload a text-based PDF or DOCX resume.',
      };
    }

    // Extract structured candidate metadata
    const candidateProfile = extractCandidateProfileFromText(cleanedText);
    console.log(`[ResumeParser] Extracted profile -> Name: "${candidateProfile.name}", Headline: "${candidateProfile.headline}", Email: ${candidateProfile.email || 'None'}`);

    return {
      text: cleanedText,
      charCount,
      wordCount,
      isReadable: true,
      isOcrApplied,
      candidateProfile,
    };
  } catch (err: any) {
    console.error('[ResumeParser] Error in parseResumeFile:', err);
    const msg = err?.message || '';
    let userMsg = msg;
    if (!userMsg || userMsg.includes('Invalid PDF structure') || userMsg.includes('FormatError')) {
      userMsg = 'This PDF file appears to be corrupted or invalid. Please re-export your resume as a fresh PDF or DOCX.';
    }
    return {
      text: '',
      charCount: 0,
      wordCount: 0,
      isReadable: false,
      error: userMsg,
    };
  }
}
