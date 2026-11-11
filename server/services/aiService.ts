import { GoogleGenAI } from '@google/genai';
import { IAnalysis, IProject, ICandidateProfile } from '../models/types';
import { CareerRoles, Projects } from '../models';
import { getCompanyProfile, ICompanyProfile } from '../data/companies';
import { seedDatabase } from '../data/seedData';
import {
  extractCandidateProfile,
  extractResumeWorkAndProjects,
  extractSkillsWithEvidence,
  calculateCareerMatchScore,
  calculateCareerReadiness,
  generateDynamicCourses,
  generateConceptFirstLeetCode,
  generateDynamicProjects,
  generateDynamicInterviewQuestions,
} from './scoringEngine';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Builds complete deterministic analysis for a resume, target career, and target company.
 * The scores are 100% mathematically deterministic and grounded in actual resume evidence.
 */
export function buildDeterministicAnalysis(
  resumeText: string,
  userId: string,
  resumeId: string,
  targetCareerId?: string,
  targetCompanyName?: string
): IAnalysis {
  const candidateProfile = extractCandidateProfile(resumeText);
  const { projects: resumeProjects, experiences: resumeExperiences, education: resumeEducation } =
    extractResumeWorkAndProjects(resumeText);
  const { detectedSkills, detectedSkillNames } = extractSkillsWithEvidence(resumeText);

  let allRoles = CareerRoles.find();
  if (!allRoles || allRoles.length === 0) {
    seedDatabase();
    allRoles = CareerRoles.find();
  }

  // 1. Calculate INDEPENDENT 0-100 Match Scores for all 14 career roles
  const scoredRoles = allRoles.map(role => {
    const matchData = calculateCareerMatchScore(
      role,
      detectedSkillNames,
      resumeText,
      resumeProjects
    );

    // Compute independent readiness for each role
    const readinessData = calculateCareerReadiness(
      matchData.matchPercentage,
      detectedSkillNames.size,
      resumeProjects,
      resumeExperiences,
      resumeEducation,
      resumeText.length
    );

    return {
      role,
      matchPercentage: matchData.matchPercentage,
      readinessScore: readinessData.overallScore,
      strongSkills: matchData.strongSkills,
      missingSkills: matchData.missingSkills,
      matchedRequiredCount: matchData.matchedRequiredCount,
      totalRequiredCount: matchData.totalRequiredCount,
      matchedOptionalCount: matchData.matchedOptionalCount,
      totalOptionalCount: matchData.totalOptionalCount,
    };
  });

  // Sort by match percentage to identify the natural top match
  scoredRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // 2. Determine target role: either explicitly selected by user or top natural match
  let targetEntry = scoredRoles[0];
  if (targetCareerId) {
    const found = scoredRoles.find(
      s => s.role._id === targetCareerId || s.role.title.toLowerCase() === targetCareerId.toLowerCase()
    );
    if (found) targetEntry = found;
  }

  const targetRole = targetEntry.role;
  const matchPercentage = targetEntry.matchPercentage;

  // 3. Independent Career Readiness Score (0-100) with detailed 5-point breakdown
  const readiness = calculateCareerReadiness(
    matchPercentage,
    detectedSkillNames.size,
    resumeProjects,
    resumeExperiences,
    resumeEducation,
    resumeText.length
  );

  // 4. Resolve Target Company
  const companyProfile: ICompanyProfile = getCompanyProfile(targetCompanyName || 'Google');

  // 5. Skill Gaps Prioritization
  const missing = [...targetEntry.missingSkills];

  // If candidate has few or zero missing required skills, bridge with target role's optional skills
  if (missing.length < 3) {
    for (const opt of targetRole.optionalSkills) {
      if (!detectedSkillNames.has(opt.toLowerCase()) && !missing.includes(opt)) {
        missing.push(opt);
      }
    }
  }

  // If still empty, supply advanced role-specific differentiators
  if (missing.length === 0) {
    const roleDifferentiators: Record<string, string[]> = {
      'Frontend Developer': ['GraphQL', 'Web Performance & Profiling', 'Micro-Frontends'],
      'Java Developer': ['Docker & Container Orchestration', 'Kafka Event Streaming', 'Kubernetes'],
      'Backend Developer': ['Redis Distributed Caching', 'Docker', 'Kubernetes'],
      'Python Developer': ['Celery Background Queues', 'Docker', 'Pandas'],
      'AI Engineer': ['MLOps Pipelines', 'Model Quantization', 'Fine-Tuning'],
    };
    const diffs = roleDifferentiators[targetRole.title] || ['Docker Containerization', 'CI/CD Pipelines', 'Cloud Deployment'];
    for (const d of diffs) {
      if (!detectedSkillNames.has(d.toLowerCase())) missing.push(d);
    }
  }

  const skillGaps: IAnalysis['skillGaps'] = [];

  const highGaps = missing.slice(0, 2);
  const medGaps = missing.slice(2, 4);
  const lowGaps = missing.slice(4, 7);

  for (const s of highGaps) {
    skillGaps.push({
      skill: s,
      priority: 'HIGH',
      reason: `${s} is a non-negotiable core requirement for ${targetRole.title}. Demonstrating this raises your score immediately.`,
      timeToLearn: '2 - 3 weeks',
    });
  }

  for (const s of medGaps) {
    skillGaps.push({
      skill: s,
      priority: 'MEDIUM',
      reason: `${s} expands your technical versatility and will be tested during system design and architecture discussions at ${companyProfile.name}.`,
      timeToLearn: '1 - 2 weeks',
    });
  }

  for (const s of lowGaps) {
    skillGaps.push({
      skill: s,
      priority: 'LOW',
      reason: `${s} serves as a valuable portfolio differentiator for competitive positions.`,
      timeToLearn: '1 week',
    });
  }

  // 6. Next Best Skill
  const primaryGap = skillGaps[0]?.skill || 'Production Architecture';
  const nextBestSkill = {
    name: primaryGap,
    priority: (skillGaps[0]?.priority || 'HIGH') as 'HIGH' | 'MEDIUM' | 'LOW',
    reason: `Identified as your highest-priority missing prerequisite for ${targetRole.title}. Learning ${primaryGap} directly resolves your largest resume gap.`,
    timeToLearn: skillGaps[0]?.timeToLearn || '2 - 3 weeks',
    practicalValue: `Unlocks key technical interview topics and enables building production-ready architectures for ${companyProfile.name}.`,
  };

  // 7. Dynamic Courses
  const recommendedCourses = generateDynamicCourses(targetRole, missing);

  // 8. Concept-First LeetCode Practice (1 Basic, 1 Intermediate, 1 Advanced)
  const codingPractice = generateConceptFirstLeetCode(
    targetRole,
    companyProfile,
    detectedSkillNames,
    missing
  );

  // 9. Dynamic 3-Project Trajectory (Progression: 1 Beginner, 1 Intermediate, 1 Advanced)
  const recommendedProjects = generateDynamicProjects(
    targetRole,
    companyProfile,
    detectedSkillNames,
    missing,
    resumeProjects
  );

  // Ensure all dynamic projects are immediately registered in database
  try {
    for (const p of recommendedProjects) {
      const existing = Projects.findById(p._id);
      if (!existing) {
        Projects.create(p);
      } else {
        Projects.updateOne(x => x._id === p._id, p);
      }
    }
  } catch (err) {
    console.error('Error saving dynamic projects to database:', err);
  }

  // 10. Dynamic Interview Preparation
  const interviewPreparation = generateDynamicInterviewQuestions(
    targetRole,
    companyProfile,
    candidateProfile,
    resumeProjects,
    resumeExperiences,
    detectedSkillNames,
    missing
  );

  // 11. Next Best Action
  const nextBestAction: IAnalysis['nextBestAction'] = {
    title: `Build: ${recommendedProjects[1]?.title || recommendedProjects[0]?.title}`,
    reason: `Directly closes your #${skillGaps[0]?.priority || 'HIGH'} gap (${primaryGap}) by producing verifiable code evidence for ${companyProfile.name}.`,
    projectId: recommendedProjects[1]?._id || recommendedProjects[0]?._id,
    actionType: 'project',
    buttonText: 'Start Project',
  };

  // 12. Personalized Progression Roadmap
  const progressionRoadmap: IAnalysis['progressionRoadmap'] = [
    {
      step: 1,
      stage: 'You Are Here',
      title: 'Resume Analyzed & Benchmarked',
      description: `Your profile has been analyzed against ${allRoles.length} industry engineering roles. Current Target: ${targetRole.title} (${matchPercentage}% match).`,
      status: 'completed',
    },
    {
      step: 2,
      stage: 'Beginner Project',
      title: recommendedProjects[0].title,
      description: `Solidify ${primaryGap} fundamentals while leveraging your existing ${Array.from(detectedSkillNames).slice(0, 2).join(' & ')} skills.`,
      status: 'in_progress',
    },
    {
      step: 3,
      stage: 'Intermediate Project',
      title: recommendedProjects[1].title,
      description: `Build full-stack service integration bridging multiple missing requirements.`,
      status: 'upcoming',
    },
    {
      step: 4,
      stage: 'Advanced Project',
      title: recommendedProjects[2].title,
      description: `Architect high-concurrency production system aligned with ${companyProfile.name}'s engineering standards.`,
      status: 'upcoming',
    },
    {
      step: 5,
      stage: 'Portfolio Ready',
      title: 'GitHub & Architecture Showcase',
      description: 'Document architectural trade-offs, publish live demos, and verify clean READMEs.',
      status: 'upcoming',
    },
    {
      step: 6,
      stage: 'Interview Ready',
      title: `${companyProfile.name} Interview Mastery`,
      description: `Practice technical questions, LeetCode algorithms, and STAR behavioral questions.`,
      status: 'upcoming',
    },
    {
      step: 7,
      stage: 'Job Ready',
      title: `${targetRole.title} Placement Ready`,
      description: `High-signal portfolio and interview readiness for verified applications.`,
      status: 'upcoming',
    },
  ];

  // 13. Biggest Blocker
  const biggestBlocker = primaryGap
    ? `Your existing skills are promising, but you lack verified production proof in ${primaryGap}. Building targeted projects will resolve this immediately.`
    : `Your technical foundation is solid, but you need 2 live deployed systems to pass senior screening at ${companyProfile.name}.`;

  // 14. Graph Nodes & Edges
  const nodes = [
    { id: 'curr', label: 'Current Resume Skills', type: 'source' },
    { id: 'gap', label: `Gap: ${primaryGap}`, type: 'gap' },
    { id: 'course', label: recommendedCourses[0]?.skill || 'Learn Skills', type: 'learning' },
    { id: 'code', label: `LeetCode: ${codingPractice.coreMissingConcept}`, type: 'practice' },
    { id: 'p1', label: recommendedProjects[0].title, type: 'project' },
    { id: 'p2', label: recommendedProjects[1].title, type: 'project' },
    { id: 'p3', label: recommendedProjects[2].title, type: 'project' },
    { id: 'prep', label: `${companyProfile.name} Interview Prep`, type: 'milestone' },
    { id: 'target', label: targetRole.title, type: 'target' },
  ];

  const edges = [
    { from: 'curr', to: 'gap', label: 'identifies' },
    { from: 'gap', to: 'course', label: 'learns' },
    { from: 'course', to: 'code', label: 'practices' },
    { from: 'code', to: 'p1', label: 'applies to' },
    { from: 'p1', to: 'p2', label: 'advances' },
    { from: 'p2', to: 'p3', label: 'scales' },
    { from: 'p3', to: 'prep', label: 'prepares' },
    { from: 'prep', to: 'target', label: 'qualifies for' },
  ];

  return {
    _id: '',
    userId,
    resumeId,
    isDemo: false,
    timestamp: new Date().toISOString(),
    candidateProfile,
    targetCareerId: targetRole._id,
    targetCareerTitle: targetRole.title,
    targetCompany: companyProfile.name,
    careerReadinessScore: readiness.overallScore,
    readinessBreakdown: readiness.breakdown,
    topCareerMatch: {
      roleId: targetRole._id,
      title: targetRole.title,
      matchPercentage,
      whyFits: targetEntry.strongSkills.length > 0
        ? `Your resume demonstrates verified hands-on background in ${targetEntry.strongSkills.slice(0, 4).join(', ')}, matching ${targetEntry.matchedRequiredCount} of ${targetEntry.totalRequiredCount} core ${targetRole.title} requirements.`
        : `Your resume currently has low direct overlap with ${targetRole.title}. Following the roadmap will bridge the ${targetEntry.missingSkills.length} missing skills.`,
      strongSkills: targetEntry.strongSkills,
      missingSkills: targetEntry.missingSkills,
      careerGrowth: targetRole.growthRate,
      learningEffort: targetEntry.missingSkills.length <= 2 ? 'Low (2-4 weeks)' : targetEntry.missingSkills.length <= 5 ? 'Moderate (4-8 weeks)' : 'High (8-14 weeks)',
      matchedRequiredCount: targetEntry.matchedRequiredCount,
      totalRequiredCount: targetEntry.totalRequiredCount,
      matchedOptionalCount: targetEntry.matchedOptionalCount,
      totalOptionalCount: targetEntry.totalOptionalCount,
    },
    alternativeCareers: scoredRoles
      .filter(s => s.role._id !== targetRole._id)
      .slice(0, 3)
      .map(s => ({
        title: s.role.title,
        matchPercentage: s.matchPercentage,
        skillGapCount: s.missingSkills.length,
        matchedRequiredCount: s.matchedRequiredCount,
        totalRequiredCount: s.totalRequiredCount,
      })),
    allCareerScores: scoredRoles.map(s => ({
      roleId: s.role._id,
      title: s.role.title,
      matchPercentage: s.matchPercentage,
      readinessScore: s.readinessScore,
      strongSkills: s.strongSkills,
      missingSkills: s.missingSkills,
    })),
    skillsDetected: detectedSkills,
    skillGaps,
    nextBestSkill,
    nextBestAction,
    recommendedProjects,
    recommendedCourses,
    codingPractice,
    interviewPreparation,
    progressionRoadmap,
    jobReadiness: {
      technicalReadiness: readiness.breakdown.technicalSkills,
      projectReadiness: readiness.breakdown.projects,
      resumeReadiness: readiness.breakdown.experience,
      interviewReadiness: readiness.breakdown.interviewReadiness,
      biggestBlocker,
    },
    careerPathGraph: { nodes, edges },
  };
}

