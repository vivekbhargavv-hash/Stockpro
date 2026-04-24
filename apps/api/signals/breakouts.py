"""Daily Breakouts: price breaks above 20-day high with volume confirmation."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 25:
        return None
    close = df["Close"]
    volume = df["Volume"]

    rolling_high = close.rolling(20).max()
    prev_high = rolling_high.iloc[-2]
    last_close = close.iloc[-1]
    avg_vol = volume.rolling(20).mean().iloc[-1]

    broke_out = last_close > prev_high
    vol_confirmed = volume.iloc[-1] >= avg_vol * 1.5

    if broke_out and vol_confirmed:
        return build_stock_record(ticker, df)
    return None
