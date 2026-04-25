"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Props {
  ticker: string;   // e.g. "RELIANCE"
  height?: number;
}

export function TradingViewChart({ ticker, height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `NSE:${ticker}`,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: dark ? "dark" : "light",
      style: "1",
      locale: "en",
      backgroundColor: dark ? "#080d1a" : "#ffffff",
      gridColor: dark ? "#1e2d4a" : "#e2e8f0",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      width: "100%",
      height,
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [ticker, dark, height]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height }}>
      <div className="tradingview-widget-container__widget" style={{ height }} />
    </div>
  );
}
