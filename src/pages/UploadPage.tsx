import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TestTube2,
  RefreshCw,
  Code,
  Database,
  Cpu,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

const CAREER_OPTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'MERN Developer',
  'Java Developer',
  'Python Developer',
  'AI Engineer',
  'ML Engineer',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Mobile Developer',
];

const POPULAR_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'Infosys',
  'TCS',
  'Accenture',
  'Wipro',
  'Zoho',
  'Freshworks',
];

// Helper to generate real valid text-stream PDF files in the browser for testing
function generateTestPdf(filename: string, text: string): File {
  const lines = text.split('\n');
  let content = 'BT\n/F1 11 Tf\n50 750 Td\n';
  for (let i = 0; i < lines.length; i++) {
    const escaped = lines[i].replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    if (i === 0) {
      content += `(${escaped}) Tj\n`;
    } else {
      content += `0 -14 Td\n(${escaped}) Tj\n`;
    }
  }
  content += 'ET';
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(content);

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];

  function appendObj(str: string) {
    offsets.push(encoder.encode(out).length);
    out += str + '\n';
  }

  appendObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  appendObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  appendObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj');
  appendObj(`4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${content}\nendstream\nendobj`);
  appendObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');

  const xrefOffset = encoder.encode(out).length;
  out += 'xref\n0 6\n0000000000 65535 f \n';
  for (const off of offsets) {
    out += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  out += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const finalBytes = encoder.encode(out);
  return new File([finalBytes], filename, { type: 'application/pdf' });
}

