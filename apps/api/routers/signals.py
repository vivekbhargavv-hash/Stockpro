import yfinance as yf
import pandas as pd
from fastapi import APIRouter, HTTPException, BackgroundTasks
from signals.registry import SIGNALS, SIGNAL_META
from data.nse500 import NSE_500
from data.yf_session import get_session
from db.supabase_client import upsert_signal, fetch_signal, fetch_all_signals
from cache.redis_client import get_cached, set_cached, invalidate_signal

router = APIRouter()

BATCH_SIZE = 50  # tickers per yfinance download call


def _download_batch(tickers: list[str]) -> dict[str, pd.DataFrame]:
    joined = " ".join(tickers)
    raw = yf.download(
        joined,
        period="1y",
        group_by="ticker",
        auto_adjust=True,
        threads=True,
        progress=False,
        session=get_session(),
    )
    result: dict[str, pd.DataFrame] = {}
    if len(tickers) == 1:
        t = tickers[0]
        if not raw.empty:
            result[t] = raw
    else:
        for t in tickers:
            try:
                df = raw[t].dropna(how="all")
                if not df.empty and len(df) >= 20:
                    result[t] = df
            except (KeyError, TypeError):
                pass
    return result


def compute_signal(signal_type: str) -> list[dict]:
    if signal_type not in SIGNALS:
        raise ValueError(f"Unknown signal: {signal_type}")
    signal_module = SIGNALS[signal_type]
    matched: list[dict] = []

    for i in range(0, len(NSE_500), BATCH_SIZE):
        batch = NSE_500[i: i + BATCH_SIZE]
        data = _download_batch(batch)
        for ticker, df in data.items():
            try:
                record = signal_module.run(ticker, df)
                if record:
                    matched.append(record)
            except Exception:
                pass

    matched.sort(key=lambda x: x["technical_score"], reverse=True)
    return matched


@router.get("/")
async def list_signals():
    db_rows = await fetch_all_signals()
    db_map = {r["signal_type"]: r for r in db_rows}

    result = []
    for key, meta in SIGNAL_META.items():
        row = db_map.get(key, {})
        result.append({
            "type": key,
            **meta,
            "stocks_count": row.get("stocks_count", 0),
            "computed_at": row.get("computed_at"),
        })
    return result


@router.get("/{signal_type}")
async def get_signal(signal_type: str):
    if signal_type not in SIGNALS:
        raise HTTPException(status_code=404, detail="Signal not found")

    cache_key = f"signal:{signal_type}"
    cached = await get_cached(cache_key)
    if cached:
        return cached

    db_row = await fetch_signal(signal_type)
    if db_row:
        payload = {**SIGNAL_META[signal_type], "type": signal_type, **db_row}
        await set_cached(cache_key, payload)
        return payload

    raise HTTPException(status_code=404, detail="Signal not yet computed. Trigger /cron/nightly first.")


@router.post("/{signal_type}/refresh")
async def refresh_signal(signal_type: str, background_tasks: BackgroundTasks):
    if signal_type not in SIGNALS:
        raise HTTPException(status_code=404, detail="Signal not found")

    async def _do_refresh():
        stocks = compute_signal(signal_type)
        await upsert_signal(signal_type, stocks, len(stocks))
        await invalidate_signal(signal_type)

    background_tasks.add_task(_do_refresh)
    return {"status": "refresh_started", "signal": signal_type}
