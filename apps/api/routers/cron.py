from fastapi import APIRouter, Header, HTTPException
from config import settings
from signals.registry import SIGNALS
from routers.signals import compute_signal
from db.supabase_client import upsert_signal
from cache.redis_client import invalidate_signal

router = APIRouter()


@router.post("/nightly")
async def nightly_compute(authorization: str = Header(default="")):
    expected = f"Bearer {settings.cron_secret}"
    if settings.cron_secret and authorization != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")

    results = {}
    for signal_type in SIGNALS:
        try:
            stocks = compute_signal(signal_type)
            await upsert_signal(signal_type, stocks, len(stocks))
            await invalidate_signal(signal_type)
            results[signal_type] = len(stocks)
        except Exception as e:
            results[signal_type] = f"error: {e}"

    return {"status": "completed", "signals": results}
