"use client";

import { ArrowUpDown, RefreshCw } from "lucide-react";
import { SortKey, SortDir } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string | null;
}

export function SignalFilters({ sortKey, sortDir, onSortChange, onRefresh, isRefreshing, lastUpdated }: Props) {
  function handleSortClick(key: SortKey) {
    if (key === sortKey) {
      onSortChange(key, sortDir === "desc" ? "asc" : "desc");
    } else {
      onSortChange(key, "desc");
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Sort options */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-muted flex items-center gap-1 mr-1">
          <ArrowUpDown size={12} /> Sort:
        </span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSortClick(opt.value as SortKey)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150",
              sortKey === opt.value
                ? "bg-brand-500 text-white"
                : "surface border border-subtle text-secondary hover:border-brand-500/40"
            )}
          >
            {opt.label}
            {sortKey === opt.value && (
              <span className="ml-1 opacity-70">{sortDir === "desc" ? "↓" : "↑"}</span>
            )}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-subtle surface text-xs font-medium text-secondary",
          "hover:border-brand-500/40 hover:text-brand-500 transition-all disabled:opacity-50"
        )}
      >
        <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
        {isRefreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
