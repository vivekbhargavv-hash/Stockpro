import pandas as pd
import numpy as np
from data.nse500 import get_display_name


def compute_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta.clip(upper=0)).rolling(period).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def compute_technical_score(df: pd.DataFrame) -> int:
    close = df["Close"]
    volume = df["Volume"]
    score = 0

    ema20 = close.ewm(span=20, adjust=False).mean().iloc[-1]
    ema50 = close.ewm(span=50, adjust=False).mean().iloc[-1]
    ema200 = close.ewm(span=200, adjust=False).mean().iloc[-1]
    last = close.iloc[-1]

    # Trend alignment (30 pts)
    if last > ema20:
        score += 10
    if ema20 > ema50:
        score += 10
    if ema50 > ema200:
        score += 10

    # RSI score (25 pts)
    rsi_series = compute_rsi(close)
    if not rsi_series.empty and not pd.isna(rsi_series.iloc[-1]):
        rsi = rsi_series.iloc[-1]
        if 55 <= rsi <= 70:
            score += 25
        elif 45 <= rsi < 55:
            score += 15
        elif 70 < rsi <= 80:
            score += 12
        elif 40 <= rsi < 45:
            score += 8

    # Volume strength (20 pts)
    avg_vol = volume.rolling(20).mean().iloc[-1]
    if avg_vol and avg_vol > 0:
        vol_ratio = volume.iloc[-1] / avg_vol
        if vol_ratio >= 2.0:
            score += 20
        elif vol_ratio >= 1.5:
            score += 14
        elif vol_ratio >= 1.0:
            score += 7

    # 5-day momentum (25 pts)
    if len(close) >= 6:
        ret_5d = (close.iloc[-1] - close.iloc[-6]) / close.iloc[-6]
        if ret_5d >= 0.07:
            score += 25
        elif ret_5d >= 0.04:
            score += 18
        elif ret_5d >= 0.01:
            score += 10
        elif ret_5d >= 0:
            score += 4

    return min(100, max(0, score))


def build_stock_record(ticker: str, df: pd.DataFrame) -> dict:
    close = df["Close"]
    volume = df["Volume"]
    last = close.iloc[-1]
    prev = close.iloc[-2]
    change_pct = ((last - prev) / prev) * 100

    ema20 = close.ewm(span=20, adjust=False).mean().iloc[-1]
    ema50 = close.ewm(span=50, adjust=False).mean().iloc[-1]
    ema200 = close.ewm(span=200, adjust=False).mean().iloc[-1]
    rsi = compute_rsi(close).iloc[-1]
    avg_vol = volume.rolling(20).mean().iloc[-1]
    score = compute_technical_score(df)

    display = get_display_name(ticker)

    return {
        "ticker": ticker.replace(".NS", ""),
        "name": display,
        "price": round(float(last), 2),
        "change_pct": round(float(change_pct), 2),
        "ema20": round(float(ema20), 2),
        "ema50": round(float(ema50), 2),
        "ema200": round(float(ema200), 2),
        "rsi": round(float(rsi), 1) if not pd.isna(rsi) else None,
        "volume": int(volume.iloc[-1]),
        "avg_volume": int(avg_vol) if not pd.isna(avg_vol) else None,
        "technical_score": score,
        "trend_aligned": bool(last > ema20 > ema50 > ema200),
    }
