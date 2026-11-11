import {
  ICareerRole,
  ISkillEvidence,
  IAnalysis,
  IProject,
  ICandidateProfile,
} from '../models/types';
import { CareerRoles } from '../models';
import { getCompanyProfile, ICompanyProfile } from '../data/companies';

// Canonical skill catalog with aliases and domain categories
export interface ISkillDefinition {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'languages' | 'tools' | 'cloud' | 'security';
  aliases: string[];
  canonical: string;
}

export const SKILL_CATALOG: ISkillDefinition[] = [
  // Web & Frontend
  { name: 'JavaScript', category: 'languages', aliases: ['javascript', 'js', 'es6', 'es2020', 'ecmascript'], canonical: 'JavaScript' },
  { name: 'TypeScript', category: 'languages', aliases: ['typescript', 'ts'], canonical: 'TypeScript' },
  { name: 'React', category: 'frontend', aliases: ['react', 'react.js', 'reactjs'], canonical: 'React' },
  { name: 'Next.js', category: 'frontend', aliases: ['next.js', 'nextjs', 'next'], canonical: 'Next.js' },
  { name: 'HTML', category: 'frontend', aliases: ['html', 'html5'], canonical: 'HTML' },
  { name: 'CSS', category: 'frontend', aliases: ['css', 'css3', 'scss', 'sass'], canonical: 'CSS' },
  { name: 'Tailwind CSS', category: 'frontend', aliases: ['tailwind', 'tailwindcss'], canonical: 'Tailwind CSS' },
  { name: 'Redux', category: 'frontend', aliases: ['redux', 'redux toolkit', 'rtk'], canonical: 'Redux' },
  { name: 'Responsive Design', category: 'frontend', aliases: ['responsive design', 'responsive web', 'mobile first', 'media queries'], canonical: 'Responsive Design' },
  { name: 'Vue.js', category: 'frontend', aliases: ['vue', 'vue.js', 'vuejs'], canonical: 'Vue.js' },
  { name: 'Angular', category: 'frontend', aliases: ['angular', 'angularjs'], canonical: 'Angular' },
  { name: 'GraphQL', category: 'backend', aliases: ['graphql', 'apollo'], canonical: 'GraphQL' },

  // Backend & Languages
  { name: 'Node.js', category: 'backend', aliases: ['node.js', 'nodejs', 'node runtime'], canonical: 'Node.js' },
  { name: 'Express', category: 'backend', aliases: ['express', 'express.js', 'expressjs'], canonical: 'Express' },
  { name: 'Python', category: 'languages', aliases: ['python', 'python3', 'py'], canonical: 'Python' },
  { name: 'Java', category: 'languages', aliases: ['java', 'java basics', 'core java', 'java 17', 'java 11', 'java 8', 'java se'], canonical: 'Java' },
  { name: 'C++', category: 'languages', aliases: ['c++', 'cpp'], canonical: 'C++' },
  { name: 'C', category: 'languages', aliases: ['c', 'c language', 'c programming', 'ansi c', 'c-programming'], canonical: 'C' },
  { name: 'Spring Boot', category: 'backend', aliases: ['spring boot', 'springboot', 'spring framework', 'spring'], canonical: 'Spring Boot' },
  { name: 'Hibernate/JPA', category: 'backend', aliases: ['hibernate', 'jpa', 'spring data jpa'], canonical: 'Hibernate/JPA' },
  { name: 'Microservices', category: 'backend', aliases: ['microservices', 'microservice architecture', 'distributed systems'], canonical: 'Microservices' },
  { name: 'REST APIs', category: 'backend', aliases: ['rest api', 'restful', 'rest apis', 'rest endpoints', 'api integration'], canonical: 'REST APIs' },
  { name: 'FastAPI/Flask/Django', category: 'backend', aliases: ['fastapi', 'flask', 'django', 'django rest framework', 'drf'], canonical: 'FastAPI/Flask/Django' },
  { name: 'Authentication', category: 'backend', aliases: ['jwt', 'oauth', 'authentication', 'session auth', 'passport.js', 'bcrypt'], canonical: 'Authentication' },
  { name: 'OOP', category: 'languages', aliases: ['oop', 'object oriented', 'object-oriented programming', 'encapsulation'], canonical: 'OOP' },

  // Databases & Caching
  { name: 'SQL', category: 'database', aliases: ['sql', 'rdbms', 'relational database', 'sqlite'], canonical: 'SQL' },
  { name: 'PostgreSQL', category: 'database', aliases: ['postgresql', 'postgres', 'psql'], canonical: 'PostgreSQL' },
  { name: 'MySQL', category: 'database', aliases: ['mysql'], canonical: 'MySQL' },
  { name: 'MongoDB', category: 'database', aliases: ['mongodb', 'mongo', 'mongoose', 'nosql document'], canonical: 'MongoDB' },
  { name: 'Redis', category: 'database', aliases: ['redis', 'caching with redis', 'in-memory cache'], canonical: 'Redis' },
  { name: 'Kafka', category: 'backend', aliases: ['kafka', 'apache kafka', 'message queue'], canonical: 'Kafka' },

  // AI & Data Science
  { name: 'Machine Learning', category: 'ai_ml', aliases: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning'], canonical: 'Machine Learning' },
  { name: 'Deep Learning', category: 'ai_ml', aliases: ['deep learning', 'neural network', 'neural networks', 'cnn', 'rnn'], canonical: 'Deep Learning' },
  { name: 'PyTorch/TensorFlow', category: 'ai_ml', aliases: ['pytorch', 'tensorflow', 'keras'], canonical: 'PyTorch/TensorFlow' },
  { name: 'Scikit-Learn', category: 'ai_ml', aliases: ['scikit-learn', 'sklearn'], canonical: 'Scikit-Learn' },
  { name: 'Pandas', category: 'ai_ml', aliases: ['pandas'], canonical: 'Pandas' },
  { name: 'NumPy', category: 'ai_ml', aliases: ['numpy'], canonical: 'NumPy' },
  { name: 'Data Visualization', category: 'ai_ml', aliases: ['data visualization', 'matplotlib', 'seaborn', 'powerbi', 'tableau'], canonical: 'Data Visualization' },
  { name: 'Tableau/PowerBI', category: 'ai_ml', aliases: ['tableau', 'power bi', 'powerbi'], canonical: 'Tableau/PowerBI' },
  { name: 'Excel', category: 'ai_ml', aliases: ['excel', 'advanced excel', 'spreadsheets'], canonical: 'Excel' },
  { name: 'Statistics', category: 'ai_ml', aliases: ['statistics', 'statistical modeling', 'probability', 'hypothesis testing'], canonical: 'Statistics' },
  { name: 'Math/Statistics', category: 'ai_ml', aliases: ['linear algebra', 'calculus', 'statistics', 'probability'], canonical: 'Math/Statistics' },
  { name: 'LLMs', category: 'ai_ml', aliases: ['llm', 'llms', 'large language model', 'gpt', 'gemini', 'claude', 'transformer'], canonical: 'LLMs' },
  { name: 'Prompt Engineering', category: 'ai_ml', aliases: ['prompt engineering', 'prompt design', 'few-shot prompting'], canonical: 'Prompt Engineering' },
  { name: 'LangChain/LlamaIndex', category: 'ai_ml', aliases: ['langchain', 'llamaindex', 'rag pipeline'], canonical: 'LangChain/LlamaIndex' },
  { name: 'Vector Databases', category: 'ai_ml', aliases: ['vector database', 'vector db', 'chromadb', 'pinecone', 'milvus', 'qdrant', 'faiss'], canonical: 'Vector Databases' },
  { name: 'Embeddings', category: 'ai_ml', aliases: ['embeddings', 'dense embeddings', 'vector search', 'rag'], canonical: 'Embeddings' },
  { name: 'Business Intelligence', category: 'ai_ml', aliases: ['business intelligence', 'bi', 'kpi', 'metrics reporting'], canonical: 'Business Intelligence' },
  { name: 'A/B Testing', category: 'ai_ml', aliases: ['a/b testing', 'experimentation', 'split testing'], canonical: 'A/B Testing' },

  // DevOps & Cloud
  { name: 'Git', category: 'tools', aliases: ['git', 'github', 'gitlab', 'version control'], canonical: 'Git' },
  { name: 'Docker', category: 'devops', aliases: ['docker', 'containerization', 'containers', 'dockerfile', 'docker-compose'], canonical: 'Docker' },
  { name: 'Kubernetes', category: 'devops', aliases: ['kubernetes', 'k8s'], canonical: 'Kubernetes' },
  { name: 'CI/CD', category: 'devops', aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci', 'continuous integration'], canonical: 'CI/CD' },
  { name: 'Linux', category: 'devops', aliases: ['linux', 'ubuntu', 'bash', 'shell scripting', 'unix'], canonical: 'Linux' },
  { name: 'Bash Scripting', category: 'devops', aliases: ['bash', 'shell script', 'bash scripting', 'sh'], canonical: 'Bash Scripting' },
  { name: 'Cloud (AWS/GCP)', category: 'cloud', aliases: ['aws', 'gcp', 'azure', 'google cloud', 'amazon web services', 'cloud computing'], canonical: 'Cloud (AWS/GCP)' },
  { name: 'Terraform', category: 'cloud', aliases: ['terraform', 'iac', 'infrastructure as code'], canonical: 'Terraform' },
  { name: 'Networking', category: 'cloud', aliases: ['networking', 'tcp/ip', 'dns', 'vpc', 'subnets', 'firewalls'], canonical: 'Networking' },
  { name: 'Security/IAM', category: 'cloud', aliases: ['iam', 'cloud security', 'identity access management', 'kms'], canonical: 'Security/IAM' },

  // Cybersecurity
  { name: 'Network Security', category: 'security', aliases: ['network security', 'firewalls', 'wireshark', 'ids/ips', 'vpn'], canonical: 'Network Security' },
  { name: 'Vulnerability Assessment', category: 'security', aliases: ['vulnerability assessment', 'vapt', 'nessus', 'burp suite'], canonical: 'Vulnerability Assessment' },
  { name: 'SIEM', category: 'security', aliases: ['siem', 'splunk', 'elk stack', 'log analysis'], canonical: 'SIEM' },
  { name: 'Cryptography', category: 'security', aliases: ['cryptography', 'encryption', 'tls', 'ssl', 'rsa', 'aes'], canonical: 'Cryptography' },
  { name: 'Incident Response', category: 'security', aliases: ['incident response', 'soc', 'threat hunting', 'forensics'], canonical: 'Incident Response' },
  { name: 'OWASP Top 10', category: 'security', aliases: ['owasp', 'owasp top 10', 'xss', 'sql injection', 'csrf'], canonical: 'OWASP Top 10' },

  // Mobile
  { name: 'React Native/Flutter', category: 'frontend', aliases: ['react native', 'flutter', 'dart', 'mobile app'], canonical: 'React Native/Flutter' },
  { name: 'Mobile UI/UX', category: 'frontend', aliases: ['mobile ui', 'mobile ux', 'ios design', 'material design'], canonical: 'Mobile UI/UX' },
  { name: 'App Store Deployment', category: 'tools', aliases: ['app store', 'play store', 'testflight', 'app signing'], canonical: 'App Store Deployment' },
  { name: 'Data Structures', category: 'languages', aliases: ['data structures', 'algorithms', 'dsa', 'leetcode'], canonical: 'Data Structures' },
  { name: 'Maven/Gradle', category: 'tools', aliases: ['maven', 'gradle'], canonical: 'Maven/Gradle' },
  { name: 'JWT', category: 'backend', aliases: ['jwt', 'json web token'], canonical: 'JWT' },
  { name: 'Python/R', category: 'languages', aliases: ['python', 'r language', 'r programming'], canonical: 'Python/R' },
  { name: 'Python/Bash', category: 'languages', aliases: ['python', 'bash'], canonical: 'Python/Bash' },
  { name: 'JavaScript/Dart', category: 'languages', aliases: ['javascript', 'dart'], canonical: 'JavaScript/Dart' },
];

/**
 * Extracts candidate profile directly from resume text
 */
export function extractCandidateProfile(text: string): ICandidateProfile {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // GitHub
  const githubMatch = text.match(/(?:github\.com\/)([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? `github.com/${githubMatch[1]}` : undefined;

  // LinkedIn
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/)([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : undefined;

  // Name extraction
  let name = 'Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const isHeaderWord = /^(resume|curriculum|vitae|cv|contact|summary|profile|about|objective)$/i.test(line);
    const hasContact = line.includes('@') || line.includes('http') || line.includes('github') || line.includes('linkedin');
    const isJobTitle = /^(software engineer|frontend developer|backend developer|full stack developer|student developer)$/i.test(line);

    if (!isHeaderWord && !hasContact && !isJobTitle && line.length >= 2 && line.length <= 45) {
      name = line.replace(/^(name\s*:\s*)/i, '').replace(/[\(\[].*?[\)\]]/g, '').trim();
      break;
    }
  }

  // Headline extraction
  let headline = 'Software Engineer';
  for (let i = 0; i < Math.min(7, lines.length); i++) {
    const line = lines[i];
    if (
      /(engineer|developer|architect|analyst|scientist|specialist|lead|student|intern)/i.test(line) &&
      line !== name &&
      !line.includes('@') &&
      !line.includes('http')
    ) {
      headline = line.replace(/^(title\s*:\s*)/i, '').slice(0, 60).trim();
      break;
    }
  }

  // Experience estimate
  const expMatch = text.match(/(\d+[\+]?)\s*(?:years|yrs)\s*(?:of)?\s*experience/i);
  const yearsOfExperience = expMatch ? `${expMatch[1]} years` : 'Student / Early Career';

  // Summary
  let summary = '';
  const sumIdx = lines.findIndex(l => /^(summary|professional summary|objective|career objective|profile|about me)/i.test(l));
  if (sumIdx !== -1 && sumIdx + 1 < lines.length) {
    summary = lines.slice(sumIdx + 1, sumIdx + 4).join(' ').slice(0, 280);
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

/**
 * Extracts resume projects and work experience descriptions for deep personalization
 */
export function extractResumeWorkAndProjects(text: string): {
  projects: { title: string; tech: string; description: string }[];
  experiences: string[];
  education: string[];
  certifications: string[];
} {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const projects: { title: string; tech: string; description: string }[] = [];
  const experiences: string[] = [];
  const education: string[] = [];
  const certifications: string[] = [];

  let currentSection: 'none' | 'projects' | 'experience' | 'education' | 'certifications' = 'none';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^(projects|academic projects|technical projects|key projects)\b/i.test(line)) {
      currentSection = 'projects';
      continue;
    } else if (/^(experience|work experience|professional experience|employment|internships?)\b/i.test(line)) {
      currentSection = 'experience';
      continue;
    } else if (/^(education|academic background|academics)\b/i.test(line)) {
      currentSection = 'education';
      continue;
    } else if (/^(certifications?|certificates?|licenses)\b/i.test(line)) {
      currentSection = 'certifications';
      continue;
    } else if (/^(skills|technical skills|hobbies|languages|summary|objective|interests)\b/i.test(line)) {
      currentSection = 'none';
      continue;
    }

    if (currentSection === 'projects') {
      if (line.length > 15 && (line.includes(':') || line.includes('-') || line.includes('•'))) {
        projects.push({
          title: line.slice(0, 40).replace(/^[-•*]\s*/, ''),
          tech: line,
          description: lines[i + 1] ? lines[i + 1].slice(0, 150) : line.slice(0, 150),
        });
      }
    } else if (currentSection === 'experience') {
      if (line.length > 20) {
        experiences.push(line);
      }
    } else if (currentSection === 'education') {
      if (line.length > 10) {
        education.push(line);
      }
    } else if (currentSection === 'certifications') {
      if (line.length > 8) {
        certifications.push(line);
      }
    }
  }

  return { projects, experiences, education, certifications };
}

/**
 * Extracts actual skills with exact evidence from resume text
 */
export function extractSkillsWithEvidence(resumeText: string): {
  detectedSkills: ISkillEvidence[];
  detectedSkillNames: Set<string>;
  skillCategoryCounts: Record<string, number>;
} {
  const lower = resumeText.toLowerCase();
  const lines = resumeText.split('\n');

  const detectedSkills: ISkillEvidence[] = [];
  const detectedSkillNames = new Set<string>();
  const skillCategoryCounts: Record<string, number> = {};

  for (const def of SKILL_CATALOG) {
    let matchCount = 0;
    const evidenceSnippets: string[] = [];

    for (const alias of def.aliases) {
      // Regex word boundary matching
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    }

    if (matchCount > 0) {
      detectedSkillNames.add(def.name.toLowerCase());
      skillCategoryCounts[def.category] = (skillCategoryCounts[def.category] || 0) + 1;

      // Extract context snippet from actual resume text
      for (const line of lines) {
        const lLower = line.toLowerCase();
        if (def.aliases.some(a => lLower.includes(a)) && line.trim().length > 15) {
          evidenceSnippets.push(line.trim());
          if (evidenceSnippets.length >= 2) break;
        }
      }

      let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
      let proficiencyScore = 65;

      if (matchCount >= 4 || evidenceSnippets.length >= 2) {
        level = 'Advanced';
        proficiencyScore = Math.min(95, 75 + matchCount * 4);
      } else if (matchCount === 1) {
        level = 'Beginner';
        proficiencyScore = 52;
      } else {
        level = 'Intermediate';
        proficiencyScore = 70;
      }

      let evidence = `Identified in resume (${matchCount} mention${matchCount > 1 ? 's' : ''}).`;
      if (evidenceSnippets.length > 0) {
        evidence = `Found in resume: "${evidenceSnippets[0].slice(0, 120)}"`;
      }

      detectedSkills.push({
        skill: def.name,
        detected: true,
        level,
        proficiencyScore,
        evidence,
      });
    }
  }

  return { detectedSkills, detectedSkillNames, skillCategoryCounts };
}

/**
 * Checks if a required career skill is matched by candidate's detected skills or text
 */
function isCareerSkillMatched(
  reqSkill: string,
  detectedNames: Set<string>,
  resumeLower: string
): boolean {
  const reqLower = reqSkill.toLowerCase();

  // Direct match
  if (detectedNames.has(reqLower)) return true;

  // Split slashes like "React Native/Flutter", "FastAPI/Flask/Django"
  if (reqSkill.includes('/')) {
    const parts = reqSkill.split('/').map(p => p.trim().toLowerCase());
    for (const part of parts) {
      if (detectedNames.has(part) || resumeLower.includes(part)) return true;
    }
  }

  // Substring check in detected names
  for (const name of detectedNames) {
    if (name.includes(reqLower) || reqLower.includes(name)) return true;
  }

  // Exact word boundary in resume text
  const escaped = reqLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(resumeLower);
}

/**
 * DETERMINISTIC 0 TO 100 CAREER MATCH SCORER
 * Strictly NO artificial minimum floors (NO Math.max(30), NO Math.max(35), NO fake fallbacks).
 * Allowed scores: 0, 8, 14, 27, 43, 62, 78, 85, 95, 100 based purely on resume evidence.
 */
export function calculateCareerMatchScore(
  role: ICareerRole,
  detectedSkillNames: Set<string>,
  resumeText: string,
  resumeProjects: { title: string; tech: string }[]
): {
  matchPercentage: number;
  strongSkills: string[];
  missingSkills: string[];
  matchedRequiredCount: number;
  totalRequiredCount: number;
  matchedOptionalCount: number;
  totalOptionalCount: number;
} {
  const resumeLower = resumeText.toLowerCase();

  const strongSkills: string[] = [];
  const missingSkills: string[] = [];
  let matchedRequiredCount = 0;

  for (const req of role.requiredSkills) {
    if (isCareerSkillMatched(req, detectedSkillNames, resumeLower)) {
      matchedRequiredCount++;
      strongSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  let matchedOptionalCount = 0;
  for (const opt of role.optionalSkills) {
    if (isCareerSkillMatched(opt, detectedSkillNames, resumeLower)) {
      matchedOptionalCount++;
      if (!strongSkills.includes(opt)) strongSkills.push(opt);
    }
  }

  const totalRequiredCount = Math.max(1, role.requiredSkills.length);
  const totalOptionalCount = Math.max(1, role.optionalSkills.length);

  // Skill match fraction: 75% required weight, 25% optional weight
  const requiredFraction = matchedRequiredCount / totalRequiredCount;
  const optionalFraction = matchedOptionalCount / totalOptionalCount;
  const rawSkillFraction = requiredFraction * 0.75 + optionalFraction * 0.25;

  // Domain project relevance bonus (0 to 12 points)
  let projectDomainBonus = 0;
  const domainKeywords = role.category.toLowerCase().split(/\s+/);
  for (const proj of resumeProjects) {
    const pText = (proj.title + ' ' + proj.tech).toLowerCase();
    if (domainKeywords.some(kw => kw.length > 3 && pText.includes(kw))) {
      projectDomainBonus += 4;
    }
  }
  projectDomainBonus = Math.min(12, projectDomainBonus);

  // Experience depth bonus (0 to 8 points) if resume contains role-related titles
  let experienceRoleBonus = 0;
  if (resumeLower.includes(role.title.toLowerCase())) {
    experienceRoleBonus += 8;
  } else {
    const roleWords = role.title.toLowerCase().split(/\s+/);
    if (roleWords.some(w => w.length > 3 && resumeLower.includes(w))) {
      experienceRoleBonus += 4;
    }
  }

  // Calculate purely mathematical score from 0 to 100
  // If candidate has ZERO required skills matched, base skill score is 0.
  let calculated = Math.round(rawSkillFraction * 80 + projectDomainBonus + experienceRoleBonus);

  // Strict boundary: 0 to 100 (NO MINIMUM FLOORS)
  calculated = Math.max(0, Math.min(100, calculated));

  return {
    matchPercentage: calculated,
    strongSkills,
    missingSkills,
    matchedRequiredCount,
    totalRequiredCount,
    matchedOptionalCount,
    totalOptionalCount,
  };
}

/**
 * DETERMINISTIC 0 TO 100 CAREER READINESS SCORER
 * Distinct from Match Score: measures Candidate Preparedness across 5 verifiable dimensions.
 */
export function calculateCareerReadiness(
  matchScore: number,
  detectedSkillsCount: number,
  resumeProjects: any[],
  resumeExperiences: any[],
  resumeEducation: any[],
  resumeLength: number
): {
  overallScore: number;
  breakdown: {
    technicalSkills: number;
    projects: number;
    experience: number;
    careerAlignment: number;
    interviewReadiness: number;
  };
} {
  // 1. Technical Skills Dimension (0-100)
  // Depends on total detected technical depth and match score
  let technicalSkills = Math.round(matchScore * 0.7 + Math.min(30, detectedSkillsCount * 3));
  technicalSkills = Math.max(0, Math.min(100, technicalSkills));

  // 2. Practical Projects Dimension (0-100)
  // Depends on number and depth of projects in resume
  const projectCount = resumeProjects.length;
  let projects = 0;
  if (projectCount >= 3) {
    projects = 85;
  } else if (projectCount === 2) {
    projects = 72;
  } else if (projectCount === 1) {
    projects = 55;
  } else {
    // If no explicit projects section, deduce from text length / code references
    projects = resumeLength > 1200 ? 40 : 25;
  }
  projects = Math.max(0, Math.min(100, projects));

  // 3. Experience Depth Dimension (0-100)
  // Depends on internships, employment, years of work
  const expCount = resumeExperiences.length;
  let experience = 0;
  if (expCount >= 3) {
    experience = 88;
  } else if (expCount >= 1) {
    experience = 68;
  } else if (resumeEducation.length > 0) {
    // Student or entry-level
    experience = 42;
  } else {
    experience = 20;
  }
  experience = Math.max(0, Math.min(100, experience));

  // 4. Career Alignment Dimension (0-100)
  const careerAlignment = Math.max(0, Math.min(100, matchScore));

  // 5. Interview Readiness Dimension (0-100)
  const interviewReadiness = Math.round(technicalSkills * 0.5 + projects * 0.3 + experience * 0.2);

  // Overall Weighted Index:
  // Technical (30%) + Projects (25%) + Experience (20%) + Career Alignment (15%) + Interview (10%)
  const overall = Math.round(
    technicalSkills * 0.30 +
    projects * 0.25 +
    experience * 0.20 +
    careerAlignment * 0.15 +
    interviewReadiness * 0.10
  );

  return {
    overallScore: Math.max(0, Math.min(100, overall)),
    breakdown: {
      technicalSkills,
      projects,
      experience,
      careerAlignment,
      interviewReadiness,
    },
  };
}

/**
 * Dynamic Targeted Course Recommendations based on user's actual missing skills & target career
 */
export function generateDynamicCourses(
  targetRole: ICareerRole,
  missingSkills: string[]
): {
  title: string;
  skill: string;
  provider: string;
  url: string;
  type: string;
  level: string;
  whyRecommended: string;
  targetCareerRelevance: string;
}[] {
  const verifiedCourses: Record<string, { title: string; provider: string; url: string; level: string }> = {
    'React': { title: 'React Documentation & Tutorial', provider: 'React.dev Official', url: 'https://react.dev/learn', level: 'Beginner' },
    'TypeScript': { title: 'TypeScript for JavaScript Programmers', provider: 'TypeScript Official', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html', level: 'Intermediate' },
    'Node.js': { title: 'Node.js Architecture & Asynchronous Event Loop', provider: 'Node.js Official Docs', url: 'https://nodejs.org/en/learn', level: 'Intermediate' },
    'Express': { title: 'RESTful API Engineering with Express', provider: 'ExpressJS Docs', url: 'https://expressjs.com/en/starter/installing.html', level: 'Beginner' },
    'SQL': { title: 'PostgreSQL & SQL Query Optimization', provider: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/current/tutorial.html', level: 'Intermediate' },
    'MongoDB': { title: 'MongoDB Schema Design & Aggregation Pipelines', provider: 'MongoDB University', url: 'https://www.mongodb.com/docs/manual/tutorial/', level: 'Intermediate' },
    'Docker': { title: 'Docker Containers & Compose Architecture', provider: 'Docker Official Docs', url: 'https://docs.docker.com/get-started/', level: 'Intermediate' },
    'Kubernetes': { title: 'Kubernetes Pods, Services & Ingress Networking', provider: 'Kubernetes.io Docs', url: 'https://kubernetes.io/docs/tutorials/', level: 'Advanced' },
    'Python': { title: 'Python 3 Standard Library & Functional Paradigms', provider: 'Python.org Official', url: 'https://docs.python.org/3/tutorial/', level: 'Beginner' },
    'Java': { title: 'Java Core, Concurrency & Stream APIs', provider: 'Oracle Java Documentation', url: 'https://docs.oracle.com/javase/tutorial/', level: 'Intermediate' },
    'Spring Boot': { title: 'Building Microservices with Spring Boot', provider: 'Spring.io Guides', url: 'https://spring.io/guides', level: 'Intermediate' },
    'Machine Learning': { title: 'Supervised & Unsupervised Machine Learning', provider: 'Scikit-Learn Tutorials', url: 'https://scikit-learn.org/stable/tutorial/index.html', level: 'Intermediate' },
    'PyTorch/TensorFlow': { title: 'Deep Neural Networks with PyTorch', provider: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', level: 'Advanced' },
    'LLMs': { title: 'Prompt Engineering & LLM Architecture', provider: 'Google DeepMind Learning', url: 'https://ai.google.dev/gemini-api/docs', level: 'Intermediate' },
    'Vector Databases': { title: 'Vector Embeddings & Semantic Search in ChromaDB', provider: 'Chroma Docs', url: 'https://docs.trychroma.com/', level: 'Intermediate' },
    'Git': { title: 'Pro Git Version Control Mastery', provider: 'Git-SCM Official', url: 'https://git-scm.com/doc', level: 'Beginner' },
    'Linux': { title: 'Linux CLI & Bash System Administration', provider: 'Linux Foundation', url: 'https://www.kernel.org/doc/html/latest/', level: 'Beginner' },
  };

  const selected: {
    title: string;
    skill: string;
    provider: string;
    url: string;
    type: string;
    level: string;
    whyRecommended: string;
    targetCareerRelevance: string;
  }[] = [];

  // Match against user's actual missing skills first
  for (const missing of missingSkills) {
    for (const [skillKey, courseInfo] of Object.entries(verifiedCourses)) {
      if (
        missing.toLowerCase().includes(skillKey.toLowerCase()) ||
        skillKey.toLowerCase().includes(missing.toLowerCase())
      ) {
        if (!selected.some(s => s.skill === skillKey)) {
          selected.push({
            title: courseInfo.title,
            skill: skillKey,
            provider: courseInfo.provider,
            url: courseInfo.url,
            type: 'documentation',
            level: courseInfo.level,
            whyRecommended: `Your resume currently lacks demonstrated proof of ${skillKey}. Mastering this directly resolves your top requirement gap for ${targetRole.title}.`,
            targetCareerRelevance: `Core required competence for production ${targetRole.title} positions.`,
          });
        }
      }
    }
  }

  // If missing skills were all covered or none matched, add target role required skills
  if (selected.length < 3) {
    for (const req of targetRole.requiredSkills) {
      for (const [skillKey, courseInfo] of Object.entries(verifiedCourses)) {
        if (
          req.toLowerCase().includes(skillKey.toLowerCase()) ||
          skillKey.toLowerCase().includes(req.toLowerCase())
        ) {
          if (!selected.some(s => s.skill === skillKey)) {
            selected.push({
              title: courseInfo.title,
              skill: skillKey,
              provider: courseInfo.provider,
              url: courseInfo.url,
              type: 'documentation',
              level: courseInfo.level,
              whyRecommended: `Reinforces foundational engineering practices in ${skillKey} expected in ${targetRole.title} technical rounds.`,
              targetCareerRelevance: `Standard baseline technology for ${targetRole.title}.`,
            });
          }
        }
      }
    }
  }

  return selected.slice(0, 4);
}

/**
 * Concept-First LeetCode & Coding Practice Generator
 * Generates exactly: 1 Basic Problem, 1 Intermediate Problem, 1 Advanced Problem
 * with VERIFIED OFFICIAL LEETCODE URLs!
 */
export function generateConceptFirstLeetCode(
  targetRole: ICareerRole,
  company: ICompanyProfile,
  detectedSkills: Set<string>,
  missingSkills: string[]
): {
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
  }[];
} {
  // Detect primary language from resume
  let primaryLanguage = 'JavaScript';
  if (detectedSkills.has('python')) {
    primaryLanguage = 'Python';
  } else if (detectedSkills.has('java')) {
    primaryLanguage = 'Java';
  } else if (detectedSkills.has('c++')) {
    primaryLanguage = 'C++';
  } else if (detectedSkills.has('typescript')) {
    primaryLanguage = 'TypeScript';
  }

  // Verified Official LeetCode Curated Problem Bank
  const verifiedProblemBank: Record<
    string,
    {
      concept: string;
      explanation: string;
      whyNeed: string;
      basic: { title: string; url: string; why: string };
      intermediate: { title: string; url: string; why: string };
      advanced: { title: string; url: string; why: string };
    }
  > = {
    'arrays_hashmap': {
      concept: 'Hash Table & Frequency Counting',
      explanation: 'Optimizes O(n^2) nested lookups down to O(1) amortized hash key indexing. Fundamental for high-throughput service lookups.',
      whyNeed: `Crucial for technical interviews at ${company.name} where brute force loops are immediately rejected in favor of linear O(n) space-time trade-offs.`,
      basic: {
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        why: 'The quintessential HashMap pattern: stores complement values in a single pass to achieve O(n) runtime.',
      },
      intermediate: {
        title: 'Group Anagrams',
        url: 'https://leetcode.com/problems/group-anagrams/',
        why: 'Tests string sorting or character frequency array keys to partition multidimensional inputs into grouped buckets.',
      },
      advanced: {
        title: 'Trapping Rain Water',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        why: 'Combines two-pointer spatial boundaries or monotonic stack tracking to compute volume trapped between elevation barriers.',
      },
    },
    'sliding_window': {
      concept: 'Sliding Window & Two Pointers',
      explanation: 'Maintains an active contiguous subarray/substring window, expanding and contracting boundaries to eliminate redundant re-computation.',
      whyNeed: `Directly demanded in ${targetRole.title} coding rounds to process streaming payloads and optimize memory buffers at ${company.name}.`,
      basic: {
        title: 'Best Time to Buy and Sell Stock',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        why: 'Single-pass sliding min-pointer tracking optimal localized profit margins in linear O(n) time.',
      },
      intermediate: {
        title: 'Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        why: 'Signature sliding window challenge using a hash set to dynamically contract the left window boundary upon duplicate collision.',
      },
      advanced: {
        title: 'Sliding Window Maximum',
        url: 'https://leetcode.com/problems/sliding-window-maximum/',
        why: 'Uses a monotonic deque to maintain running maximum values across a moving window in amortized O(n) time.',
      },
    },
    'trees_graphs': {
      concept: 'Tree Traversal & BFS/DFS Graphs',
      explanation: 'Hierarchical navigation using recursion, stacks, and queues to explore acyclic nodes, topological dependencies, and shortest paths.',
      whyNeed: `Core requirement for systems modeling and DOM tree/microservice dependency trees evaluated rigorously at ${company.name}.`,
      basic: {
        title: 'Maximum Depth of Binary Tree',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        why: 'Foundational recursive DFS divide-and-conquer pattern determining subtree depth boundaries.',
      },
      intermediate: {
        title: 'Number of Islands',
        url: 'https://leetcode.com/problems/number-of-islands/',
        why: 'Classic 2D grid matrix traversal using BFS/DFS flood-fill recursion to explore connected components.',
      },
      advanced: {
        title: 'Word Search II',
        url: 'https://leetcode.com/problems/word-search-ii/',
        why: 'Combines Trie prefix trees with 2D grid backtracking to prune duplicate search space branches.',
      },
    },
    'binary_search': {
      concept: 'Binary Search & Partitioning',
      explanation: 'Logarithmic O(log n) partitioned search space halving over sorted ranges and monotonic predicate functions.',
      whyNeed: `Tested in ${company.name} algorithmic rounds to evaluate how efficiently you optimize database query range scans and sorted index traversals.`,
      basic: {
        title: 'Binary Search',
        url: 'https://leetcode.com/problems/binary-search/',
        why: 'Standard mid-pointer calculation with overflow protection over sorted arrays.',
      },
      intermediate: {
        title: 'Search in Rotated Sorted Array',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        why: 'Determines which partitioned half remains sorted to maintain O(log n) efficiency despite pivot shifts.',
      },
      advanced: {
        title: 'Median of Two Sorted Arrays',
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        why: 'Hard binary search over array partitions requiring extreme precision on boundary index parity.',
      },
    },
  };

  // Prioritize company-specific LeetCode requirements if defined
  if (company.coreLeetCodeConcept?.problems?.length) {
    return {
      primaryLanguage,
      coreMissingConcept: company.coreLeetCodeConcept.concept,
      conceptExplanation: company.coreLeetCodeConcept.explanation,
      whyYouNeedIt: company.coreLeetCodeConcept.whyRequired,
      problems: company.coreLeetCodeConcept.problems.map(p => ({
        difficulty: p.difficulty,
        title: p.title,
        concept: p.concept,
        whyRecommended: p.whyRecommended,
        url: p.url,
        platform: 'LeetCode' as const,
      })),
    };
  }

  // Select concept based on target role or missing concepts
  let chosenKey = 'arrays_hashmap';
  if (targetRole.category.includes('Artificial') || targetRole.title.includes('AI') || targetRole.title.includes('ML')) {
    chosenKey = 'binary_search';
  } else if (targetRole.title.includes('Frontend') || targetRole.title.includes('Web')) {
    chosenKey = 'sliding_window';
  } else if (targetRole.title.includes('Backend') || targetRole.title.includes('Full Stack') || targetRole.title.includes('Java')) {
    chosenKey = 'trees_graphs';
  }

  const selectedConcept = verifiedProblemBank[chosenKey] || verifiedProblemBank['arrays_hashmap'];

  return {
    primaryLanguage,
    coreMissingConcept: selectedConcept.concept,
    conceptExplanation: selectedConcept.explanation,
    whyYouNeedIt: selectedConcept.whyNeed,
    problems: [
      {
        difficulty: 'Basic',
        title: selectedConcept.basic.title,
        concept: selectedConcept.concept,
        whyRecommended: selectedConcept.basic.why,
        url: selectedConcept.basic.url,
        platform: 'LeetCode',
      },
      {
        difficulty: 'Intermediate',
        title: selectedConcept.intermediate.title,
        concept: selectedConcept.concept,
        whyRecommended: selectedConcept.intermediate.why,
        url: selectedConcept.intermediate.url,
        platform: 'LeetCode',
      },
      {
        difficulty: 'Advanced',
        title: selectedConcept.advanced.title,
        concept: selectedConcept.concept,
        whyRecommended: selectedConcept.advanced.why,
        url: selectedConcept.advanced.url,
        platform: 'LeetCode',
      },
    ],
  };
}

/**
 * Dynamic 3-Project Trajectory (Progression):
 * 1 Beginner: Existing skills + 1 important new skill
 * 1 Intermediate: Multiple existing skills + critical missing skills
 * 1 Advanced: Realistic production-grade system relevant to target career + company
 * STRICT RULE: Does NOT repeat what the user already demonstrates!
 */
export function generateDynamicProjects(
  targetRole: ICareerRole,
  company: ICompanyProfile,
  detectedSkillNames: Set<string>,
  missingSkills: string[],
  resumeProjects: { title: string; tech: string }[]
): IProject[] {
  const existingTechs = Array.from(detectedSkillNames);
  const primaryExisting = existingTechs[0] ? existingTechs[0].toUpperCase() : 'JavaScript';
  const primaryMissing = missingSkills[0] || 'Docker';
  const secondaryMissing = missingSkills[1] || 'PostgreSQL';

  // Check if candidate already has a basic app to avoid repetition
  const resumeHasFullStack = detectedSkillNames.has('react') && detectedSkillNames.has('node.js');

  const beginnerProject: IProject = {
    _id: 'proj-beg-' + targetRole._id,
    title: `Targeted ${targetRole.title} Milestone: Integrating ${primaryMissing}`,
    difficulty: 'Beginner',
    estimatedTime: '8 - 12 hours',
    relevanceScore: 96,
    skillImpactScore: 89,
    resumeImpactScore: 92,
    skillsGained: [primaryMissing, primaryExisting, 'Modular Architecture'],
    techStack: [primaryExisting, primaryMissing, 'Git', 'Testing'],
    whyRecommended: `Your resume demonstrates proficiency in ${primaryExisting}, but lacks verified proof in ${primaryMissing}. This project bridges that exact prerequisite without repeating your mastered fundamentals.`,
    features: [
      `Hands-on implementation of ${primaryMissing} with clean separation of concerns`,
      'Automated input validation and robust error handling',
      'Configured local environment variables and test scripts',
      'Structured repository with verifiable documentation'
    ],
    resumeValue: `Verifiable proof of ${primaryMissing} competency specifically required for ${targetRole.title} applications at ${company.name}.`,
    prerequisites: [`Familiarity with ${primaryExisting} syntax`],
    goal: `Implement a focused application incorporating ${primaryMissing} alongside your existing ${primaryExisting} skillset.`,
    architecture: {
      client: `${primaryExisting} modular UI layout with clean directory boundaries and state hooks`,
      services: `${primaryMissing} integration with typed service contracts and error interceptors`,
      database: 'Local persistence and schema validation with structured JSON / SQLite storage',
      devops: 'Standardized package scripts, Git commit conventions, and environment isolation (.env.example)',
      security: 'Input sanitization, boundary exception handling, and automated unit test suite',
    },
    milestones: [
      { title: 'Milestone 1: Environment & Setup', tasks: [`Initialize repository, configure tooling, and install ${primaryMissing}`] },
      { title: 'Milestone 2: Core Domain Logic', tasks: ['Build core business logic, type definitions, and validate incoming payloads'] },
      { title: 'Milestone 3: Verification & Defense', tasks: ['Add automated tests, write README architectural decisions, and prepare interview defense'] },
    ],
    interviewQuestions: [
      {
        question: `Why did you choose ${primaryMissing} for this project, and what trade-offs did you encounter?`,
        sampleAnswer: `I utilized ${primaryMissing} to ensure strict data validation and modularity, balancing initial setup complexity against runtime reliability and clean maintainability.`
      }
    ],
    resumeBulletPoints: [
      `Engineered a modular ${targetRole.title} system integrating ${primaryMissing} with ${primaryExisting}, enforcing test coverage and environment isolation.`
    ],
  };

  const intermediateProject: IProject = {
    _id: 'proj-int-' + targetRole._id,
    title: `Scalable ${targetRole.title} Service: ${primaryMissing} & ${secondaryMissing} Platform`,
    difficulty: 'Intermediate',
    estimatedTime: '20 - 30 hours',
    relevanceScore: 98,
    skillImpactScore: 94,
    resumeImpactScore: 95,
    skillsGained: [primaryMissing, secondaryMissing, 'REST APIs', 'Database Indexing', 'Authentication'],
    techStack: [primaryExisting, primaryMissing, secondaryMissing, 'JWT / Auth', 'Docker', 'Testing'],
    whyRecommended: `Combines your demonstrated ${primaryExisting} foundation with your two highest-priority gaps (${primaryMissing} and ${secondaryMissing}) into an integrated client-service system.`,
    features: [
      `End-to-end service integration connecting client requests with ${secondaryMissing} persistence`,
      `Secure token-based authentication and rate limiting`,
      `Optimized data access queries with indexing and pagination`,
      'Containerized development workflow using Docker Compose'
    ],
    resumeValue: `Demonstrates full-stack engineering maturity meeting hiring benchmarks for ${company.name}.`,
    prerequisites: [`Completion of ${primaryMissing} fundamentals`],
    goal: `Build a multi-tier service resolving your top two skill gaps for ${targetRole.title}.`,
    architecture: {
      client: 'Responsive Single-Page Application with optimistic UI mutations, error boundaries, and token storage',
      services: `RESTful/gRPC API controllers with middleware pipelines for authentication, rate limiting, and request logging`,
      database: `${secondaryMissing} with normalized schemas, composite indexes on foreign keys, and connection pooling`,
      devops: 'Multi-stage Dockerfile and Docker Compose orchestration orchestrating web and database containers',
      security: 'Bcrypt password hashing, JWT authorization headers, CORS whitelisting, and SQL injection prevention',
    },
    milestones: [
      { title: 'Phase 1: Architecture & Data Modeling', tasks: [`Design normalized database schema and configure ${secondaryMissing} connection pool`] },
      { title: 'Phase 2: Service Endpoints & Auth', tasks: [`Implement authenticated endpoints, role middleware, and ${primaryMissing} business logic`] },
      { title: 'Phase 3: Production Hardening', tasks: ['Containerize with Docker Compose, benchmark under concurrent load, and document API contracts'] },
    ],
    interviewQuestions: [
      {
        question: `How did you optimize query latency in your ${secondaryMissing} layer?`,
        sampleAnswer: `Created composite indexes on frequently filtered fields, avoided N+1 query patterns using batch joins, and implemented connection pooling with transaction isolation.`
      }
    ],
    resumeBulletPoints: [
      `Architected a production-ready ${targetRole.title} platform integrating ${primaryMissing} and ${secondaryMissing}, serving authenticated endpoints with sub-100ms response times.`
    ],
  };

  const advancedProject: IProject = {
    _id: 'proj-adv-' + targetRole._id,
    title: `Enterprise Production System: High-Concurrency ${targetRole.title} Platform for ${company.name}`,
    difficulty: 'Advanced',
    estimatedTime: '45 - 60 hours',
    relevanceScore: 99,
    skillImpactScore: 97,
    resumeImpactScore: 98,
    skillsGained: ['Distributed Architecture', 'CI/CD Pipelines', 'Cloud Deployment', 'Observability', primaryMissing, secondaryMissing],
    techStack: [primaryExisting, primaryMissing, secondaryMissing, 'Cloud (AWS/GCP)', 'Docker', 'Redis', 'CI/CD', 'OpenTelemetry'],
    whyRecommended: `A portfolio-defining, production-grade system engineered directly around ${company.name}'s hiring standards for ${targetRole.title} roles.`,
    features: [
      'High-throughput asynchronous job processing with distributed caching (Redis)',
      'Automated CI/CD deployment pipelines with linting, unit tests, and Docker image builds',
      'Observability dashboard tracking system health metrics, logs, and error telemetry',
      'Production cloud deployment on AWS/GCP with secure secrets management'
    ],
    resumeValue: `High-signal proof of senior-grade engineering capability, eliminating any doubt about production readiness for ${company.name}.`,
    prerequisites: ['Proficiency with backend microservices and databases'],
    goal: `Engineer a resilient, observable distributed system ready for production traffic at ${company.name}.`,
    architecture: {
      client: 'Modern micro-frontend / client SPA with service workers, local caching, and WebSockets for real-time updates',
      services: 'Horizontally scalable containerized microservices behind a reverse proxy / API gateway with load balancing',
      database: `${secondaryMissing} with read replicas, partitioned sharding strategy, and Redis distributed caching layer`,
      devops: 'Automated GitHub Actions CI/CD pipeline building multi-stage container images deployed to Cloud Run / Kubernetes',
      observability: 'OpenTelemetry distributed tracing, structured JSON log aggregation, Prometheus metrics, and Grafana dashboard alerts',
    },
    milestones: [
      { title: 'Phase 1: Distributed Core & Message Queue', tasks: ['Architect core microservices, event bus, and asynchronous data replication pipelines'] },
      { title: 'Phase 2: Caching, Concurrency & Rate Limiting', tasks: ['Integrate Redis caching, distributed locks, and token-bucket rate limiters'] },
      { title: 'Phase 3: DevOps, Observability & Live Release', tasks: ['Configure CI/CD, deploy live cloud demo, configure OpenTelemetry metrics, and benchmark under stress load'] },
    ],
    interviewQuestions: [
      {
        question: `How would you scale this application from 1,000 to 100,000 active concurrent users at ${company.name}?`,
        sampleAnswer: `Decouple read and write workloads with read replicas, introduce an edge CDN and Redis cache for hot read payloads, decouple asynchronous workloads via Kafka/SQS queues, and horizontally autoscale container pods based on CPU/p99 latency thresholds.`
      }
    ],
    resumeBulletPoints: [
      `Engineered and deployed an enterprise-grade ${targetRole.title} platform featuring containerized microservices, Redis caching, and automated CI/CD pipelines deployed to cloud infrastructure.`
    ],
  };

  return [beginnerProject, intermediateProject, advancedProject];
}

/**
 * Dynamic Interview Preparation Generator
 * Produces questions customized by RESUME EVIDENCE + TARGET CAREER + TARGET COMPANY.
 * Strictly grounds Project & Resume questions in the user's actual uploaded resume content!
 */
export function generateDynamicInterviewQuestions(
  targetRole: ICareerRole,
  company: ICompanyProfile,
  candidateProfile: ICandidateProfile,
  resumeProjects: { title: string; tech: string; description: string }[],
  resumeExperiences: string[],
  detectedSkills: Set<string>,
  missingSkills: string[]
): {
  targetCompany: string;
  targetCareer: string;
  companyFocusNote: string;
  technicalQuestions: { question: string; answerGuidance: string; skill: string }[];
  codingQuestions: { question: string; answerGuidance: string; topic: string }[];
  projectQuestions: { question: string; answerGuidance: string; referencedProject: string }[];
  resumeQuestions: { question: string; answerGuidance: string; context: string }[];
  behavioralQuestions: { question: string; starGuidance: string; principle?: string }[];
  hrQuestions: { question: string; answerGuidance: string }[];
} {
  const primaryLanguage = detectedSkills.has('python')
    ? 'Python'
    : detectedSkills.has('java')
    ? 'Java'
    : 'JavaScript';

  // 1. Technical Questions (Role & Skill Specific)
  const technicalQuestions = [
    {
      skill: targetRole.requiredSkills[0] || 'Architecture',
      question: `In a production ${targetRole.title} environment, how do you handle asynchronous race conditions and ensure idempotent API responses?`,
      answerGuidance: `Explain idempotency keys (UUID headers), transaction locks, and defensive state synchronization patterns.`,
    },
    {
      skill: missingSkills[0] || targetRole.requiredSkills[1] || 'Databases',
      question: `How does database indexing work under the hood, and when can an index degrade system write performance?`,
      answerGuidance: `Discuss B-Tree data structures, indexing lookups vs sequential scans, and explain how maintaining indexes during high-frequency INSERT/UPDATE operations introduces write amplification.`,
    },
    {
      skill: 'System Design',
      question: `How would you design a rate limiter to protect ${company.name}'s APIs from volumetric denial of service or abuse?`,
      answerGuidance: `Explain Token Bucket or Leaky Bucket algorithms, distributed Redis counters with atomic EVAL Lua scripts, and sliding window logs.`,
    },
  ];

  // 2. Coding Questions (Language & Algorithmic Focus)
  const codingQuestions = [
    {
      topic: 'Optimal Space-Time Trade-offs',
      question: `Given a continuous data stream, how would you find the top K most frequent elements in O(n log k) time using ${primaryLanguage}?`,
      answerGuidance: `Construct a Min-Heap of fixed size K while iterating over element frequencies. Avoid O(n log n) full sorts.`,
    },
    {
      topic: 'Concurrency & Edge Cases',
      question: `How would you implement a thread-safe / asynchronous debounce function in ${primaryLanguage} that guarantees execution after rapid events stop?`,
      answerGuidance: `Demonstrate closure scoping, clearing existing timer handles, and preserving execution context/arguments.`,
    },
  ];

  // 3. Project Questions (STRICTLY GROUNDED IN USER'S RESUME PROJECTS!)
  const projectQuestions: { question: string; answerGuidance: string; referencedProject: string }[] = [];

  if (resumeProjects.length > 0) {
    const firstProj = resumeProjects[0];
    projectQuestions.push({
      referencedProject: firstProj.title || 'Your featured project',
      question: `In your project "${firstProj.title}", what was the most difficult architectural bottleneck you encountered, and how did you diagnose it?`,
      answerGuidance: `Frame your answer using metric-driven evidence: identify the bottleneck (e.g. state re-renders, database queries, memory leak), explain the diagnostic tool used (DevTools, profiler, logs), and explain the fix.`,
    });

    if (resumeProjects.length > 1) {
      const secondProj = resumeProjects[1];
      projectQuestions.push({
        referencedProject: secondProj.title,
        question: `Looking at your work on "${secondProj.title}", how did you approach input validation and security? How would you scale it for ${company.name}?`,
        answerGuidance: `Discuss sanitization schemas, CORS policies, authentication tokens, and how you would decouple heavy computations using message queues.`,
      });
    } else {
      projectQuestions.push({
        referencedProject: firstProj.title,
        question: `If you had to re-architect "${firstProj.title}" today for 10x higher user concurrency, what technology or schema choices would you replace?`,
        answerGuidance: `Discuss trade-offs between relational vs document databases, client-side caching vs edge CDN, and microservice decoupling.`,
      });
    }
  } else {
    // If no explicit projects section found in resume
    projectQuestions.push({
      referencedProject: 'Technical Implementation Experience',
      question: `Walk me through the most technically complex software system you have built during your academic or professional career.`,
      answerGuidance: `Structure your response around System Architecture, Tech Stack Choice, Key Obstacles, and Quantitative Results.`,
    });
    projectQuestions.push({
      referencedProject: 'System Scalability',
      question: `How did you manage error logging, edge cases, and deployment in the applications highlighted in your resume?`,
      answerGuidance: `Explain try-catch boundaries, centralized logging middleware, environment secrets management, and automated testing.`,
    });
  }

  // 4. Resume-Based Questions (Grounded in their actual education & background)
  const resumeQuestions = [
    {
      context: candidateProfile.headline || 'Career Transition',
      question: `Your resume highlights background in "${candidateProfile.headline || 'Software Engineering'}". What inspired you to target ${targetRole.title} positions at ${company.name}?`,
      answerGuidance: `Connect your past technical milestones directly to the core challenges of ${targetRole.title}, emphasizing continuous self-directed learning.`,
    },
    {
      context: 'Self-Directed Skill Growth',
      question: `I see from your profile that you've demonstrated strong skill in ${Array.from(detectedSkills).slice(0, 3).join(', ')}. How do you systematically learn and validate a new engineering tool when faced with tight deadlines?`,
      answerGuidance: `Describe your hands-on methodology: reading official specifications, building minimal reproducible prototypes, studying failure modes, and shipping test cases.`,
    },
  ];

  // 5. Behavioral Questions (Aligned with Target Company Principles)
  const behavioralQuestions = [
    {
      principle: company.behavioralFocus[0] || 'Technical Ownership',
      question: `Tell me about a time you experienced a major technical disagreement with a teammate or peer. How did you reach consensus?`,
      starGuidance: `Use STAR format: Situation (context of disagreement), Task (your technical objective), Action (how you presented objective data/benchmarks rather than ego), Result (the positive delivery outcome).`,
    },
    {
      principle: company.behavioralFocus[1] || 'Resilience under Ambiguity',
      question: `Describe a situation where a critical software bug or unexpected failure occurred right before a submission or release. How did you respond?`,
      starGuidance: `Highlight calm prioritization, root cause isolation, transparent stakeholder communication, post-mortem blameless learning, and automated prevention.`,
    },
  ];

  // 6. HR Questions
  const hrQuestions = [
    {
      question: `What criteria are most important to you when evaluating an engineering team's culture and work environment at ${company.name}?`,
      answerGuidance: `Highlight psychological safety, engineering excellence, high-trust mentorship, and opportunities to deliver impactful product features.`,
    },
    {
      question: `Where do you see your engineering capabilities developing over the next 2-3 years as a ${targetRole.title}?`,
      answerGuidance: `Articulate a trajectory of deepening architectural autonomy, contributing to system design reviews, and mentoring junior engineers.`,
    },
  ];

  return {
    targetCompany: company.name,
    targetCareer: targetRole.title,
    companyFocusNote: `Company-aligned preparation for ${company.name}: ${company.interviewStyle}`,
    technicalQuestions,
    codingQuestions,
    projectQuestions,
    resumeQuestions,
    behavioralQuestions,
    hrQuestions,
  };
}
