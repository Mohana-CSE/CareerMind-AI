import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Target, 
  GitCompare, 
  Award, 
  Map, 
  CheckCircle2, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 text-center pt-8 pb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation AI Career Intelligence for Students</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Bridge the Gap Between <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
            What You Know
          </span>{' '}
          & What Top Tech Hires For
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
          CareerMind AI extracts skills from your resume, compares them semantically against target job roles, 
          calculates your verified <strong className="text-white">Career Readiness Score</strong>, and creates an 
          <strong className="text-indigo-300"> adaptive roadmap</strong> that evolves as you learn.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('resume')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Upload Resume & Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all"
          >
            <span>Explore Live Dashboard Demo</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-xl font-bold text-indigo-400">Semantic NLP</div>
            <div className="text-xs text-slate-400 mt-1">Recognizes equivalents like Spring Framework ↔ Spring Boot API</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-xl font-bold text-cyan-400">5-Pillar Score</div>
            <div className="text-xs text-slate-400 mt-1">Holistic readiness covering Code, DSA, Projects & Certifications</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-xl font-bold text-emerald-400">Adaptive Path</div>
            <div className="text-xs text-slate-400 mt-1">Dynamic milestones update whenever you check off practice tasks</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-xl font-bold text-amber-400">Job Matching</div>
            <div className="text-xs text-slate-400 mt-1">Curated real openings ranked by live profile compatibility</div>
          </div>
        </div>
      </div>

      {/* Interactive Workflow Steps */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How CareerMind AI Works</h2>
          <p className="text-sm text-slate-400 mt-2">End-to-end intelligent student career acceleration pipeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 relative hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/20">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Upload Resume</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF resume. Our parser extracts technical skills, education, projects, and certifications accurately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 relative hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4 border border-cyan-500/20">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Select Target Role</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose from Java Full Stack, React Frontend, Python Backend, AI/ML, DevOps, and more.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 relative hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-500/20">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Semantic Gap Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies matched vs missing skills using semantic intelligence, prioritizing urgent gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 relative hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-4 border border-amber-500/20">
              4
            </div>
            <h3 className="text-base font-bold text-white mb-2">Adaptive Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Follow tailored practice challenges. As you complete milestones, your roadmap adapts and readiness climbs!
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
