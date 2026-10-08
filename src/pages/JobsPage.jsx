import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Sparkles,
  Building,
  Check
} from 'lucide-react';

export default function JobsPage({ setActiveTab }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [appliedJobId, setAppliedJobId] = useState(null);

  useEffect(() => {
    jobsAPI.getMatchedJobs(user?.target_role)
      .then((data) => setJobs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user?.target_role]);

  const handleApply = (jobId) => {
    setAppliedJobId(jobId);
    setTimeout(() => {
      setAppliedJobId(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Scanning Verified Job Openings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile-Calibrated Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Matched Job Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live technical roles ranked by their semantic alignment with your verified skills. Green pills indicate requirements satisfied; amber pills represent missing capabilities.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <span>Bridge Gaps via Roadmap</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const isApplied = appliedJobId === job.id;
          const matchColor = job.match_percentage >= 80 
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
            : job.match_percentage >= 60
            ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
            : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

          return (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-all shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${matchColor}`}>
                      {job.match_percentage}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1 text-slate-300 font-semibold">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{job.company}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.salary_range}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-[11px]">{job.experience_level}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 self-start ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Application Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>Apply with Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {job.description}
              </p>

              {/* Matched vs Missing Skills */}
              <div className="pt-3 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched */}
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 mb-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Skills You Satisfy ({job.matched_skills?.length || 0}):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matched_skills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div>
                  <span className="text-[11px] font-semibold text-rose-400 flex items-center space-x-1 mb-1.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>Missing Requirements ({job.missing_skills?.length || 0}):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.missing_skills?.length > 0 ? (
                      job.missing_skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                        >
                          ✕ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-emerald-400">100% matched requirements!</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
