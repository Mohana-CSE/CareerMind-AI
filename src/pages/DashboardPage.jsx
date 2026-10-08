import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  readinessAPI, 
  skillGapAPI, 
  roadmapAPI, 
  jobsAPI, 
  rolesAPI 
} from '../services/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ArrowRight, 
  Target, 
  BookOpen, 
  Briefcase, 
  Check,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);
  const [togglingTask, setTogglingTask] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const roleId = user?.target_role || 'java-fullstack';
      const [readinessRes, skillGapRes, roadmapRes, jobsRes, roleRes] = await Promise.all([
        readinessAPI.getScore(roleId).catch(() => null),
        skillGapAPI.analyze(roleId).catch(() => null),
        roadmapAPI.getCurrentRoadmap(roleId).catch(() => null),
        jobsAPI.getMatchedJobs(roleId).catch(() => []),
        rolesAPI.getRoleById(roleId).catch(() => null),
      ]);

      setReadiness(readinessRes);
      setSkillGap(skillGapRes);
      setRoadmap(roadmapRes);
      setJobs(jobsRes || []);
      setCurrentRole(roleRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.target_role]);

  // Find next incomplete task
  let currentTask = null;
  let currentMilestone = null;
  if (roadmap?.milestones) {
    for (const m of roadmap.milestones) {
      const task = m.practice_tasks?.find(t => !t.completed);
      if (task) {
        currentTask = task;
        currentMilestone = m;
        break;
      }
    }
  }

  const handleToggleTask = async (milestoneId, taskId, currentStatus) => {
    setTogglingTask(true);
    try {
      const roleId = user?.target_role || 'java-fullstack';
      await roadmapAPI.updateTaskProgress(milestoneId, taskId, !currentStatus, roleId);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  const roleTitle = currentRole?.title || 'Java Full Stack Developer';
  const readinessScore = readiness?.overall_score || 0;
  const matchedCount = skillGap?.matched_count || 0;
  const totalRequired = skillGap?.total_required || 0;
  const missingCount = skillGap?.missing_count || 0;
  const highPriorityMissing = skillGap?.missing_skills?.filter(m => m.priority.toLowerCase() === 'high') || [];
  const roadmapProgress = roadmap?.overall_progress || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* 1. Clean Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hi, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Targeting: <strong className="text-indigo-400 font-semibold">{roleTitle}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('target-role')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1"
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Update Resume</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards (Clean, readable, un-cluttered) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Career Readiness */}
        <div 
          onClick={() => setActiveTab('readiness')}
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Career Readiness</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
              {readiness?.tier ? readiness.tier.split(' ')[0] : 'Ready'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {readinessScore}%
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Card 2: Skills Matched */}
        <div 
          onClick={() => setActiveTab('skill-gap')}
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Skills Matched</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {matchedCount} <span className="text-xs font-normal text-slate-400">/ {totalRequired}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {skillGap?.match_percentage || 0}% required match
          </p>
        </div>

        {/* Card 3: Skills Missing */}
        <div 
          onClick={() => setActiveTab('skill-gap')}
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-rose-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Skills Missing</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {missingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {highPriorityMissing.length} high-priority gaps
          </p>
        </div>

        {/* Card 4: Roadmap Progress */}
        <div 
          onClick={() => setActiveTab('roadmap')}
          className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Roadmap Progress</span>
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            {roadmapProgress}%
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${roadmapProgress}%` }}
            />
          </div>
        </div>

      </div>

      {/* 3. Main 2-Column Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Current Task & High Priority Gaps */}
        <div className="space-y-6">
          
          {/* Current Learning Task */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>Next Learning Task</span>
              </span>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-0.5"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {currentTask && currentMilestone ? (
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {currentTask.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-medium">
                    {currentTask.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentTask.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Focus: <strong className="text-slate-300">{currentMilestone.skill_focus}</strong>
                  </span>
                  
                  <button
                    onClick={() => handleToggleTask(currentMilestone.id, currentTask.id, false)}
                    disabled={togglingTask}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{togglingTask ? 'Saving...' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-emerald-400 flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All active roadmap tasks completed! Great job.</span>
              </div>
            )}
          </div>

          {/* High Priority Skills Gaps */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>High-Priority Skills</span>
              </span>
              <button
                onClick={() => setActiveTab('skill-gap')}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-0.5"
              >
                <span>All Gaps</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {highPriorityMissing.length > 0 ? (
                highPriorityMissing.slice(0, 3).map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{item.skill_name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.reason}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      High
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-3 text-center">
                  No high priority gaps! Your skills match well.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Column 2: Recommended Jobs */}
        <div className="space-y-6">
          
          {/* Recommended Jobs */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recommended Jobs</span>
              </span>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-0.5"
              >
                <span>View All ({jobs.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {jobs.slice(0, 3).map((job) => (
                <div 
                  key={job.id}
                  onClick={() => setActiveTab('jobs')}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[220px]">
                      {job.title}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.match_percentage}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{job.company} • {job.location.split(',')[0]}</span>
                    <span className="text-slate-300 font-medium">{job.salary_range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/80 flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveTab('skill-gap')}
              className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700 text-center transition-colors"
            >
              Skill Gaps
            </button>
            <button
              onClick={() => setActiveTab('readiness')}
              className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700 text-center transition-colors"
            >
              Readiness Score
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium text-center transition-colors shadow-sm"
            >
              Adaptive Roadmap
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
