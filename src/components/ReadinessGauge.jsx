import React from 'react';

export default function ReadinessGauge({ score = 0, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let colorClass = 'stroke-rose-500';
  let badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  let tierLabel = 'Early Foundation';

  if (clampedScore >= 80) {
    colorClass = 'stroke-emerald-400';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    tierLabel = 'Job-Ready';
  } else if (clampedScore >= 60) {
    colorClass = 'stroke-indigo-400';
    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    tierLabel = 'Developing';
  } else if (clampedScore >= 40) {
    colorClass = 'stroke-amber-400';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    tierLabel = 'Emerging';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {clampedScore}%
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Readiness
          </span>
        </div>
      </div>

      <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
        {tierLabel}
      </div>
    </div>
  );
}
