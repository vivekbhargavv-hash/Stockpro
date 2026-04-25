"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CHART_PERIODS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TradingViewChart } from "@/components/chart/TradingViewChart";
import { useState } from "react";

export default function StockPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const [period, setPeriod] = useState("6mo");

  // Period → TradingView interval mapping
  const tvInterval: Record<string, string> = {
    "1mo": "D", "3mo": "D", "6mo": "D", "1y": "W", "2y": "W",
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={15} />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-primary font-mono">{ticker}</h1>
          <p className="text-sm text-muted mt-0.5">NSE · India</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1.5">
        {CHART_PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
              period === p.value
                ? "bg-brand-500 text-white"
                : "surface border border-subtle text-secondary hover:border-brand-500/40"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* TradingView chart — has built-in NSE data */}
      <div className="card overflow-hidden">
        <TradingViewChart ticker={ticker} height={480} />
      </div>
    </div>
  );
}
