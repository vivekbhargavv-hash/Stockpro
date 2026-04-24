"""Consistent Gainers: positive daily return on 5+ of last 7 sessions."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 10:
        return None
    close = df["Close"]
    daily_returns = close.diff().iloc[-7:]
    positive_days = (daily_returns > 0).sum()

    if positive_days >= 5:
        return build_stock_record(ticker, df)
    return None
