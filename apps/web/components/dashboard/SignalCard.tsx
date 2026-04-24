"use client";

import Link from "next/link";
import {
  TrendingUp, BarChart2, ArrowUpRight, Activity, Rocket,
  CalendarDays, Zap, CheckCircle, Waves, Award, RefreshCw,
} from "lucide-react";
import { SignalMeta } from "@/lib/types";
import { SIGNAL_COLORS } from "@/lib/constants";
import { formatRelativeTime, cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  TrendingUp, BarChart2, ArrowUpRight, Activity, Rocket,
  CalendarDays, Zap, CheckCircle, Waves, Award, RefreshCw,
};

interface Props {
  signal: SignalMeta;
}

export function SignalCard({ signal }: Props) {
  const Icon = ICONS[signal.icon] ?? TrendingUp;
  const palette = SIGNAL_COLORS[signal.color] ?? SIGNAL_COLORS.indigo;

  return (
    <Link
      href={`/signal/${signal.type}`}
      className={cn(
        "card-hover p-4 flex flex-col gap-3 group cursor-pointer",
        "animate-fade-in"
      )}
    >
      {/* Icon + label */}
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-xl", palette.bg)}>
          <Icon size={18} className={palette.text} />
        </div>
        <ArrowUpRight
          size={14}
          className="text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-1"
        />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-primary leading-tight">{signal.label}</p>
        <p className={cn("text-xs font-medium mt-1.5", palette.text)}>
          {signal.stocks_count > 0 ? `${signal.stocks_count} stocks` : "—"}
        </p>
      </div>

      {/* Last updated */}
      {signal.computed_at && (
        <p className="text-[10px] text-muted mt-auto">
          Updated {formatRelativeTime(signal.computed_at)}
        </p>
      )}
    </Link>
  );
}

export function SignalCardSkeleton() {
  return (
    <div className="card p-4 flex flex-col gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-white/5" />
      <div className="space-y-2">
        <div className="h-3.5 w-28 rounded bg-white/5" />
        <div className="h-3 w-16 rounded bg-white/5" />
      </div>
    </div>
  );
}
