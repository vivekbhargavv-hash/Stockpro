import logging
import sys
import traceback

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
log = logging.getLogger("stockpro")
log.info("Starting Stock Pro API")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Stock Pro API", version="1.0.0")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {"service": "stockpro-api", "status": "ok"}


# Lazily attach routers — isolated try/except so a single broken import cannot
# take down the whole service before /health is reachable.
try:
    from config import settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    log.info("CORS configured; origins=%s", settings.origins)
except Exception:
    log.error("CORS setup failed:\n%s", traceback.format_exc())

for mod_name, prefix, tag in [
    ("routers.signals", "/signals", "signals"),
    ("routers.chart", "/chart", "chart"),
    ("routers.cron", "/cron", "cron"),
]:
    try:
        module = __import__(mod_name, fromlist=["router"])
        app.include_router(module.router, prefix=prefix, tags=[tag])
        log.info("Loaded router: %s", mod_name)
    except Exception:
        log.error("Failed to load %s:\n%s", mod_name, traceback.format_exc())

log.info("Stock Pro API ready")
