import React from 'react';
import { Sparkles, Heart, Code2, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200">CareerMind AI</span>
          <span className="text-slate-600">|</span>
          <span>Skill Gap Analyzer & Adaptive Career Roadmap</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>FastAPI & Semantic NLP</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>React + Vite + Tailwind</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Database</span>
          </span>
        </div>

        <div className="text-slate-500 flex items-center space-x-1">
          <span>Engineered for Student Career Readiness</span>
        </div>

      </div>
    </footer>
  );
}
