import React, { useEffect, useState } from 'react';
import { X, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { ICareerRole } from '../../server/models/types';
import { useAnalysis } from '../context/AnalysisContext';

interface CareerCompareModalProps {
  careerIds: string[];
  onClose: () => void;
}

export const CareerCompareModal: React.FC<CareerCompareModalProps> = ({ careerIds, onClose }) => {
  const { currentAnalysis, updateTargetSelection } = useAnalysis();
  const [careers, setCareers] = useState<ICareerRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [switchingTarget, setSwitchingTarget] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/careers');
        const data = await res.json();
        if (data.careers) {
          const selected = data.careers.filter((c: ICareerRole) =>
            careerIds.includes(c._id) || careerIds.includes(c.title)
          );
          setCareers(selected);
        }
      } catch (err) {
        console.error('Error fetching careers for compare:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, [careerIds]);

  if (careerIds.length === 0) return null;

  const handleSelectAsTarget = async (roleTitle: string) => {
    setSwitchingTarget(roleTitle);
    await updateTargetSelection(roleTitle, currentAnalysis?.targetCompany);
    setSwitchingTarget(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Independent 3-Career Benchmark
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each role independently calculates 0–100 match and readiness based strictly on your uploaded resume
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">Loading career benchmarks...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careers.map((career) => {
                // Find independent score from allCareerScores
                const careerScoreObj = currentAnalysis?.allCareerScores?.find(
                  c => c.roleId === career._id || c.title.toLowerCase() === career.title.toLowerCase()
                );

                const matchPct = careerScoreObj
                  ? careerScoreObj.matchPercentage
                  : (currentAnalysis?.topCareerMatch?.title === career.title
                      ? currentAnalysis.topCareerMatch.matchPercentage
                      : 0);

                const readinessPct = careerScoreObj
                  ? careerScoreObj.readinessScore
                  : (currentAnalysis?.topCareerMatch?.title === career.title
                      ? currentAnalysis.careerReadinessScore
                      : 0);

                const strong = careerScoreObj?.strongSkills || [];
                const gaps = careerScoreObj?.missingSkills || career.requiredSkills;

                const isTargetRole = currentAnalysis?.topCareerMatch?.title === career.title;

                return (
                  <div
                    key={career._id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-5 ${
                      isTargetRole
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div>
                      {/* Top banner */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {career.category}
                        </span>
                        {isTargetRole && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                            Active Target
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        {career.title}
                      </h3>

                      {/* Dual Scores (Match vs Readiness) */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Resume Match</span>
                          <div className="text-2xl font-black text-emerald-500">{matchPct}%</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Readiness</span>
                          <div className="text-2xl font-black text-teal-500">{readinessPct}%</div>
                        </div>
                      </div>

                      {/* Salary & Growth */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <DollarSign className="w-3.5 h-3.5" /> Avg Salary
                          </span>
                          <span className="font-semibold">{career.avgSalary}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <TrendingUp className="w-3.5 h-3.5" /> Market Growth
                          </span>
                          <span className="font-semibold text-teal-500">{career.growthRate}</span>
                        </div>
                      </div>

                      {/* Matching Skills */}
                      <div className="mb-4">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Strong Skills ({strong.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {strong.length > 0 ? (
                            strong.map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">None detected</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="mb-4">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Missing Skills ({gaps.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {gaps.length > 0 ? (
                            gaps.slice(0, 5).map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-emerald-500">Fully covered!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                      {isTargetRole ? (
                        <div className="py-2.5 text-center text-xs font-bold text-emerald-500 bg-emerald-500/10 rounded-xl">
                          Currently Active Target
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectAsTarget(career.title)}
                          disabled={Boolean(switchingTarget)}
                          className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>Set as My Target Career</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
