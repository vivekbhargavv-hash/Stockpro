"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { IndexQuote } from "@/lib/types";
import { cn } from "@/lib/utils";

const INDEX_LABELS: Record<string, string> = {
  SENSEX: "SENSEX",
  NIFTY_50: "NIFTY 50",
  NIFTY_BANK: "BANK NIFTY",
  NIFTY_IT: "NIFTY IT",
  NIFTY_MIDCAP: "MIDCAP 50",
};

function IndexChip({ quote }: { quote: IndexQuote }) {
  const up = (quote.change_pct ?? 0) >= 0;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-subtle surface shrink-0 min-w-[160px]">
      <div>
        <p className="text-xs font-medium text-muted uppercase tracking-wider">
          {INDEX_LABELS[quote.name] ?? quote.name}
        </p>
        <p className="text-sm font-semibold text-primary mt-0.5">
          {quote.price != null
            ? new Intl.NumberFormat("en-IN").format(quote.price)
            : "—"}
        </p>
      </div>
      {quote.change_pct != null && (
        <div className={cn("flex items-center gap-0.5 text-xs font-semibold ml-auto", up ? "text-gain" : "text-loss")}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? "+" : ""}{quote.change_pct.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

export function IndexTicker() {
  const [indices, setIndices] = useState<IndexQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/indices")
      .then((r) => r.json())
      .then((data) => {
        setIndices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 w-40 rounded-xl bg-white/5 animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
      {indices.map((q) => (
        <IndexChip key={q.name} quote={q} />
      ))}
    </div>
  );
}
