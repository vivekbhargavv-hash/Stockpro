"""52-Week Low Reversal: bounced >15% from 52-week low AND RSI > 40."""
import pandas as pd
from signals.base import build_stock_record, compute_rsi


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 50:
        return None
    close = df["Close"]
    low_52w = close.iloc[-252:].min() if len(close) >= 252 else close.min()
    last = close.iloc[-1]
    rsi = compute_rsi(close).iloc[-1]

    bounced = last >= low_52w * 1.15
    rsi_ok = not pd.isna(rsi) and rsi > 40

    if bounced and rsi_ok:
        return build_stock_record(ticker, df)
    return None
