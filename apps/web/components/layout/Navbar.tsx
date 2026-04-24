"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Search, BarChart2, SlidersHorizontal, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Insights", icon: TrendingUp },
  { href: "/screener", label: "Screener", icon: SlidersHorizontal },
  { href: "/compare", label: "Compare", icon: BarChart2 },
];

export function Navbar() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-subtle surface glass">
      <div className="mx-auto max-w-screen-xl px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </span>
          <span className="text-primary">
            Stock<span className="text-brand-500">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                path === href
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-secondary hover:text-primary hover:bg-white/5 dark:hover:bg-white/5"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            <Bell size={16} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-subtle surface glass pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all",
              path === href
                ? "text-brand-500"
                : "text-muted hover:text-secondary"
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <button className="flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium text-muted">
          <Search size={20} />
          Search
        </button>
      </div>
    </nav>
  );
}
