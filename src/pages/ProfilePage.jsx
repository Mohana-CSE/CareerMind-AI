import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, rolesAPI, readinessAPI } from '../services/api';
import ReadinessGauge from '../components/ReadinessGauge';
import { 
  User, 
  Mail, 
  Target, 
  Award, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage({ setActiveTab }) {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, role, ready] = await Promise.all([
          resumeAPI.getCurrentResume().catch(() => null),
          rolesAPI.getRoleById(user?.target_role || 'java-fullstack').catch(() => null),
          readinessAPI.getScore(user?.target_role || 'java-fullstack').catch(() => null),
        ]);
        setResumeData(res);
        setRoleData(role);
        setReadinessData(ready);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.target_role]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading Candidate Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Student Candidate Profile</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Profile & Career Identity</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified credentials, active target role trajectory, and resume synchronization status.
        </p>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: User Badge (1 Col) */}
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0) || 'A'}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-700/60 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Role:</span>
              <span className="text-indigo-300 font-medium truncate max-w-[150px]">
                {roleData?.title || 'Java Full Stack'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Readiness Score:</span>
              <span className="text-white font-bold">{readinessData?.overall_score || 0}%</span>
            </div>
          </div>

          <div className="w-full pt-4">
            <button
              onClick={() => setActiveTab('target-role')}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Target Role</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Profile Trajectory & Resume Overview */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Target Role Track Card */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Active Target Role Track</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {roleData?.category || 'Software Engineering'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">{roleData?.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{roleData?.description}</p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {roleData?.core_technologies?.map((tech, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveTab('skill-gap')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
              >
                <span>Check Skill Gap Alignment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <span>Continue Roadmap Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Current Resume Snapshot Card */}
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Parsed Resume Details</span>
              </h3>
              <button
                onClick={() => setActiveTab('resume')}
                className="text-xs text-slate-300 hover:text-white bg-slate-700/60 px-3 py-1 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Re-upload Resume
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-1.5">Skills Extracted ({resumeData?.skills?.length || 0}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData?.skills?.slice(0, 10).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {s}
                    </span>
                  ))}
                  {(resumeData?.skills?.length || 0) > 10 && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      +{(resumeData?.skills?.length || 0) - 10} more
                    </span>
                  )}
                </div>
              </div>

              {resumeData?.education?.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block font-semibold mb-1">Education:</span>
                  <div className="text-white font-medium">{resumeData.education[0]?.degree}</div>
                  <div className="text-slate-500 text-[11px]">{resumeData.education[0]?.institution} ({resumeData.education[0]?.year})</div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
