"use client";

import { Search, SlidersHorizontal, GitCompare } from "lucide-react";
import Link from "next/link";

export function SearchBar() {
  return (
    <div className="flex gap-2">
      {/* Search */}
      <button className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-subtle surface text-sm text-muted hover:border-brand-500/40 transition-colors text-left">
        <Search size={15} />
        <span>Search stocks…</span>
      </button>

      {/* Compare */}
      <Link
        href="/compare"
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-subtle surface text-sm font-medium text-secondary hover:border-brand-500/40 hover:text-brand-500 transition-colors"
      >
        <GitCompare size={15} />
        <span className="hidden sm:inline">Compare</span>
      </Link>

      {/* Screener */}
      <Link
        href="/screener"
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
      >
        <SlidersHorizontal size={15} />
        <span className="hidden sm:inline">Screener</span>
      </Link>
    </div>
  );
}
