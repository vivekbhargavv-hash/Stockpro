from supabase import create_client, Client
from config import settings

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client


async def upsert_signal(signal_type: str, stocks: list[dict], count: int) -> None:
    client = get_client()
    client.table("signals").upsert({
        "signal_type": signal_type,
        "stocks": stocks,
        "stocks_count": count,
        "computed_at": "now()",
    }).execute()


async def fetch_signal(signal_type: str) -> dict | None:
    client = get_client()
    result = (
        client.table("signals")
        .select("*")
        .eq("signal_type", signal_type)
        .single()
        .execute()
    )
    return result.data


async def fetch_all_signals() -> list[dict]:
    client = get_client()
    result = (
        client.table("signals")
        .select("signal_type, stocks_count, computed_at")
        .execute()
    )
    return result.data or []
