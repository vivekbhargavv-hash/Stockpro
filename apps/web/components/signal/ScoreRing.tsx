"use client";

import { scoreColor, scoreRing, cn } from "@/lib/utils";

interface Props {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 44 }: Props) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-white/5 dark:text-white/5"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={cn("score-ring transition-all duration-500", scoreRing(score))}
        />
      </svg>
      <span className={cn("absolute text-[10px] font-bold tabular-nums", scoreColor(score))}>
        {score}
      </span>
    </div>
  );
}
