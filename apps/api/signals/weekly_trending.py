"""Weekly Trending: weekly close > weekly open for 3 of last 4 weeks."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 30:
        return None

    weekly = df["Close"].resample("W").agg(["first", "last"])
    weekly = weekly.dropna()

    if len(weekly) < 4:
        return None

    last4 = weekly.iloc[-4:]
    bullish_weeks = (last4["last"] > last4["first"]).sum()

    if bullish_weeks >= 3:
        return build_stock_record(ticker, df)
    return None
