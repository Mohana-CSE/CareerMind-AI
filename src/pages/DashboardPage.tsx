import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Code2,
  FolderGit2,
  Zap,
  HelpCircle,
  ExternalLink,
  Milestone,
  ShieldCheck,
  TestTube2,
  BarChart3,
  Building2,
  Briefcase,
  Layers,
  Check,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  Flame,
  Target
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { CareerPathGraphView } from '../components/CareerPathGraphView';
import { IProject } from '../../server/models/types';

interface DashboardPageProps {
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

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentAnalysis, isDemoMode, setSelectedProjectId, updateTargetSelection } = useAnalysis();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'detected' | 'missing'>('all');
  const [interviewTab, setInterviewTab] = useState<'technical' | 'coding' | 'project' | 'resume' | 'behavioral' | 'hr'>('project');
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [customCompanyInput, setCustomCompanyInput] = useState('');
  const [isCustomCompanyMode, setIsCustomCompanyMode] = useState(false);

  if (!currentAnalysis) {
    return (
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            No Resume Analysis Loaded
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Upload your technical resume or explore our sample demo profile to generate your personalized career intelligence report.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-md"
          >
            Upload Resume
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-all cursor-pointer"
          >
            Try Demo
          </button>
        </div>
      </div>
    );
  }

  const {
    candidateProfile,
    careerReadinessScore,
    readinessBreakdown,
    topCareerMatch,
    targetCompany = 'Google',
    skillsDetected,
    skillGaps,
    nextBestSkill,
    nextBestAction,
    recommendedProjects,
    recommendedCourses = [],
    codingPractice,
    interviewPreparation,
    progressionRoadmap,
    jobReadiness,
    alternativeCareers,
  } = currentAnalysis;

  const detectedSkills = skillsDetected.filter(s => s.detected);
  const missingSkills = skillsDetected.filter(s => !s.detected);

  const filteredSkills =
    selectedFilter === 'all'
      ? skillsDetected
      : selectedFilter === 'detected'
      ? detectedSkills
      : missingSkills;

  const handleCareerChange = async (newCareer: string) => {
    setIsUpdatingTarget(true);
    await updateTargetSelection(newCareer, targetCompany);
    setIsUpdatingTarget(false);
  };

  const handleCompanyChange = async (newCompany: string) => {
    setIsUpdatingTarget(true);
    await updateTargetSelection(topCareerMatch.title, newCompany);
    setIsUpdatingTarget(false);
  };

  const handleCustomCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCompanyInput.trim()) return;
    setIsUpdatingTarget(true);
    await updateTargetSelection(topCareerMatch.title, customCompanyInput.trim());
    setIsUpdatingTarget(false);
    setIsCustomCompanyMode(false);
    setCustomCompanyInput('');
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Welcome & State Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {candidateProfile?.name ? candidateProfile.name : (user ? user.name : 'Candidate Intelligence')}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDemoMode
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isDemoMode ? <TestTube2 className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {isDemoMode ? 'DEMO ANALYSIS' : 'VERIFIED RESUME ANALYSIS'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {candidateProfile?.headline || 'Engineered from verified resume evidence'} • Prepared for <strong className="text-slate-900 dark:text-white">{topCareerMatch.title}</strong> at <strong className="text-emerald-500">{targetCompany}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Upload New Resume
          </button>
          <button
            onClick={() => onNavigate('careers')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all cursor-pointer"
          >
            Compare Careers
          </button>
        </div>
      </div>

      {/* DYNAMIC TARGET CONTROL BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border border-emerald-500/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Target Career Selector */}
          <div className="space-y-1 flex-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              Target Career Role
            </label>
            <select
              value={topCareerMatch.title}
              disabled={isUpdatingTarget}
              onChange={e => handleCareerChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {CAREER_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Target Company Selector */}
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                Target Company
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCompanyMode(!isCustomCompanyMode)}
                className="text-[10px] text-emerald-500 hover:underline cursor-pointer font-semibold"
              >
                {isCustomCompanyMode ? 'Choose from list' : '+ Enter other company'}
              </button>
            </div>

            {isCustomCompanyMode ? (
              <form onSubmit={handleCustomCompanySubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter company name..."
                  value={customCompanyInput}
                  onChange={e => setCustomCompanyInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  type="submit"
                  disabled={isUpdatingTarget}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer shrink-0"
                >
                  Set
                </button>
              </form>
            ) : (
              <select
                value={targetCompany}
                disabled={isUpdatingTarget}
                onChange={e => handleCompanyChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {POPULAR_COMPANIES.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {isUpdatingTarget && (
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Recalculating CareerMind Intelligence...
          </div>
        )}
      </div>

      {/* SECTION 1: Dual Scores (Career Match vs Career Readiness) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Career Readiness Score Card */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Career Readiness Score
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase">
                Preparedness Index
              </span>
            </div>

            <div className="text-center my-3">
              <div className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                {careerReadinessScore}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                How prepared you are to interview and produce on day 1 for <strong>{topCareerMatch.title}</strong>
              </p>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Readiness Breakdown (0–100)
            </div>
            {[
              { label: 'Technical Skills', val: readinessBreakdown.technicalSkills, color: 'bg-emerald-500' },
              { label: 'Practical Projects', val: readinessBreakdown.projects, color: 'bg-teal-500' },
              { label: 'Experience Depth', val: readinessBreakdown.experience, color: 'bg-indigo-500' },
              { label: 'Career Alignment', val: readinessBreakdown.careerAlignment, color: 'bg-blue-500' },
              { label: 'Interview Preparedness', val: readinessBreakdown.interviewReadiness, color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Match Score Card */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Target Career Match
                </span>
                <span className="text-xs text-slate-400">Deterministic Evidence</span>
              </div>
              <div className="text-3xl font-black text-emerald-500">
                {topCareerMatch.matchPercentage}% Match
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              {topCareerMatch.title}
            </h2>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-5">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Grounded in your resume
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {topCareerMatch.whyFits}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strong Skills */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Strong Skills ({topCareerMatch.strongSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topCareerMatch.strongSkills.length > 0 ? (
                    topCareerMatch.strongSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None detected for this specific role</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Missing Skills ({topCareerMatch.missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topCareerMatch.missingSkills.length > 0 ? (
                    topCareerMatch.missingSkills.slice(0, 6).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-500 font-semibold">All core skills demonstrated!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-medium">Market Growth: </span>
              <span className="font-bold text-teal-500">{topCareerMatch.careerGrowth}</span>
            </div>
            <div>
              <span className="font-medium">Learning Effort: </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{topCareerMatch.learningEffort}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Next Best Skill & Next Best Action */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Next Best Skill Banner */}
        <div className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Next Best Skill to Learn
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
              {nextBestSkill?.priority || 'HIGH'} PRIORITY
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {nextBestSkill?.name || 'Modular Service Architecture'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {nextBestSkill?.reason}
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-800 dark:text-slate-200">Practical Value: </strong>
            {nextBestSkill?.practicalValue}
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border-2 border-emerald-500/40 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              Highest Leverage Milestone
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 mb-2">
              {nextBestAction.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {nextBestAction.reason}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (nextBestAction.projectId) {
                  setSelectedProjectId(nextBestAction.projectId);
                } else {
                  onNavigate('projects');
                }
              }}
              className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {nextBestAction.buttonText || 'Start Project Blueprint'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Dynamic Target-Role Courses & Resources */}
      {recommendedCourses.length > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Targeted Resources</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Courses & Official Documentation for {topCareerMatch.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeted to your verified skill gaps — no unrelated generic materials
              </p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Learning Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                      {c.skill}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.provider}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {c.whyRecommended}
                  </p>
                </div>

                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Concept-First LeetCode & Coding Practice */}
      {codingPractice && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Concept-First Algorithmic Practice</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Core Missing Concept: {codingPractice.coreMissingConcept}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Primary Language: <strong className="text-slate-700 dark:text-slate-300">{codingPractice.primaryLanguage}</strong> • Personalized for {targetCompany}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 max-w-md text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-emerald-500">Why You Need It: </strong>
              {codingPractice.whyYouNeedIt}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {codingPractice.problems.map((prob, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        prob.difficulty === 'Basic'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : prob.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {prob.difficulty} Problem
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">LeetCode</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {prob.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prob.whyRecommended}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={prob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Open on LeetCode</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Dynamic 3-Project Trajectory (Progression) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Project Progression Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Dynamic 3-Project Trajectory for {targetCompany}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Beginner → Intermediate → Advanced progression that bridges your exact gaps without repeating existing skills
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      proj.difficulty === 'Beginner'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : proj.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}
                  >
                    {proj.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{proj.estimatedTime}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {proj.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {proj.whyRecommended}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Skills Gained
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.skillsGained.slice(0, 4).map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setSelectedProjectId(proj._id)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  View Project Blueprint
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Dynamic Interview Preparation Section */}
      {interviewPreparation && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Interview Intelligence</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Personalized Interview Preparation for {targetCompany}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {interviewPreparation.companyFocusNote}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              {[
                { id: 'project', label: 'Resume Projects' },
                { id: 'technical', label: 'Technical' },
                { id: 'coding', label: 'Coding' },
                { id: 'resume', label: 'Background' },
                { id: 'behavioral', label: 'Behavioral (STAR)' },
                { id: 'hr', label: 'HR' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInterviewTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    interviewTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {interviewTab === 'project' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Grounded in your actual uploaded projects — prepare to defend architecture decisions, scaling trade-offs, and security.
                </div>
                {interviewPreparation.projectQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                      Referenced Project: {q.referencedProject}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Answer Guidance: </strong>{q.answerGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interviewTab === 'technical' && (
              <div className="space-y-4">
                {interviewPreparation.technicalQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                      Topic: {q.skill}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Answer Guidance: </strong>{q.answerGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interviewTab === 'coding' && (
              <div className="space-y-4">
                {interviewPreparation.codingQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                      Concept: {q.topic}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Optimal Strategy: </strong>{q.answerGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interviewTab === 'resume' && (
              <div className="space-y-4">
                {interviewPreparation.resumeQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-purple-500 uppercase tracking-wider">
                      Context: {q.context}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Answer Guidance: </strong>{q.answerGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interviewTab === 'behavioral' && (
              <div className="space-y-4">
                {interviewPreparation.behavioralQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                      Company Principle: {q.principle}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>STAR Framework: </strong>{q.starGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interviewTab === 'hr' && (
              <div className="space-y-4">
                {interviewPreparation.hrQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      "{q.question}"
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Best Approach: </strong>{q.answerGuidance}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 7: Career Path Graph */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Career Transformation Trajectory Graph
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive roadmap from current resume skills → gaps → targeted courses → LeetCode → 3 projects → {targetCompany} placement
          </p>
        </div>
        <CareerPathGraphView analysis={currentAnalysis} />
      </div>

      {/* SECTION 8: Skill Intelligence & Evidence Filter */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Skill Intelligence & Verifiable Evidence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every status is backed by explicit evidence quotes from your uploaded resume.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({skillsDetected.length})
            </button>
            <button
              onClick={() => setSelectedFilter('detected')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedFilter === 'detected'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Detected ({detectedSkills.length})
            </button>
            <button
              onClick={() => setSelectedFilter('missing')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedFilter === 'missing'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Missing ({missingSkills.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                item.detected
                  ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50'
                  : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/40 dark:border-rose-900/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.skill}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.level === 'Advanced'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : item.level === 'Intermediate'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                      : item.level === 'Beginner'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {item.level}
                </span>
              </div>

              {item.detected && (
                <div className="mb-3 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.proficiencyScore}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.detected ? 'Evidence: ' : 'Reason: '}
                </span>
                {item.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 9: Progression Roadmap */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Personalized Roadmap to {targetCompany}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            From current resume skills → gaps → 3 projects → interview mastery → job ready
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {progressionRoadmap.map((step) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';

            return (
              <div
                key={step.step}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isInProgress
                    ? 'bg-teal-500/10 border-teal-500/40 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400">Step {step.step}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : isInProgress ? (
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    ) : null}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {step.stage}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                    {step.title}
                  </p>
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {step.status.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
