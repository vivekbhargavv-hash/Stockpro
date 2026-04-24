"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { ChartData } from "@/lib/types";
import { CHART_PERIODS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { TradingViewChart } from "@/components/chart/TradingViewChart";

export default function StockPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const [period, setPeriod] = useState("6mo");
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/chart/${ticker}?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker, period]);

  const lastCandle = data?.candles.at(-1);
  const prevCandle = data?.candles.at(-2);
  const changePct =
    lastCandle && prevCandle
      ? ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100
      : null;
  const up = (changePct ?? 0) >= 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={15} />
          Back
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary font-mono">{ticker}</h1>
            <p className="text-sm text-muted mt-0.5">NSE · India</p>
          </div>
          {lastCandle && (
            <div className="text-right">
              <p className="text-2xl font-bold text-primary tabular-nums">
                {formatPrice(lastCandle.close)}
              </p>
              {changePct != null && (
                <div className={cn("flex items-center justify-end gap-1 text-sm font-semibold mt-0.5", up ? "text-gain" : "text-loss")}>
                  {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {up ? "+" : ""}{changePct.toFixed(2)}%
                </div>
              )}
            </div>
          )}
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

      {/* Chart */}
      <div className="card p-3">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-sm text-muted animate-pulse">Loading chart…</div>
          </div>
        ) : data && data.candles.length > 0 ? (
          <TradingViewChart candles={data.candles} height={400} />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted text-sm">
            No chart data available
          </div>
        )}
      </div>

      {/* OHLCV summary */}
      {lastCandle && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Open", value: formatPrice(lastCandle.open) },
            { label: "High", value: formatPrice(lastCandle.high) },
            { label: "Low", value: formatPrice(lastCandle.low) },
            { label: "Close", value: formatPrice(lastCandle.close) },
            {
              label: "Volume",
              value: new Intl.NumberFormat("en-IN").format(lastCandle.volume),
            },
          ].map(({ label, value }) => (
            <div key={label} className="card p-3">
              <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-primary mt-1 tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
