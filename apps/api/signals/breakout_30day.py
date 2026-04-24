"""30-Day Breakout: today's close breaks above the previous 30-day high."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 32:
        return None
    close = df["Close"]
    high_30 = close.iloc[-31:-1].max()

    if close.iloc[-1] > high_30:
        return build_stock_record(ticker, df)
    return None
