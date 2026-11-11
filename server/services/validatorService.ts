export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: 'UNSUPPORTED_FORMAT' | 'UNREADABLE' | 'EMPTY' | 'NOT_RESUME';
  indicators?: {
    hasContactInfo: boolean;
    hasEducation: boolean;
    hasExperienceOrProjects: boolean;
    hasSkills: boolean;
    sectionCount: number;
    negativeSignals: string[];
  };
}

/**
 * Validates that uploaded file has an allowed extension and mime type.
 * ONLY PDF and DOCX are permitted.
 * TXT, images, spreadsheets, presentations, archives are strictly rejected.
 */
export function validateFileFormat(
  filename: string,
  mimeType: string
): { isAllowed: boolean; error?: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const allowedExtensions = ['pdf', 'docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  // Check explicit forbidden types first
  const forbiddenExts = [
    'txt', 'text', 'doc', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp',
    'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'zip', 'rar', '7z', 'tar', 'gz',
    'json', 'xml', 'html', 'js', 'py', 'java', 'c', 'cpp', 'sh'
  ];

  if (forbiddenExts.includes(ext)) {
    return {
      isAllowed: false,
      error: 'Unsupported file format. Please upload your resume as PDF or DOCX.',
    };
  }

  const hasAllowedExt = allowedExtensions.includes(ext);
  const hasAllowedMime = allowedMimeTypes.includes(mimeType) || mimeType === 'application/octet-stream';

  if (!hasAllowedExt || !hasAllowedMime) {
    return {
      isAllowed: false,
      error: 'Unsupported file format. Please upload your resume as PDF or DOCX.',
    };
  }

  return { isAllowed: true };
}

/**
 * Validates document content to ensure it is actually a candidate Resume / CV,
 * and NOT an assignment, certificate, lecture notes, question paper,
 * project report / thesis, or arbitrary non-resume document.
 */
export function validateResumeContent(
  text: string,
  filename?: string
): ValidationResult {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      errorCode: 'UNREADABLE',
      error: "We couldn't read text from this file. Please ensure your resume contains selectable text or upload a DOCX file.",
    };
  }

  const clean = text.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const charCount = clean.length;

  // Minimum readable content check (very lenient to support concise 1-page fresher resumes)
  if (charCount < 40 || wordCount < 10) {
    return {
      isValid: false,
      errorCode: 'EMPTY',
      error: "This document doesn't contain enough readable content to analyze. Please upload a complete resume.",
    };
  }

  // Preprocess text: unglue words that were joined without spaces during PDF extraction
  // (e.g. "EngineeringSkills", "CSSSoft", "CertificationsNPTEL", "MembershipIEEE")
  const normalizedText = clean
    .replace(/([a-z0-9])([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  const lower = normalizedText.toLowerCase();
  const fnameLower = (filename || '').toLowerCase();

  // 1. Identify Candidate Contact & Profile Information
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(normalizedText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(normalizedText);
  const hasProfiles = /linkedin\.com|github\.com|portfolio|gitlab\.com|leetcode\.com|hackerrank\.com|codechef\.com|medium\.com|kaggle\.com|behance\.net/i.test(normalizedText);
  const hasContactInfo = hasEmail || hasPhone || hasProfiles;

  // 2. Identify Resume Sections & Headings (Flexible and Fresher-Friendly)
  // Work experience and projects are explicitly OPTIONAL - freshers commonly have
  // Objective, Education, Technical Skills, Soft Skills, Certifications, and Professional Membership.
  const educationRegex = /\b(education|academic|academics|degree|university|college|school|institute|b\.?tech|b\.?e\.?|m\.?tech|m\.?s\.?|b\.?sc|m\.?sc|bca|mca|bachelor|master|ph\.?d|diploma|graduation|graduated|cgpa|gpa|sslc|hsc|percentage|board|coursework|matriculation|secondary\s+school|engineering|computer\s+science)\b/i;
  const skillsRegex = /\b(technical\s+skills?|skills?|programming\s+languages?|technologies|frameworks|tools|web\s+technologies|core\s+competencies|technical\s+stack|key\s+skills?|expertise|computer\s+skills?|competencies|skill\s+set|languages\s+known|technical\s+knowledge|libraries|proficiencies)\b/i;
  const softSkillsRegex = /\b(soft\s+skills?|interpersonal\s+skills?|personal\s+skills?|communication\s+skills?|behavioral\s+competencies|key\s+strengths?|strengths|leadership\s+skills?|teamwork)\b/i;
  const projectsRegex = /\b(projects?|academic\s+projects?|personal\s+projects?|technical\s+projects?|mini\s+projects?|major\s+projects?|capstone|key\s+projects?|portfolio|key\s+deliverables|system\s+developed|application\s+built|developed\s+a)\b/i;
  const objectiveRegex = /\b(objective|career\s+objective|professional\s+objective|summary|professional\s+summary|profile|about\s+me|personal\s+profile|executive\s+summary|overview|career\s+goal|target\s+role)\b/i;
  const internshipRegex = /\b(internships?|intern\b|trainee|industrial\s+training|apprenticeship|summer\s+intern)\b/i;
  const certificationsRegex = /\b(certifications?|certificates?|certified|credentials?|licenses?|courses?|bootcamps?|workshops?|training|nptel|zscaler|ibm\s+skillsbuild|coursera|udemy|edx)\b/i;
  const membershipRegex = /\b(professional\s+memberships?|memberships?|professional\s+affiliations?|affiliations?|professional\s+bodies|societies|ieee|acm|csi|iste|computer\s+society)\b/i;
  const achievementsRegex = /\b(achievements?|accomplishments?|awards?|honors?|honours?|extracurricular|co-curricular|activities|hackathons?|competitions?|positions\s+of\s+responsibility|leadership|participations?)\b/i;
  const experienceRegex = /\b(experience|work\s+experience|professional\s+experience|employment|work\s+history|career\s+history|job\s+history)\b/i;

  const hasEducation = educationRegex.test(normalizedText);
  const hasSkills = skillsRegex.test(normalizedText);
  const hasSoftSkills = softSkillsRegex.test(normalizedText);
  const hasProjects = projectsRegex.test(normalizedText);
  const hasObjective = objectiveRegex.test(normalizedText);
  const hasInternship = internshipRegex.test(normalizedText);
  const hasCertifications = certificationsRegex.test(normalizedText);
  const hasMembership = membershipRegex.test(normalizedText);
  const hasAchievements = achievementsRegex.test(normalizedText);
  const hasExperience = experienceRegex.test(normalizedText);

  // 3. Technical Vocabulary Density
  // Check if candidate mentions common technical skills, programming languages, or platforms
  const techKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'html', 'css', 'react', 'angular',
    'vue', 'node', 'express', 'spring', 'django', 'flask', 'sql', 'mysql', 'postgresql', 'mongodb',
    'sqlite', 'git', 'github', 'docker', 'kubernetes', 'linux', 'aws', 'gcp', 'azure', 'figma',
    'tailwind', 'redux', 'rest', 'api', 'oop', 'dsa', 'machine learning', 'deep learning',
    'data structures', 'algorithm', 'pandas', 'numpy', 'pytorch', 'tensorflow', 'bootstrap',
    'postman', 'vscode', 'firebase', 'android', 'flutter', 'dart', 'next.js', 'redis', 'kafka',
    'nptel', 'zscaler', 'ibm'
  ];
  let techKeywordCount = 0;
  for (const kw of techKeywords) {
    if (lower.includes(kw)) {
      techKeywordCount++;
    }
  }

  // Also check single-letter / special languages like 'C'
  if (/\b(c|c language|programming in c)\b/i.test(normalizedText)) {
    techKeywordCount++;
  }

  // Count detected sections
  let sectionCount = 0;
  if (hasEducation) sectionCount++;
  if (hasSkills) sectionCount++;
  if (hasSoftSkills) sectionCount++;
  if (hasProjects) sectionCount++;
  if (hasObjective) sectionCount++;
  if (hasInternship) sectionCount++;
  if (hasCertifications) sectionCount++;
  if (hasMembership) sectionCount++;
  if (hasAchievements) sectionCount++;
  if (hasExperience) sectionCount++;

  console.log('[ResumeValidator] Validating document:', filename || 'uploaded_file');
  console.log(`[ResumeValidator] Section Breakdown -> Objective: ${hasObjective}, Education: ${hasEducation}, TechSkills: ${hasSkills}, SoftSkills: ${hasSoftSkills}, Certifications: ${hasCertifications}, Membership: ${hasMembership}, Projects: ${hasProjects}, Experience: ${hasExperience}`);
  console.log(`[ResumeValidator] Stats -> wordCount: ${wordCount}, charCount: ${charCount}, sectionCount: ${sectionCount}, techKeywords: ${techKeywordCount}, hasContact: ${hasContactInfo}`);

  // 4. Check for True Non-Resume Documents (Assignments, standalone certificate scans, invoices, lecture notes)
  // CRITICAL: Only flag as non-resume if it lacks genuine resume attributes.
  const isCandidateResume = hasContactInfo || hasEducation || (techKeywordCount >= 2) || (hasSkills && (hasEducation || hasObjective || hasSoftSkills));

  // A. Assignment / Question Paper check
  const hasAssignmentMarkers =
    /\b(assignment\s*[-#:]?\s*\d+|homework\s*[-#:]?\s*\d+|problem\s+set\s*[-#:]?\s*\d+)\b/i.test(normalizedText) &&
    /\b(total\s+marks|maximum\s+marks|due\s+date|submission\s+deadline|answer\s+all\s+questions)\b/i.test(normalizedText);

  if (hasAssignmentMarkers && !isCandidateResume) {
    console.warn('[ResumeValidator] Rejected as assignment document.');
    return {
      isValid: false,
      errorCode: 'NOT_RESUME',
      error: "This document appears to be an academic assignment or question paper. CareerMind AI is designed strictly to evaluate candidate resumes and CVs. Please upload your resume.",
    };
  }

  // B. Single Certificate Document check
  // A certificate-only document is brief (< 150 words), asserts "This is to certify that" without education, skills, or objective
  const isPureCertificate =
    wordCount < 150 &&
    /this\s+is\s+to\s+certify\s+that|certificate\s+of\s+(completion|participation|achievement)|is\s+hereby\s+awarded\s+to/i.test(normalizedText) &&
    !hasProjects &&
    !hasEducation &&
    !hasSkills &&
    !hasObjective &&
    !hasMembership &&
    techKeywordCount === 0;

  if (isPureCertificate) {
    console.warn('[ResumeValidator] Rejected as standalone single certificate.');
    return {
      isValid: false,
      errorCode: 'NOT_RESUME',
      error: "This document appears to be a standalone certificate. Please upload your complete resume detailing your education, technical skills, and projects.",
    };
  }

  // C. Lecture Notes / Textbook check
  const isPureLectureNotes =
    /\b(lecture\s*\d+|unit\s*[-:]?\s*[ivxlcdm\d]+|chapter\s*\d+)\b/i.test(normalizedText) &&
    /\b(definition\s*\d*[\.:]|theorem\s*\d*[\.:]|lemma\s*\d*[\.:]|proof\s*:)\b/i.test(normalizedText) &&
    !hasContactInfo &&
    !hasEducation &&
    !hasSkills;

  if (isPureLectureNotes) {
    console.warn('[ResumeValidator] Rejected as lecture notes.');
    return {
      isValid: false,
      errorCode: 'NOT_RESUME',
      error: "This document appears to be lecture notes or textbook material. Please upload your candidate resume or CV.",
    };
  }

  // D. Pure Invoice / Receipt check
  const isPureInvoice =
    /\b(tax\s+invoice|bill\s+to\s*:|ship\s+to\s*:)\b/i.test(normalizedText) &&
    /\b(amount\s+due|total\s+due|subtotal\s*[:$]|unit\s+price)\b/i.test(normalizedText) &&
    !hasContactInfo &&
    !hasEducation &&
    techKeywordCount === 0;

  if (isPureInvoice) {
    console.warn('[ResumeValidator] Rejected as invoice.');
    return {
      isValid: false,
      errorCode: 'NOT_RESUME',
      error: "This document appears to be an invoice or financial bill. Please upload your candidate resume or CV.",
    };
  }

  // 5. Holistic Candidate Resume Decision Formula
  // Calculate a holistic resume confidence score (0 to 100)
  let resumeConfidence = 0;

  if (hasContactInfo) resumeConfidence += 25;
  if (hasEducation) resumeConfidence += 25;
  if (hasSkills) resumeConfidence += 25;
  if (hasSoftSkills) resumeConfidence += 15;
  if (hasObjective) resumeConfidence += 20;
  if (hasCertifications) resumeConfidence += 15;
  if (hasMembership) resumeConfidence += 15;
  if (hasProjects) resumeConfidence += 15;
  if (hasInternship || hasExperience) resumeConfidence += 15;
  if (hasAchievements) resumeConfidence += 10;
  if (techKeywordCount >= 2) resumeConfidence += 20;

  // A genuine resume satisfies ANY of the following flexible criteria:
  // - Confidence score >= 25
  // - Contact info + at least 1 section (e.g. Email + Skills, or Phone + Education)
  // - At least 2 candidate sections (e.g. Education + Skills, Objective + Education, Skills + Certifications, etc.)
  // - Contains multiple technical skills and education/objective/certifications
  // - Notice: Work Experience and Projects are NOT mandatory!
  const isValidResume =
    resumeConfidence >= 25 ||
    (hasEducation && (hasSkills || hasSoftSkills || hasObjective || hasCertifications || hasMembership)) ||
    (hasSkills && (hasEducation || hasSoftSkills || hasObjective || hasCertifications || hasMembership)) ||
    (hasObjective && (hasEducation || hasSkills || hasSoftSkills || hasCertifications || hasMembership)) ||
    (hasContactInfo && (hasEducation || hasSkills || hasObjective || hasCertifications || hasMembership || techKeywordCount >= 1)) ||
    (sectionCount >= 2) ||
    (techKeywordCount >= 2);

  console.log(`[ResumeValidator] Validation Decision -> isValid: ${isValidResume}, confidence: ${resumeConfidence}`);

  if (!isValidResume) {
    return {
      isValid: false,
      errorCode: 'NOT_RESUME',
      error: "This file doesn't appear to contain resume content. Please ensure your document includes your technical skills, education, projects, or background.",
      indicators: {
        hasContactInfo,
        hasEducation,
        hasExperienceOrProjects: hasExperience || hasProjects || hasInternship,
        hasSkills,
        sectionCount,
        negativeSignals: [],
      },
    };
  }

  return {
    isValid: true,
    indicators: {
      hasContactInfo,
      hasEducation,
      hasExperienceOrProjects: hasExperience || hasProjects || hasInternship,
      hasSkills,
      sectionCount,
      negativeSignals: [],
    },
  };
}
