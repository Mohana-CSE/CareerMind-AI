import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { roadmapAPI } from '../services/api';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Code2, 
  HelpCircle, 
  FolderGit2, 
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RoadmapPage({ setActiveTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState({});

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const data = await roadmapAPI.getCurrentRoadmap(user?.target_role);
      setRoadmap(data);
      // Auto-expand all milestones
      const expandMap = {};
      data?.milestones?.forEach(m => {
        expandMap[m.id] = true;
      });
      setExpandedMilestones(expandMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [user?.target_role]);

  const toggleMilestoneExpand = (mId) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [mId]: !prev[mId]
    }));
  };

  const handleToggleTask = async (milestoneId, taskId, currentStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const updated = await roadmapAPI.updateTaskProgress(
        milestoneId,
        taskId,
        !currentStatus,
        user?.target_role
      );
      setRoadmap(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const updated = await roadmapAPI.regenerateRoadmap(user?.target_role);
      setRoadmap(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Synthesizing Adaptive Learning Roadmap...</p>
      </div>
    );
  }

  const milestones = roadmap?.milestones || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adaptive Progression System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personalized Roadmap: {roadmap?.role_title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Custom-calibrated learning sequence tailored to your exact resume skills. Completing tasks adapts priorities and updates your Career Readiness Score.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
          <span>Regenerate Roadmap</span>
        </button>
      </div>

      {/* Roadmap Progress Card */}
      <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 w-full md:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overall Roadmap Mastery
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-extrabold text-white">
              {roadmap?.overall_progress || 0}%
            </span>
            <span className="text-xs text-slate-400">
              ({roadmap?.completed_tasks || 0} of {roadmap?.total_tasks || 0} practice challenges completed)
            </span>
          </div>
        </div>

        <div className="w-full md:w-72 bg-slate-700 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${roadmap?.overall_progress || 0}%` }}
          />
        </div>
      </div>

      {/* Phased Milestones Timeline */}
      <div className="space-y-6">
        {milestones.map((milestone, idx) => {
          const isExpanded = !!expandedMilestones[milestone.id];
          const isHighPriority = milestone.priority.toLowerCase() === 'high';
          const isCompleted = milestone.completed;

          return (
            <div
              key={milestone.id}
              className={`rounded-2xl transition-all border ${
                isCompleted
                  ? 'bg-slate-800/40 border-emerald-500/30'
                  : 'bg-slate-800/70 border-slate-700/80 shadow-md'
              }`}
            >
              {/* Milestone Accordion Header */}
              <div 
                onClick={() => toggleMilestoneExpand(milestone.id)}
                className="p-6 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  {/* Phase Number Badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isHighPriority
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : milestone.phase_number}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isHighPriority
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {milestone.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>~{milestone.estimated_days} Days</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-1">
                      {milestone.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-white block">
                      {milestone.progress_percent}% Done
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {milestone.practice_tasks?.filter(t => t.completed).length} / {milestone.practice_tasks?.length} Tasks
                    </span>
                  </div>

                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Tasks Checklist Body */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-4">
                  
                  <div className="space-y-3">
                    {milestone.practice_tasks?.map((task) => {
                      const isTaskUpdating = updatingTaskId === task.id;
                      const taskIcon = task.type === 'coding' ? Code2 : task.type === 'project' ? FolderGit2 : HelpCircle;
                      const IconComponent = taskIcon;

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            task.completed
                              ? 'bg-slate-900/40 border-emerald-500/20 opacity-80'
                              : 'bg-slate-900/80 border-slate-700/60 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              onClick={() => handleToggleTask(milestone.id, task.id, task.completed)}
                              disabled={isTaskUpdating}
                              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                                  {task.title}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                                  {task.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          {/* Curated Resource Links */}
                          <div className="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
                            {task.resources?.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 flex items-center space-x-1 transition-colors"
                              >
                                <span>{res.title}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