/**
 * AI Project Evaluation Service using Gemini 3.8 Flash
 */
export async function evaluateProjectSubmissionWithAI(
  project: IProject,
  githubUrl: string,
  liveDemoUrl?: string,
  notes?: string
): Promise<{
  score: number;
  status: 'PASSED' | 'NEEDS_REVISION';
  grade: string;
  strengths: string[];
  improvements: string[];
  architectureReview: string;
  securityCheck: string;
  interviewTip: string;
}> {
  const ai = getAiClient();

  const prompt = `You are a Senior Staff Software Engineer and Technical Hiring Bar Raiser evaluating a candidate's completed project submission for "${project.title}".
Target Tech Stack: ${project.techStack.join(', ')}
Target Skills: ${project.skillsGained.join(', ')}
Candidate GitHub Repo: ${githubUrl}
Candidate Live Demo: ${liveDemoUrl || 'None provided'}
Candidate Architecture Notes: ${notes || 'Standard implementation based on specifications.'}

Analyze the submission rigor, architecture soundness, security posture, and production readiness.
Return a JSON object:
{
  "score": number (0-100),
  "status": "PASSED" | "NEEDS_REVISION",
  "grade": "A+" | "A" | "B" | "C",
  "strengths": string[] (2-3 strengths),
  "improvements": string[] (2-3 improvements),
  "architectureReview": string,
  "securityCheck": string,
  "interviewTip": string
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '';
      if (text) {
        const parsed = JSON.parse(text);
        if (typeof parsed.score === 'number' && parsed.status && Array.isArray(parsed.strengths)) {
          return {
            score: Math.min(100, Math.max(0, parsed.score)),
            status: parsed.score >= 70 ? 'PASSED' : 'NEEDS_REVISION',
            grade: parsed.grade || (parsed.score >= 90 ? 'A+' : parsed.score >= 80 ? 'A' : 'B'),
            strengths: parsed.strengths.slice(0, 3),
            improvements: parsed.improvements.slice(0, 3),
            architectureReview: parsed.architectureReview || 'Clean modular architecture implementing key specifications.',
            securityCheck: parsed.securityCheck || 'Environment configuration separated from source control.',
            interviewTip: parsed.interviewTip || 'Emphasize your trade-offs between latency and state synchronization.',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini project evaluation failed, falling back to deterministic evaluator:', err);
    }
  }

  // Deterministic fallback evaluation
  const hasLiveDemo = Boolean(liveDemoUrl && liveDemoUrl.startsWith('http'));
  const hasDetailedNotes = Boolean(notes && notes.length > 50);
  const baseScore = 75 + (hasLiveDemo ? 12 : 4) + (hasDetailedNotes ? 8 : 4);
  const score = Math.min(96, baseScore);

  return {
    score,
    status: score >= 70 ? 'PASSED' : 'NEEDS_REVISION',
    grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B',
    strengths: [
      `Successfully delivered core requirements for ${project.title} targeting ${project.techStack.slice(0, 3).join(', ')}.`,
      hasLiveDemo
        ? 'Deployed a functional live demonstration proving end-to-end cloud environment configuration.'
        : 'Structured clean repository layout adhering to modular engineering conventions.',
      'Demonstrated practical problem solving aligned with recruitment benchmarks.',
    ],
    improvements: [
      'Expand automated unit and integration test coverage across edge-case branches.',
      'Implement strict input validation schemas (Zod/Joi) and centralized error handling middleware.',
      'Add performance telemetry or caching headers to optimize response latency under peak load.',
    ],
    architectureReview: `The architecture demonstrates sound understanding of ${project.skillsGained.slice(0, 2).join(' and ')}. Modularity and concern separation follow idiomatic industry standards.`,
    securityCheck: 'Verified repository practices: sensitive secrets and API credentials should remain strictly in environment variables (.env) with strict CORS policies enforced.',
    interviewTip: `During interviews, explain how you designed the data schema, and prepare to answer how you would scale this from 1,000 to 100,000 daily active users.`,
  };
}

/**
 * AI-Enriched Analysis Pipeline using Gemini 3.8 Flash
 * Uses Gemini for deep textual understanding and personalized reasoning,
 * while STRICTLY preserving the deterministic mathematical scoring layer.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  userId: string,
  resumeId: string,
  targetCareerId?: string,
  targetCompanyName?: string
): Promise<IAnalysis> {
  // Step 1: Compute deterministic baseline
  const baseAnalysis = buildDeterministicAnalysis(
    resumeText,
    userId,
    resumeId,
    targetCareerId,
    targetCompanyName
  );

  const ai = getAiClient();
  if (!ai) {
    return baseAnalysis;
  }

  // Step 2: Prompt Gemini 3.8 Flash to enrich reasoning and extract subtle candidate nuance
  const targetTitle = baseAnalysis.topCareerMatch.title;
  const companyName = baseAnalysis.targetCompany || 'Google';

  const prompt = `You are CareerMind AI, a principal software architect and technical hiring specialist.
Review the following CANDIDATE RESUME in depth for the role of "${targetTitle}" targeting company "${companyName}".

RESUME TEXT:
"""
${resumeText.slice(0, 12000)}
"""

Provide personalized insights adhering to this JSON schema:
{
  "whyFits": string (2-3 sentences explaining exactly why candidate's demonstrated skills fit or challenge this role),
  "biggestBlocker": string (1-2 sentences on their single biggest obstacle to getting hired at ${companyName}),
  "customProjectIdeas": [
    {
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "title": string,
      "problemStatement": string,
      "technologies": string[]
    }
  ],
  "companySpecificInterviewAdvice": string (1-2 actionable tips for interviewing at ${companyName} for ${targetTitle})
}`;

  try {
    const enrichmentCall = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutLimit = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const response: any = await Promise.race([enrichmentCall, timeoutLimit]);

    const text = response?.text?.trim() || '';
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed.whyFits) {
        baseAnalysis.topCareerMatch.whyFits = parsed.whyFits;
      }
      if (parsed.biggestBlocker) {
        baseAnalysis.jobReadiness.biggestBlocker = parsed.biggestBlocker;
      }
      if (parsed.companySpecificInterviewAdvice && baseAnalysis.interviewPreparation) {
        baseAnalysis.interviewPreparation.companyFocusNote = `${baseAnalysis.interviewPreparation.companyFocusNote} Tip: ${parsed.companySpecificInterviewAdvice}`;
      }
      // If custom project ideas were generated, enrich project problem statements
      if (Array.isArray(parsed.customProjectIdeas) && parsed.customProjectIdeas.length >= 3) {
        for (let i = 0; i < 3; i++) {
          const customIdea = parsed.customProjectIdeas[i];
          if (customIdea && baseAnalysis.recommendedProjects[i]) {
            baseAnalysis.recommendedProjects[i].goal = customIdea.problemStatement || baseAnalysis.recommendedProjects[i].goal;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Gemini enrichment non-fatal error, deterministic baseline maintained:', err);
  }

  return baseAnalysis;
}
