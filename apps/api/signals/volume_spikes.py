"""Volume Spikes: today's volume > 2× 20-day average."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 22:
        return None
    volume = df["Volume"]
    avg_vol = volume.rolling(20).mean().iloc[-2]

    if avg_vol and volume.iloc[-1] >= avg_vol * 2.0:
        return build_stock_record(ticker, df)
    return None
