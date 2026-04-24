"""52-Week High: current price within 3% of 52-week high."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 50:
        return None
    close = df["Close"]
    high_52w = close.iloc[-252:].max() if len(close) >= 252 else close.max()
    last = close.iloc[-1]

    if last >= high_52w * 0.97:
        return build_stock_record(ticker, df)
    return None
