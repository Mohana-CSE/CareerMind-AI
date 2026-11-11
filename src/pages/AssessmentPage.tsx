import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Code2,
  ExternalLink,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';

interface QuestionOption {
  id: string;
  text: string;
  rationale?: string;
  score?: number;
}

interface Question {
  id: string;
  dimension: string;
  dimensionLabel?: string;
  question: string;
  context?: string;
  options: QuestionOption[];
}

interface DimensionBreakdownItem {
  dimension: string;
  label: string;
  score: number;
  selectedOptionText: string;
  rationale: string;
  status: 'STRONG' | 'COMPETITIVE' | 'DEVELOPING';
}

interface CompanyAssessmentResult {
  companyName: string;
  companyTier: string;
  companyMatchScore: number;
  grade: 'INTERVIEW READY' | 'COMPETITIVE' | 'NEEDS TARGETED PREPARATION';
  interviewStyle: string;
  hiringBarNote: string;
  dimensionBreakdown: DimensionBreakdownItem[];
  strengths: string[];
  gaps: string[];
  actionPlan: string[];
  coreLeetCodeConcept?: {
    concept: string;
    explanation: string;
    whyRequired: string;
  };
}

const TOP_COMPANIES = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  'Infosys',
  'TCS',
  'Zoho',
];

export const AssessmentPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { token } = useAuth();
  const { currentAnalysis } = useAnalysis();

  const [selectedCompany, setSelectedCompany] = useState<string>(
    currentAnalysis?.targetCompany || 'Google'
  );
  const [companyMetadata, setCompanyMetadata] = useState<{
    interviewStyle?: string;
    tier?: string;
    hiringBarNote?: string;
  }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<CompanyAssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with current analysis target company if present
  useEffect(() => {
    if (currentAnalysis?.targetCompany && !result) {
      setSelectedCompany(currentAnalysis.targetCompany);
    }
  }, [currentAnalysis?.targetCompany]);

  // Fetch company-tailored assessment questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/assessment/questions?company=${encodeURIComponent(selectedCompany)}`);
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
          setCompanyMetadata({
            interviewStyle: data.interviewStyle,
            tier: data.tier,
            hiringBarNote: data.hiringBarNote,
          });
        }
        setAnswers({});
        setCurrentIdx(0);
        setResult(null);
      } catch (err) {
        console.error('Error fetching assessment questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCompany]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          answers,
          company: selectedCompany,
          careerId: currentAnalysis?.targetCareerId,
        }),
      });
      const data = await res.json();
      if (data.success && data.companyResult) {
        setResult(data.companyResult);
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id]);

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Company Interview Standards Benchmark</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Company-Targeted Diagnostic Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Tailored to the exact interview culture, algorithmic expectations, and behavioral rubric of your target company.
        </p>
      </div>

      {/* Target Company Selector Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>Select Target Company for Assessment:</span>
          </div>
          {companyMetadata.tier && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 w-fit">
              {companyMetadata.tier} Standards
            </span>
          )}
        </div>

        {/* Company Pills */}
        <div className="flex flex-wrap gap-2">
          {TOP_COMPANIES.map(company => (
            <button
              key={company}
              onClick={() => {
                if (company !== selectedCompany) {
                  setSelectedCompany(company);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCompany.toLowerCase() === company.toLowerCase()
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {company}
            </button>
          ))}
        </div>

        {/* Company Interview Rubric Notice */}
        {companyMetadata.interviewStyle && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
            <strong className="text-emerald-500 dark:text-emerald-400">{selectedCompany} Interview Focus: </strong>
            {companyMetadata.interviewStyle}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">Loading {selectedCompany} interview diagnostic...</div>
      ) : result ? (
        /* RESULTS VIEW TAILORED FOR COMPANY */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Assessment Evaluation Complete
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.companyName} Interview Readiness Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated against {result.companyName}'s actual technical screening rubric
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Match Score</div>
                <div className="text-2xl font-black text-emerald-500">
                  {result.companyMatchScore}%
                </div>
              </div>
              <div className="text-center px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hiring Status</div>
                <div className="text-xs font-black text-teal-600 dark:text-teal-400 mt-1 uppercase">
                  {result.grade}
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Bar Note Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {result.companyName} Hiring Bar Requirement
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.hiringBarNote}
              </p>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Dimension Breakdown for {result.companyName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.dimensionBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'STRONG'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : item.status === 'COMPETITIVE'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.score}% • {item.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 80
                          ? 'bg-emerald-500'
                          : item.score >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">Rubric Feedback: </strong>
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Strengths for {result.companyName}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-4 list-disc leading-relaxed">
                {result.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Targeted Preparation Action Items
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-4 list-disc leading-relaxed">
                {result.actionPlan.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Action Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrentIdx(0);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake {result.companyName} Diagnostic
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('projects')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                View Production Blueprints
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>Practice {result.companyName} LeetCode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : currentQ ? (
        /* QUESTION CARD FOR SELECTED COMPANY */
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Progress bar and Context badge */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">Question {currentIdx + 1} of {questions.length}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-600 dark:text-slate-300">{currentQ.dimensionLabel || currentQ.dimension}</span>
              </div>
              <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
            </div>

            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Context tip */}
          {currentQ.context && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-indigo-500">{selectedCompany} Evaluation Context: </strong>
              {currentQ.context}
            </div>
          )}

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map(opt => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-400 dark:border-slate-600'
                    }`}
                  >
                    {opt.id.toUpperCase()}
                  </div>
                  <span className="leading-relaxed">{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? 'Evaluating with AI Rubric...' : `Submit ${selectedCompany} Diagnostic`}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
