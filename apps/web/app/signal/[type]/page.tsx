"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { SignalDetail, StockRecord, SortKey, SortDir } from "@/lib/types";
import { StockCard, StockCardSkeleton } from "@/components/signal/StockCard";
import { SignalFilters } from "@/components/signal/SignalFilters";
import { formatRelativeTime, cn } from "@/lib/utils";
import { SIGNAL_COLORS } from "@/lib/constants";
import {
  TrendingUp, BarChart2, ArrowUpRight, Activity, Rocket,
  CalendarDays, Zap, CheckCircle, Waves, Award, RefreshCw,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  TrendingUp, BarChart2, ArrowUpRight, Activity, Rocket,
  CalendarDays, Zap, CheckCircle, Waves, Award, RefreshCw,
};

export default function SignalPage() {
  const { type } = useParams<{ type: string }>();
  const [signal, setSignal] = useState<SignalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("technical_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/signals/${type}`);
      if (!res.ok) throw new Error((await res.json()).detail ?? "Failed");
      setSignal(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load signal");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await fetch(`/api/signals/${type}/refresh`, { method: "POST" });
      // poll for updated data after 8s (background job running)
      await new Promise((r) => setTimeout(r, 8000));
      await load();
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => { load(); }, [type]);

  const sorted = useMemo(() => {
    if (!signal?.stocks) return [];
    return [...signal.stocks].sort((a: StockRecord, b: StockRecord) => {
      const va = (a[sortKey] as number) ?? 0;
      const vb = (b[sortKey] as number) ?? 0;
      return sortDir === "desc" ? vb - va : va - vb;
    });
  }, [signal, sortKey, sortDir]);

  const palette = signal ? SIGNAL_COLORS[signal.color] ?? SIGNAL_COLORS.indigo : SIGNAL_COLORS.indigo;
  const Icon = signal ? (ICONS[signal.icon] ?? TrendingUp) : TrendingUp;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + header */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={15} />
          Back
        </Link>

        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-72 bg-white/5 rounded animate-pulse" />
          </div>
        ) : signal ? (
          <div className="flex items-start gap-3">
            <div className={cn("p-2.5 rounded-xl mt-0.5", palette.bg)}>
              <Icon size={20} className={palette.text} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">{signal.label}</h1>
              <p className="text-sm text-secondary mt-1 leading-relaxed max-w-xl">
                {signal.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className={cn("badge", palette.bg, palette.text)}>
                  {signal.stocks_count} stocks
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Info size={11} />
                  Updated {formatRelativeTime(signal.computed_at)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-secondary">{error ?? "Signal not found"}</p>
            <p className="text-sm text-muted mt-1">
              Trigger a nightly compute run to populate signals.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      {signal && signal.stocks.length > 0 && (
        <SignalFilters
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastUpdated={signal.computed_at}
        />
      )}

      {/* Stock list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <StockCardSkeleton key={i} />)}
        </div>
      ) : sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((s) => <StockCard key={s.ticker} stock={s} />)}
        </div>
      ) : !error ? (
        <div className="card p-10 text-center">
          <p className="text-secondary font-medium">No stocks match this signal today</p>
          <p className="text-sm text-muted mt-1">Try refreshing or check back after market hours.</p>
          <button
            onClick={handleRefresh}
            className="btn-primary mt-4"
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing…" : "Refresh Now"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
