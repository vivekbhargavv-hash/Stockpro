"""
Run this script locally (not on Railway) to compute all 11 signals and push to Supabase.
Yahoo Finance works fine from residential IPs.

Usage:
    cd apps/api
    py -3.11 -m pip install -r requirements.txt
    py -3.11 seed_local.py
"""
import os
import json
import time
import asyncio
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

if "SUPABASE_URL" not in os.environ:
    os.environ["SUPABASE_URL"] = input("Supabase URL: ").strip()
if "SUPABASE_SERVICE_ROLE_KEY" not in os.environ:
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = input("Service Role Key: ").strip()

from signals.registry import SIGNALS
from routers.signals import compute_signal

CACHE_DIR = Path(__file__).parent / ".seed_cache"
CACHE_DIR.mkdir(exist_ok=True)


def upsert_via_rest(signal_type: str, stocks: list, count: int) -> None:
    url = os.environ["SUPABASE_URL"].rstrip("/")
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    payload = {
        "signal_type": signal_type,
        "stocks": stocks,
        "stocks_count": count,
        "computed_at": "now()",
    }
    last_err = None
    for attempt in range(6):
        try:
            with httpx.Client(timeout=60.0) as client:
                r = client.post(f"{url}/rest/v1/signals", json=payload, headers=headers)
                r.raise_for_status()
                return
        except Exception as e:
            last_err = e
            wait = min(2 ** attempt, 30)
            print(f" [retry {attempt+1} in {wait}s: {type(e).__name__}]", end="", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"Upsert failed after retries: {last_err}")


async def main():
    print(f"Computing signals for {len(SIGNALS)} signal types across NSE 500...\n")

    # Phase 1: compute all signals and cache to local JSON
    cached: dict[str, list] = {}
    for signal_type in SIGNALS:
        cache_file = CACHE_DIR / f"{signal_type}.json"
        if cache_file.exists():
            cached[signal_type] = json.loads(cache_file.read_text())
            print(f"  [cache] {signal_type}: {len(cached[signal_type])} stocks")
            continue
        print(f"  [compute] {signal_type}...", end=" ", flush=True)
        try:
            stocks = compute_signal(signal_type)
            cache_file.write_text(json.dumps(stocks))
            cached[signal_type] = stocks
            print(f"{len(stocks)} stocks (cached)")
        except Exception as e:
            print(f"COMPUTE ERROR: {e}")
            cached[signal_type] = []

    # Phase 2: push all to Supabase with retries
    print(f"\nPushing to Supabase...")
    for signal_type, stocks in cached.items():
        print(f"  [push] {signal_type} ({len(stocks)} stocks)...", end="", flush=True)
        try:
            upsert_via_rest(signal_type, stocks, len(stocks))
            print(" OK")
        except Exception as e:
            print(f" FAILED: {e}")

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
