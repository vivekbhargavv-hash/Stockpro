"""High Volatility: ATR(14) > 2× 30-day median ATR."""
import pandas as pd
import numpy as np
from signals.base import build_stock_record


def _atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high, low, close = df["High"], df["Low"], df["Close"]
    prev_close = close.shift(1)
    tr = pd.concat([
        high - low,
        (high - prev_close).abs(),
        (low - prev_close).abs(),
    ], axis=1).max(axis=1)
    return tr.rolling(period).mean()


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 45:
        return None
    atr = _atr(df).dropna()
    if len(atr) < 30:
        return None

    current_atr = atr.iloc[-1]
    median_atr = atr.iloc[-30:].median()

    if median_atr and current_atr >= median_atr * 2.0:
        return build_stock_record(ticker, df)
    return None
