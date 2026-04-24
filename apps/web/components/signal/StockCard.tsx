"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { StockRecord } from "@/lib/types";
import { formatPrice, formatVolume, cn } from "@/lib/utils";
import { ScoreRing } from "./ScoreRing";

interface Props {
  stock: StockRecord;
}

function Indicator({ label, value, highlight }: { label: string; value: string; highlight?: "green" | "red" | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-xs font-semibold tabular-nums",
        highlight === "green" ? "text-gain" : highlight === "red" ? "text-loss" : "text-primary"
      )}>
        {value}
      </span>
    </div>
  );
}

export function StockCard({ stock }: Props) {
  const up = stock.change_pct >= 0;

  return (
    <div className="card-hover p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        {/* Score ring */}
        <ScoreRing score={stock.technical_score} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary truncate">{stock.name}</p>
              <p className="text-xs text-muted font-mono mt-0.5">{stock.ticker}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-primary tabular-nums">
                {formatPrice(stock.price)}
              </p>
              <div className={cn("flex items-center justify-end gap-0.5 text-xs font-semibold mt-0.5", up ? "text-gain" : "text-loss")}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {up ? "+" : ""}{stock.change_pct.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Trend condition badge */}
          <div className="flex items-center gap-1 mt-2">
            {stock.trend_aligned ? (
              <span className="badge bg-gain/10 text-gain">
                <CheckCircle2 size={10} /> Trend Aligned
              </span>
            ) : (
              <span className="badge bg-white/5 text-muted">
                <XCircle size={10} /> Mixed Trend
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Indicators row */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-subtle">
        <Indicator
          label="EMA 20"
          value={`₹${stock.ema20.toLocaleString("en-IN")}`}
          highlight={stock.price > stock.ema20 ? "green" : "red"}
        />
        <Indicator
          label="EMA 50"
          value={`₹${stock.ema50.toLocaleString("en-IN")}`}
          highlight={stock.ema20 > stock.ema50 ? "green" : "red"}
        />
        <Indicator
          label="RSI"
          value={stock.rsi != null ? stock.rsi.toFixed(1) : "—"}
          highlight={
            stock.rsi == null ? null
              : stock.rsi > 70 ? "red"
              : stock.rsi > 55 ? "green"
              : null
          }
        />
        <Indicator
          label="Volume"
          value={formatVolume(stock.volume)}
          highlight={
            stock.avg_volume && stock.volume > stock.avg_volume * 1.5 ? "green" : null
          }
        />
      </div>

      {/* View chart */}
      <Link
        href={`/stock/${stock.ticker}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-brand-500 hover:bg-brand-500/10 transition-colors border border-brand-500/20"
      >
        View Chart
        <ChevronRight size={13} />
      </Link>
    </div>
  );
}

export function StockCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-3 w-12 bg-white/5 rounded ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-subtle">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-10 bg-white/5 rounded" />
            <div className="h-3 w-14 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