export const UploadPage: React.FC<UploadPageProps> = ({ onNavigate }) => {
  const { uploadResumeFile, loadDemoMode, error, clearError } = useAnalysis();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetCareer, setTargetCareer] = useState<string>('Frontend Developer');
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [customCompany, setCustomCompany] = useState<string>('');
  const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);
  const [activeTestRun, setActiveTestRun] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveCompany = isCustomCompany ? (customCompany.trim() || 'Custom Tech Co') : targetCompany;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    clearError();
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext || '')) {
      alert('Unsupported file format. Please upload your resume as PDF or DOCX.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) return;
    const res = await uploadResumeFile(selectedFile, targetCareer, effectiveCompany);
    if (res.success) {
      onNavigate('dashboard');
    }
  };

  // Automated Quick-Tests for Verification
  const runTestScenario = async (testId: string) => {
    setActiveTestRun(testId);
    clearError();

    let fileToUpload: File | null = null;

    if (testId === 'resume_a_frontend') {
      fileToUpload = generateTestPdf(
        'Alex_Rivera_Frontend_Resume.pdf',
        `ALEX RIVERA
Frontend Web Engineer | React, TypeScript & Next.js
Email: alex.rivera@example.com | Phone: (555) 432-8765 | GitHub: github.com/alexrivera-dev | San Francisco, CA

PROFESSIONAL SUMMARY:
Frontend software engineer with 3+ years of experience engineering responsive web apps using React, TypeScript, JavaScript ES6+, HTML5, CSS3, Tailwind CSS, and Next.js.

TECHNICAL SKILLS:
Frontend: React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Redux, Responsive Design
Tools: Git, Vite, npm, Webpack, Jest, Figma

WORK EXPERIENCE:
Frontend Developer | PixelCraft Studio (2022 - Present)
- Engineered responsive client dashboards with React and TypeScript, increasing user interaction by 35%.
- Implemented state management using Redux Toolkit and designed modular Tailwind CSS layouts.
- Integrated REST API endpoints with optimistic caching.

PROJECTS:
- Responsive SaaS Dashboard: Built real-time analytics UI in React and Next.js.
- Interactive Component Library: Created reusable design system with Tailwind CSS and TypeScript.

EDUCATION:
B.S. in Computer Science | San Jose State University (2018 - 2022) | GPA: 3.7`
      );
    } else if (testId === 'resume_b_java') {
      fileToUpload = generateTestPdf(
        'Siddharth_Sharma_Java_Backend_Resume.pdf',
        `SIDDHARTH SHARMA
Java Backend Software Engineer | Spring Boot & Microservices
Email: siddharth.sharma@example.com | Phone: (555) 987-6543 | LinkedIn: linkedin.com/in/siddharth-backend | Austin, TX

PROFESSIONAL SUMMARY:
Backend engineer with 4 years of experience building high-throughput distributed microservices using Java 17, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, SQL, and Apache Kafka.

TECHNICAL SKILLS:
Backend: Java, Spring Boot, Hibernate/JPA, Microservices, REST APIs, OOP, Maven/Gradle
Databases & Messaging: PostgreSQL, SQL, MySQL, Apache Kafka, Redis
Tools: Git, Linux, Docker, JUnit

WORK EXPERIENCE:
Senior Backend Developer | FinTech Scale Corp (2021 - Present)
- Architected enterprise RESTful microservices in Java and Spring Boot handling 60,000 requests per minute.
- Optimized PostgreSQL relational queries, indexing, and connection pooling, reducing latency by 45%.
- Implemented Kafka event streams for transaction auditing.

PROJECTS:
- Distributed Payment Gateway: Built Spring Boot microservices with JWT token authentication and Kafka.
- Banking Ledger API: Designed 3NF PostgreSQL database schemas with Spring Data JPA.

EDUCATION:
B.Tech in Information Technology | National Institute of Technology (2017 - 2021)`
      );
    } else if (testId === 'resume_c_ai') {
      fileToUpload = generateTestPdf(
        'Maya_Chen_AI_ML_Resume.pdf',
        `MAYA CHEN
AI & Machine Learning Engineer | LLMs, PyTorch & Data Science
Email: maya.chen@example.com | Phone: (555) 765-4321 | GitHub: github.com/mayachen-ai | Seattle, WA

PROFESSIONAL SUMMARY:
Data Scientist and AI Engineer specialized in Python, Machine Learning, PyTorch, Scikit-Learn, Pandas, Large Language Models (LLMs), Embeddings, Vector Databases, and RAG architectures.

TECHNICAL SKILLS:
AI/ML: Python, PyTorch/TensorFlow, Machine Learning, Scikit-Learn, Pandas, NumPy, LLMs, Prompt Engineering, Vector Databases, LangChain/LlamaIndex, Embeddings
Databases & Tools: SQL, PostgreSQL, ChromaDB, FastAPI, Docker, Git

WORK EXPERIENCE:
AI Research Engineer | NeuralVanguard Labs (2022 - Present)
- Engineered end-to-end Retrieval-Augmented Generation (RAG) pipelines in Python and FastAPI using dense embeddings.
- Trained predictive neural networks in PyTorch achieving 92% classification accuracy on multi-million row datasets.

PROJECTS:
- Enterprise Semantic Search: Built RAG pipeline using ChromaDB, Gemini embeddings, and FastAPI.
- Customer Churn Predictor: Implemented Random Forest and XGBoost classifiers in Scikit-Learn.

EDUCATION:
M.S. in Computer Science (AI Track) | University of Washington (2020 - 2022)`
      );
    } else if (testId === 'resume_d_fresher') {
      setTargetCareer('Frontend Developer');
      setTargetCompany('Google');
      fileToUpload = generateTestPdf(
        'Mohana_Fresher_Resume.pdf',
        `MOHANA S
Aspiring Frontend Developer
Email: mohana@example.com | Phone: +91 9876543210 | Chennai, India
LinkedIn: linkedin.com/in/mohana-dev | GitHub: github.com/mohana-cs

OBJECTIVE:
Motivated Computer Science graduate seeking an entry-level Frontend Developer position at Google to apply skills in C, Java Basics, HTML, and CSS to design high-performance responsive web user interfaces.

EDUCATION:
Bachelor of Engineering (B.E.) in Computer Science and Engineering
Anna University (2020 - 2024) | CGPA: 8.5 / 10

TECHNICAL SKILLS:
Programming: C, Java Basics
Web Technologies: HTML, CSS
Developer Tools: Git, VS Code

SOFT SKILLS:
Problem Solving, Team Collaboration, Communication, Time Management, Adaptability

CERTIFICATIONS:
- NPTEL Online Certification in Programming in C
- Zscaler Certified Cloud Associate
- IBM SkillsBuild Front-End Web Development

PROFESSIONAL MEMBERSHIP:
- Computer Society of India (CSI) - Student Member
- IEEE Computer Society - Student Member`
      );
    } else if (testId === 'reject_assignment') {
      fileToUpload = generateTestPdf(
        'assignment_unit4.pdf',
        `DEPARTMENT OF COMPUTER SCIENCE
CS204: DATA STRUCTURES & ALGORITHMS - ASSIGNMENT 3
Total Marks: 50 | Due Date: October 20th
Course Instructor: Dr. Robert Miller | Student Name: ____________ | Roll No: ______

Question 1: (10 Marks)
Explain the difference between a Binary Search Tree and an AVL Tree. Show tree rotations with diagrams.

Question 2: (15 Marks)
Write an algorithm to implement Dijkstra's Single Source Shortest Path on a directed weighted graph.

Question 3: (15 Marks)
Solve the recurrence relation T(n) = 2T(n/2) + O(n) using Master's Theorem.

Question 4: (10 Marks)
Define collision resolution techniques in Open Addressing hashing. Compare linear probing vs quadratic probing.

Submission Instructions: Submit written answers to the TA before 5:00 PM.`
      );
    } else if (testId === 'reject_certificate') {
      fileToUpload = generateTestPdf(
        'course_completion_certificate.pdf',
        `CERTIFICATE OF COMPLETION
This is to certify that
JOHNATHAN DOE
has successfully completed the 8-week intensive workshop on
Introduction to Cloud Infrastructure and Web Development
Conducted from August 1 to September 25.
Certificate ID: CERT-89420-XYZ | Date of Issue: September 28
Authorized Signatory: Vice President of Academic Training`
      );
    } else if (testId === 'reject_notes') {
      fileToUpload = generateTestPdf(
        'lecture_notes_chapter2.pdf',
        `LECTURE NOTES: OPERATING SYSTEMS (UNIT II)
Chapter 2: Process Scheduling and Deadlocks
Table of Contents:
2.1 Definition of Process State
2.2 Context Switching
2.3 CPU Scheduling Algorithms (FCFS, Round Robin, Priority)
2.4 Banker's Algorithm for Deadlock Avoidance

Definition 2.1: A process is a program in execution requiring resources like CPU time, memory, and I/O devices.
Theorem 2.1: Necessary conditions for deadlock include Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.
References and Further Reading: Silberschatz, Galvin - Operating System Concepts 10th Edition.`
      );
    } else if (testId === 'reject_report') {
      fileToUpload = generateTestPdf(
        'final_project_report.pdf',
        `A PROJECT REPORT ON
SMART TRAFFIC MONITORING SYSTEM
Submitted in partial fulfillment of the requirements for the award of the degree of
BACHELOR OF ENGINEERING IN COMPUTER SCIENCE
Under the guidance of Dr. Sarah Jenkins, Associate Professor
BONAFIDE CERTIFICATE
This is to certify that this project report is the bonafide work of Group 4.
ABSTRACT:
This report details the existing system bottlenecks in urban traffic management, literature survey of sensor networks, proposed system architecture, and system requirements specification.
CHAPTER 1: INTRODUCTION
CHAPTER 2: LITERATURE REVIEW
CHAPTER 3: SYSTEM ARCHITECTURE
CHAPTER 4: CONCLUSION AND FUTURE ENHANCEMENTS`
      );
    } else if (testId === 'reject_txt') {
      // Create a TXT file which must be rejected by format validator
      fileToUpload = new File(
        ['Alexander Smith\nSoftware Engineer with JavaScript and React'],
        'resume_alex.txt',
        { type: 'text/plain' }
      );
    }

    if (fileToUpload) {
      setSelectedFile(fileToUpload);
      const res = await uploadResumeFile(fileToUpload, targetCareer, effectiveCompany);
      setActiveTestRun(null);
      if (res.success) {
        onNavigate('dashboard');
      }
    }
  };

  const handleTryDemo = async () => {
    await loadDemoMode();
    onNavigate('dashboard');
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dynamic Career Intelligence Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Upload Your Resume
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          CareerMind AI studies your actual resume to detect verified skills, calculate independent 0–100 scores, pinpoint your exact gaps, and tailor preparation to your target company.
        </p>
      </div>

      {/* Target Role & Company Selector Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Career & Company Personalization
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Personalizes Gaps, LeetCode & Projects</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Career Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              Target Career Role
            </label>
            <select
              value={targetCareer}
              onChange={e => setTargetCareer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {CAREER_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Target Company Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Target Company</span>
              <button
                type="button"
                onClick={() => setIsCustomCompany(!isCustomCompany)}
                className="text-[11px] text-emerald-500 hover:underline cursor-pointer font-medium"
              >
                {isCustomCompany ? 'Choose from list' : '+ Custom company'}
              </button>
            </label>

            {isCustomCompany ? (
              <input
                type="text"
                placeholder="Enter company name (e.g. Stripe, Uber, Zoho)..."
                value={customCompany}
                onChange={e => setCustomCompany(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            ) : (
              <select
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {POPULAR_COMPANIES.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Resume Validation Notice</h4>
              <p className="text-xs mt-1 leading-relaxed font-semibold">{error}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Only genuine resumes/CVs in PDF or DOCX format are analyzed. Non-resume documents (assignments, certificates, lecture notes, reports) are strictly stopped.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-500/20">
            <button
              onClick={() => {
                clearError();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload Valid Resume
            </button>
            <button
              onClick={handleTryDemo}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <TestTube2 className="w-3.5 h-3.5 text-amber-500" />
              Try Demo Instead
            </button>
          </div>
        </div>
      )}

      {/* Upload Drop Zone (PDF & DOCX Only) */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-white/70 dark:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Choose your resume file or drag & drop'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Accepted formats: <strong className="text-slate-700 dark:text-slate-300">PDF (.pdf)</strong> or <strong className="text-slate-700 dark:text-slate-300">Word (.docx)</strong> up to 10MB
            </p>
          </div>

          {selectedFile ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitUpload();
                }}
                className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Analyze for {targetCareer}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="pt-1">
              <span className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Browse Files
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Strict Resume Multi-Signal Notice */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Multi-Signal Resume Verification System</span>
        </div>
        <p className="leading-relaxed">
          The engine performs format validation → deep text extraction → document content analysis → multi-signal resume verification.
          Non-resume documents (assignments, certificates, study notes, project reports, question papers) are strictly rejected before analysis.
        </p>
      </div>

      {/* QUICK TESTING SCENARIO PANEL */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Instant Validation & Benchmark Test Suite
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">1-Click Test Scenarios</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Verify that different resumes produce completely different dynamic scores, gaps, courses, LeetCode problems, projects, and interview questions — and that non-resume documents are cleanly rejected!
        </p>

        {/* Valid Resumes (Should be Accepted and produce distinct results) */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid Resumes (Produce Distinct Scores & Recommendations)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              onClick={() => runTestScenario('resume_a_frontend')}
              disabled={Boolean(activeTestRun)}
              className="p-3 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                Resume A (Frontend)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                React, TypeScript, Next.js, CSS
              </div>
            </button>

            <button
              onClick={() => runTestScenario('resume_b_java')}
              disabled={Boolean(activeTestRun)}
              className="p-3 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                Resume B (Java Backend)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Java 17, Spring Boot, PostgreSQL, Kafka
              </div>
            </button>

            <button
              onClick={() => runTestScenario('resume_c_ai')}
              disabled={Boolean(activeTestRun)}
              className="p-3 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                Resume C (AI/ML)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Python, PyTorch, LLMs, ChromaDB
              </div>
            </button>

            <button
              onClick={() => runTestScenario('resume_d_fresher')}
              disabled={Boolean(activeTestRun)}
              className="p-3 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">
                Resume D (Fresher / Student)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Objective, B.E CSE, Skills, Certs (0 Exp/Projects)
              </div>
            </button>
          </div>
        </div>

        {/* Rejection Tests (Should be Stopped with exact error messages) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Non-Resume Tests (Must be Rejected — Zero Fake Analysis)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => runTestScenario('reject_assignment')}
              disabled={Boolean(activeTestRun)}
              className="p-2.5 rounded-xl text-center border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Assignment PDF
            </button>
            <button
              onClick={() => runTestScenario('reject_certificate')}
              disabled={Boolean(activeTestRun)}
              className="p-2.5 rounded-xl text-center border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Certificate PDF
            </button>
            <button
              onClick={() => runTestScenario('reject_notes')}
              disabled={Boolean(activeTestRun)}
              className="p-2.5 rounded-xl text-center border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              College Notes PDF
            </button>
            <button
              onClick={() => runTestScenario('reject_report')}
              disabled={Boolean(activeTestRun)}
              className="p-2.5 rounded-xl text-center border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Project Report PDF
            </button>
            <button
              onClick={() => runTestScenario('reject_txt')}
              disabled={Boolean(activeTestRun)}
              className="p-2.5 rounded-xl text-center border border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500 bg-rose-50/20 dark:bg-rose-950/10 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1"
            >
              TXT File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
