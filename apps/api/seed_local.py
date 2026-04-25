"""
Run this script locally (not on Railway) to compute all 11 signals and push to Supabase.
Yahoo Finance works fine from residential IPs.

Usage:
    cd apps/api
    pip install -r requirements.txt
    python seed_local.py
"""
import os
import json
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Inline the env so we don't need pydantic-settings locally
os.environ.setdefault("SUPABASE_URL", input("Supabase URL: ") if "SUPABASE_URL" not in os.environ else os.environ["SUPABASE_URL"])
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", os.environ.get("SUPABASE_SERVICE_ROLE_KEY", ""))

from signals.registry import SIGNALS
from routers.signals import compute_signal
from db.supabase_client import upsert_signal


async def main():
    print(f"Computing signals for {len(SIGNALS)} signal types across NSE 500...\n")
    for signal_type in SIGNALS:
        print(f"  → {signal_type}...", end=" ", flush=True)
        try:
            stocks = compute_signal(signal_type)
            await upsert_signal(signal_type, stocks, len(stocks))
            print(f"{len(stocks)} stocks")
        except Exception as e:
            print(f"ERROR: {e}")
    print("\nDone. All signals pushed to Supabase.")


if __name__ == "__main__":
    asyncio.run(main())
