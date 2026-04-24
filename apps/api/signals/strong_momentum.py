"""Strong Momentum: RSI > 60 AND MACD line crossed above signal line recently."""
import pandas as pd
from signals.base import build_stock_record, compute_rsi


def _macd(close: pd.Series) -> tuple[pd.Series, pd.Series]:
    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    macd_line = ema12 - ema26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    return macd_line, signal_line


def run(ticker: str, df: pd.DataFrame) -> dict | None:
    if len(df) < 35:
        return None
    close = df["Close"]
    rsi = compute_rsi(close).iloc[-1]
    if pd.isna(rsi) or rsi <= 60:
        return None

    macd_line, signal_line = _macd(close)
    # MACD crossed above signal in last 5 sessions
    for i in range(1, 6):
        if macd_line.iloc[-i - 1] < signal_line.iloc[-i - 1] and macd_line.iloc[-i] > signal_line.iloc[-i]:
            return build_stock_record(ticker, df)
    # Or MACD already above signal
    if macd_line.iloc[-1] > signal_line.iloc[-1] and rsi > 65:
        return build_stock_record(ticker, df)
    return None
