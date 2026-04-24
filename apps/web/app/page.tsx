import { Suspense } from "react";
import { IndexTicker } from "@/components/dashboard/IndexTicker";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SignalCard, SignalCardSkeleton } from "@/components/dashboard/SignalCard";
import { SignalMeta } from "@/lib/types";

async function SignalsGrid() {
  let signals: SignalMeta[] = [];
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/signals`,
      { cache: "no-store" }
    );
    if (res.ok) signals = await res.json();
  } catch {
    // backend not ready yet
  }

  if (signals.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 11 }).map((_, i) => (
          <SignalCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {signals.map((s) => (
        <SignalCard key={s.type} signal={s} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Index ticker strip */}
      <section>
        <IndexTicker />
      </section>

      {/* Search row */}
      <section>
        <SearchBar />
      </section>

      {/* Signals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-primary">Signals</h2>
          <span className="text-xs text-muted">NSE 500 · Daily</span>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 11 }).map((_, i) => (
                <SignalCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <SignalsGrid />
        </Suspense>
      </section>
    </div>
  );
}
