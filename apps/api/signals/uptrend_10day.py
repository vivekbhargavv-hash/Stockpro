"""10-Day Uptrend: EMA10 slope positive for 5 days and price > EMA10."""
import pandas as pd
from signals.base import build_stock_record


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 20:
        return None
    close = df["Close"]
    ema10 = close.ewm(span=10, adjust=False).mean()

    price_above_ema = close.iloc[-1] > ema10.iloc[-1]
    # EMA10 must be higher each day for last 5 sessions
    ema_rising = all(ema10.iloc[-i - 1] > ema10.iloc[-i - 2] for i in range(5))

    if price_above_ema and ema_rising:
        return build_stock_record(ticker, df)
    return None
