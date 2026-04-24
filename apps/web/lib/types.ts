export interface StockRecord {
  ticker: string;
  name: string;
  price: number;
  change_pct: number;
  ema20: number;
  ema50: number;
  ema200: number;
  rsi: number | null;
  volume: number;
  avg_volume: number | null;
  technical_score: number;
  trend_aligned: boolean;
}

export interface SignalMeta {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  stocks_count: number;
  computed_at: string | null;
}

export interface SignalDetail extends SignalMeta {
  stocks: StockRecord[];
}

export interface IndexQuote {
  name: string;
  symbol: string;
  price: number | null;
  change_pct: number | null;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  ticker: string;
  period: string;
  interval: string;
  candles: Candle[];
}

export type SortKey = "technical_score" | "change_pct" | "price" | "volume" | "rsi";
export type SortDir = "asc" | "desc";
