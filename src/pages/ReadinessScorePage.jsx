import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { readinessAPI } from '../services/api';
import ReadinessGauge from '../components/ReadinessGauge';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  Sparkles,
  BarChart2,
  TrendingUp
} from 'lucide-react';

export default function ReadinessScorePage({ setActiveTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    readinessAPI.getScore(user?.target_role)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user?.target_role]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Computing 5-Pillar Career Readiness Score...</p>
      </div>
    );
  }

  const breakdown = data?.breakdown || {
    technical_skills: 75,
    role_alignment: 70,
    dsa_problem_solving: 60,
    projects_portfolio: 80,
    certifications_prep: 65,
  };

  // Radar chart data structure
  const radarData = [
    { subject: 'Role Alignment', score: breakdown.role_alignment, fullMark: 100 },
    { subject: 'Technical Skills', score: breakdown.technical_skills, fullMark: 100 },
    { subject: 'Projects Portfolio', score: breakdown.projects_portfolio, fullMark: 100 },
    { subject: 'DSA & Algorithms', score: breakdown.dsa_problem_solving, fullMark: 100 },
    { subject: 'Certifications', score: breakdown.certifications_prep, fullMark: 100 },
  ];

  // Bar chart breakdown
  const barData = [
    { name: 'Role Match', value: breakdown.role_alignment, weight: '30%' },
    { name: 'Tech Skills', value: breakdown.technical_skills, weight: '25%' },
    { name: 'Projects', value: breakdown.projects_portfolio, weight: '20%' },
    { name: 'DSA & Code', value: breakdown.dsa_problem_solving, weight: '15%' },
    { name: 'Credentials', value: breakdown.certifications_prep, weight: '10%' },
  ];

  const barColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Factor Benchmark Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Readiness Score</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A holistic evaluation assessing your industry hireability across code competency, required role alignment, DSA, portfolio depth, and credentials.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2"
        >
          <span>Accelerate Score in Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Score & Radar Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Overall Gauge & Tier (1 Col) */}
        <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl flex flex-col items-center justify-center text-center">
          <ReadinessGauge score={data?.overall_score || 0} size={180} strokeWidth={14} />
          
          <div className="mt-6">
            <h2 className="text-xl font-bold text-white">{data?.tier}</h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
              Based on candidate profile comparison with modern technical screening rubrics.
            </p>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Readiness Index</span>
              <span className="text-lg font-extrabold text-indigo-400">
                {data?.overall_score}/100
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Target Category</span>
              <span className="text-xs font-bold text-slate-200 truncate block">
                Software Engineering
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Recharts Radar Visualization */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>5-Pillar Competency Radar</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Multilateral competency balance representation</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-300">
              Benchmark: 80%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name="Candidate Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Dimension Progress Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {barData.map((dim, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">{dim.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: {dim.weight}</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {dim.value}%
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${dim.value}%`, backgroundColor: barColors[idx] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths, Gaps, and Recommendations 3 Cols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Identified Strengths */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-emerald-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile Strengths</span>
          </h3>
          <ul className="space-y-2.5">
            {data?.strengths?.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Improvement Areas */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-rose-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Key Improvement Areas</span>
          </h3>
          <ul className="space-y-2.5">
            {data?.improvement_areas?.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Win Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-indigo-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>High-Impact Quick Wins</span>
          </h3>
          <ul className="space-y-2.5">
            {data?.quick_win_recommendations?.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
