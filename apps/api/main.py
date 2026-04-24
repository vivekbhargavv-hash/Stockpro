from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import signals, chart, cron

app = FastAPI(title="Stock Pro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signals.router, prefix="/signals", tags=["signals"])
app.include_router(chart.router, prefix="/chart", tags=["chart"])
app.include_router(cron.router, prefix="/cron", tags=["cron"])


@app.get("/health")
async def health():
    return {"status": "ok"}
