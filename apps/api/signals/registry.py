from signals import (
    breakouts,
    volume_spikes,
    uptrend_10day,
    ema20_cross,
    breakout_30day,
    weekly_trending,
    strong_momentum,
    consistent_gainers,
    high_volatility,
    week52_high,
    week52_low_reversal,
)

SIGNALS: dict[str, object] = {
    "daily_breakouts": breakouts,
    "volume_spikes": volume_spikes,
    "uptrend_10day": uptrend_10day,
    "ema20": ema20_cross,
    "breakout_30day": breakout_30day,
    "weekly_trending": weekly_trending,
    "strong_momentum": strong_momentum,
    "consistent_gainers": consistent_gainers,
    "high_volatility": high_volatility,
    "week52_high": week52_high,
    "week52_low_reversal": week52_low_reversal,
}

SIGNAL_META: dict[str, dict] = {
    "daily_breakouts": {
        "label": "Daily Breakouts",
        "description": "Stocks where today's close broke above the 20-day high with 1.5× average volume confirmation — a classic momentum breakout signal.",
        "icon": "TrendingUp",
        "color": "indigo",
    },
    "volume_spikes": {
        "label": "Volume Spikes",
        "description": "Stocks experiencing unusual volume — today's volume is more than 2× the 20-day average, often signaling institutional interest.",
        "icon": "BarChart2",
        "color": "violet",
    },
    "uptrend_10day": {
        "label": "10-Day Uptrend",
        "description": "Stocks where the EMA10 has been rising for 5 consecutive sessions and price is above it — steady, consistent upward momentum.",
        "icon": "ArrowUpRight",
        "color": "emerald",
    },
    "ema20": {
        "label": "EMA 20",
        "description": "Stocks that crossed above their 20-day Exponential Moving Average within the last 3 sessions — a widely-watched bullish signal.",
        "icon": "Activity",
        "color": "blue",
    },
    "breakout_30day": {
        "label": "30-Day Breakout",
        "description": "Stocks printing a new 30-day closing high today — broader breakout signal indicating sustained strength over a month.",
        "icon": "Rocket",
        "color": "orange",
    },
    "weekly_trending": {
        "label": "Weekly Trending",
        "description": "Stocks that closed higher than they opened in 3 of the last 4 calendar weeks — consistent weekly buying pressure.",
        "icon": "CalendarDays",
        "color": "teal",
    },
    "strong_momentum": {
        "label": "Strong Momentum",
        "description": "Stocks with RSI above 60 and a recent MACD bullish crossover — combining trend strength with momentum confirmation.",
        "icon": "Zap",
        "color": "yellow",
    },
    "consistent_gainers": {
        "label": "Consistent Gainers",
        "description": "Stocks that closed in the green on 5 or more of the last 7 trading sessions — steady accumulation without sharp spikes.",
        "icon": "CheckCircle",
        "color": "green",
    },
    "high_volatility": {
        "label": "High Volatility",
        "description": "Stocks with ATR(14) more than 2× their 30-day median ATR — large intraday swings creating opportunities for active traders.",
        "icon": "Waves",
        "color": "red",
    },
    "week52_high": {
        "label": "52-Week High",
        "description": "Stocks trading within 3% of their 52-week closing high — near-breakout candidates with strong long-term momentum.",
        "icon": "Award",
        "color": "amber",
    },
    "week52_low_reversal": {
        "label": "52-Week Low Reversal",
        "description": "Stocks that bounced more than 15% off their 52-week low with RSI above 40 — potential mean-reversion candidates.",
        "icon": "RefreshCw",
        "color": "cyan",
    },
}
