import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rolesAPI } from '../services/api';
import { 
  Target, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function TargetRolePage({ setActiveTab }) {
  const { user, updateTargetRole } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(user?.target_role || 'java-fullstack');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    rolesAPI.getAllRoles()
      .then((data) => setRoles(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectRole = async (roleId) => {
    setSelectedId(roleId);
    setSaving(true);
    try {
      await updateTargetRole(roleId);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading Target Job Roles Taxonomy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Target Role Alignment</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Choose Your Target Job Role</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Select the software engineering path you want to prepare for. CareerMind AI will calibrate its semantic skill gap analysis and adaptive roadmap specifically for this role.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('skill-gap')}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2"
        >
          <span>Analyze Gaps for Selected Role</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const isSelected = selectedId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.id)}
              className={`rounded-2xl p-6 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-md flex items-center space-x-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Active Role</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-400">{role.category}</span>
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Demand: {role.market_demand}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {role.description}
                </p>

                {/* Salary */}
                <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium mb-4 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                  <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Avg Compensation: <strong className="text-white">{role.average_salary}</strong></span>
                </div>

                {/* Core Tech Stack */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                    Core Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.core_technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-200 border border-slate-600 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Required Skills Count & Select Button */}
              <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {role.required_skills?.length} Core Competencies
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(role.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Role'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
