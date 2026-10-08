import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { skillGapAPI, rolesAPI } from '../services/api';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Sparkles, 
  Info, 
  ArrowRight,
  Filter,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function SkillGapPage({ setActiveTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'matched', 'missing', 'high-priority'

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await skillGapAPI.analyze(user?.target_role);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [user?.target_role]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Running Deep Semantic Skill Gap Analysis...</p>
      </div>
    );
  }

  const matchedSkills = data?.matched_skills || [];
  const missingSkills = data?.missing_skills || [];
  const highPriorityMissing = missingSkills.filter(m => m.priority.toLowerCase() === 'high');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semantic Intelligence Powered</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Skill Gap Analysis: {data?.role_title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Semantic matching compares conceptual alignment instead of exact keywords, recognizing synonyms, frameworks, and architecture patterns.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2"
        >
          <span>View Adaptive Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Overall Match</span>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1">
            {data?.match_percentage}%
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${data?.match_percentage}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Required</span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {data?.total_required} <span className="text-sm font-normal text-slate-400">Competencies</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Benchmark standards for role</p>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Matched Skills</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">
            {matchedSkills.length}
          </div>
          <p className="text-xs text-emerald-400/80 mt-2">Satisfied through resume profile</p>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Missing Skill Gaps</span>
          <div className="text-3xl font-extrabold text-rose-400 mt-1">
            {missingSkills.length} <span className="text-sm font-normal text-slate-400">({highPriorityMissing.length} Urgent)</span>
          </div>
          <p className="text-xs text-rose-400/80 mt-2">Addressed in your roadmap</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
          }`}
        >
          All Requirements ({data?.total_required})
        </button>

        <button
          onClick={() => setActiveFilter('matched')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeFilter === 'matched'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Matched Skills ({matchedSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('missing')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeFilter === 'missing'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Missing Gaps ({missingSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('high-priority')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeFilter === 'high-priority'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>High Priority Gaps ({highPriorityMissing.length})</span>
        </button>
      </div>

      {/* Main Breakdown: Side-by-Side or Filtered Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Matched Skills */}
        {(activeFilter === 'all' || activeFilter === 'matched') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Skills You Already Have ({matchedSkills.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Validated via Semantic NLP</span>
            </div>

            <div className="space-y-3">
              {matchedSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/25 hover:border-emerald-500/40 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.skill_name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Matched from candidate skill: <strong className="text-emerald-300">"{item.user_skill_matched}"</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {Math.round(item.similarity_score * 100)}% Match
                      </span>
                    </div>
                  </div>

                  {/* AI Explanation Pill */}
                  <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Column: Missing Skills (Gaps) */}
        {(activeFilter === 'all' || activeFilter === 'missing' || activeFilter === 'high-priority') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>
                  Missing Skills to Master (
                  {activeFilter === 'high-priority' ? highPriorityMissing.length : missingSkills.length}
                  )
                </span>
              </h3>
              <span className="text-xs text-slate-400">Prioritized for Learning</span>
            </div>

            <div className="space-y-3">
              {(activeFilter === 'high-priority' ? highPriorityMissing : missingSkills).map((item, idx) => {
                const isHigh = item.priority.toLowerCase() === 'high';
                const badgeColor = isHigh
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{item.skill_name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeColor}`}>
                            {item.priority} Priority
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                          Category: {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Why this skill is important */}
                    <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                      <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Industry Importance: </strong>
                        {item.reason}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Candidate Resume Skills Drawer */}
      <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3">All Skills Identified on Your Profile</h3>
        <div className="flex flex-wrap gap-2">
          {data?.current_skills?.map((s, idx) => (
            <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
              {s}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
