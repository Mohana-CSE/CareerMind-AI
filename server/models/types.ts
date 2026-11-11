export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  targetCareerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResume {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  extractedText: string;
  charCount: number;
  wordCount: number;
  createdAt: string;
}

export interface ISkill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'languages' | 'tools' | 'soft_skills';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  demandScore: number;
}

export interface ICareerRole {
  _id: string;
  title: string;
  category: string;
  summary: string;
  growthRate: string;
  avgSalary: string;
  difficulty: 'Entry' | 'Intermediate' | 'Advanced';
  requiredSkills: string[];
  optionalSkills: string[];
  learningRoadmap: {
    stage: string;
    description: string;
    skills: string[];
  }[];
  suggestedProjectIds: string[];
  suggestedProjectTitles?: string[];
  targetRoles?: string[];
}

export interface IProject {
  _id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skillsGained: string[];
  techStack: string[];
  whyRecommended: string;
  features: string[];
  resumeValue: string;
  prerequisites: string[];
  goal: string;
  architecture: {
    [layer: string]: string | undefined;
    frontend?: string;
    backend?: string;
    client?: string;
    services?: string;
    database?: string;
    auth?: string;
    ai?: string;
    deployment?: string;
    devops?: string;
    observability?: string;
    broker?: string;
    caching?: string;
    security?: string;
  };
  milestones: {
    title: string;
    tasks: string[];
  }[];
  interviewQuestions: {
    question: string;
    sampleAnswer: string;
  }[];
  resumeBulletPoints: string[];
  relevanceScore?: number;
  skillImpactScore?: number;
  resumeImpactScore?: number;
  targetRoles?: string[];
}

export interface ILearningResource {
  _id: string;
  skill: string;
  title: string;
  provider: string;
  url: string;
  type: 'documentation' | 'course' | 'interactive' | 'tutorial';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tier: 'Learn Now' | 'Learn Next' | 'Optional';
  estimatedTime: string;
  reason: string;
}

export interface ISkillEvidence {
  skill: string;
  detected: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Not Detected';
  evidence: string;
  proficiencyScore: number; // 0 to 100
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  priorityReason?: string;
}

export interface ICandidateProfile {
  name: string;
  headline?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  yearsOfExperience?: string;
  summary?: string;
}

export interface IAnalysis {
  _id: string;
  userId: string;
  resumeId: string;
  isDemo: boolean;
  timestamp: string;
  candidateProfile?: ICandidateProfile;
  targetCareerId?: string;
  targetCareerTitle?: string;
  targetCompany?: string;
  careerReadinessScore: number; // 0 to 100
  readinessBreakdown: {
    technicalSkills: number;
    projects: number;
    experience: number;
    careerAlignment: number;
    interviewReadiness: number;
  };
  topCareerMatch: {
    roleId: string;
    title: string;
    matchPercentage: number;
    whyFits: string;
    strongSkills: string[];
    missingSkills: string[];
    careerGrowth: string;
    learningEffort: string;
    matchedRequiredCount?: number;
    totalRequiredCount?: number;
    matchedOptionalCount?: number;
    totalOptionalCount?: number;
  };
  alternativeCareers: {
    title: string;
    matchPercentage: number;
    skillGapCount: number;
    matchedRequiredCount?: number;
    totalRequiredCount?: number;
  }[];
  allCareerScores?: {
    roleId: string;
    title: string;
    matchPercentage: number;
    readinessScore: number;
    strongSkills: string[];
    missingSkills: string[];
  }[];
  skillsDetected: ISkillEvidence[];
  skillGaps: {
    skill: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    timeToLearn: string;
  }[];
  nextBestSkill?: {
    name: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    timeToLearn: string;
    practicalValue: string;
  };
  nextBestAction: {
    title: string;
    reason: string;
    projectId?: string;
    actionType: 'project' | 'course' | 'practice';
    buttonText: string;
  };
  recommendedProjects: IProject[];
  recommendedCourses?: {
    title: string;
    skill: string;
    provider: string;
    url: string;
    type: string;
    level: string;
    whyRecommended: string;
    targetCareerRelevance: string;
  }[];
  codingPractice?: {
    primaryLanguage: string;
    coreMissingConcept: string;
    conceptExplanation: string;
    whyYouNeedIt: string;
    problems: {
      difficulty: 'Basic' | 'Intermediate' | 'Advanced';
      title: string;
      concept: string;
      whyRecommended: string;
      url: string;
      platform: 'LeetCode';
      isSolved?: boolean;
    }[];
  };
  interviewPreparation?: {
    targetCompany: string;
    targetCareer: string;
    companyFocusNote: string;
    technicalQuestions: { question: string; answerGuidance: string; skill: string }[];
    codingQuestions: { question: string; answerGuidance: string; topic: string }[];
    projectQuestions: { question: string; answerGuidance: string; referencedProject: string }[];
    resumeQuestions: { question: string; answerGuidance: string; context: string }[];
    behavioralQuestions: { question: string; starGuidance: string; principle?: string }[];
    hrQuestions: { question: string; answerGuidance: string }[];
  };
  progressionRoadmap: {
    step: number;
    stage: 'You Are Here' | 'Beginner Project' | 'Intermediate Project' | 'Advanced Project' | 'Portfolio Ready' | 'Interview Ready' | 'Job Ready';
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'upcoming';
  }[];
  jobReadiness: {
    technicalReadiness: number;
    projectReadiness: number;
    resumeReadiness: number;
    interviewReadiness: number;
    biggestBlocker: string;
  };
  careerPathGraph: {
    nodes: { id: string; label: string; type: string }[];
    edges: { from: string; to: string; label?: string }[];
  };
}

export interface IProgress {
  _id: string;
  userId: string;
  skillStatus: Record<string, 'not_started' | 'learning' | 'completed'>;
  projectStatus: Record<string, 'not_started' | 'learning' | 'completed'>;
  completedRoadmapSteps: number[];
  solvedProblemIds?: string[];
  updatedAt: string;
}

export interface IProjectSubmission {
  _id: string;
  userId: string;
  projectId: string;
  githubUrl: string;
  liveDemoUrl?: string;
  notes?: string;
  submittedAt: string;
  evaluation: {
    score: number; // 0 to 100
    status: 'PASSED' | 'NEEDS_REVISION';
    grade: string;
    strengths: string[];
    improvements: string[];
    architectureReview: string;
    securityCheck: string;
    interviewTip: string;
  };
}

export interface ICodingProblem {
  _id: string;
  title: string;
  platform: 'LeetCode' | 'NeetCode' | 'HackerRank' | 'BigFrontend';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skill: string;
  category: string;
  url: string;
  whyRecommended: string;
  estimatedMinutes: number;
  targetRoles?: string[];
}

export interface IAssessment {
  _id: string;
  userId: string;
  answers: Record<string, string>;
  dimensions: {
    problemSolving: number;
    technicalInterest: number;
    analyticalThinking: number;
    creativity: number;
    communication: number;
    preferredWorkStyle: string;
  };
  recommendedRoleTitles: string[];
  createdAt: string;
}
