"""EMA 20 Crossover: price crossed above EMA20 within last 3 sessions."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 25:
        return None
    close = df["Close"]
    ema20 = close.ewm(span=20, adjust=False).mean()

    for i in range(1, 4):
        was_below = close.iloc[-i - 1] < ema20.iloc[-i - 1]
        now_above = close.iloc[-i] > ema20.iloc[-i]
        if was_below and now_above:
            return build_stock_record(ticker, df)
    return None
