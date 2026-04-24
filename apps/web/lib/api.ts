import { SignalMeta, SignalDetail, IndexQuote, ChartData } from "./types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 0 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  signals: {
    list: () => get<SignalMeta[]>("/signals"),
    get: (type: string) => get<SignalDetail>(`/signals/${type}`),
    refresh: (type: string) =>
      fetch(`${BASE}/signals/${type}/refresh`, { method: "POST" }).then((r) => r.json()),
  },
  chart: {
    candles: (ticker: string, period = "6mo") =>
      get<ChartData>(`/chart/${ticker}?period=${period}`),
  },
  indices: {
    snapshot: () => get<IndexQuote[]>("/indices"),
  },
};
