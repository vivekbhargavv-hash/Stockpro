import json
import httpx
from config import settings

CACHE_TTL = 1800  # 30 minutes


async def _request(method: str, path: str, body: dict | None = None) -> dict | None:
    if not settings.upstash_redis_rest_url:
        return None
    headers = {"Authorization": f"Bearer {settings.upstash_redis_rest_token}"}
    url = f"{settings.upstash_redis_rest_url}{path}"
    async with httpx.AsyncClient() as client:
        if method == "GET":
            r = await client.get(url, headers=headers)
        else:
            r = await client.post(url, headers=headers, json=body)
    if r.status_code == 200:
        return r.json()
    return None


async def get_cached(key: str) -> dict | list | None:
    result = await _request("GET", f"/get/{key}")
    if result and result.get("result"):
        return json.loads(result["result"])
    return None


async def set_cached(key: str, value: dict | list, ttl: int = CACHE_TTL) -> None:
    payload = json.dumps(value)
    await _request("POST", f"/set/{key}/ex/{ttl}", {"value": payload})


async def invalidate(key: str) -> None:
    await _request("POST", f"/del/{key}", {})


async def invalidate_signal(signal_type: str) -> None:
    await invalidate(f"signal:{signal_type}")
