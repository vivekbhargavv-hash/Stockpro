import yfinance as yf
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()


@router.get("/{ticker}")
async def get_chart(
    ticker: str,
    period: str = Query(default="6mo", regex="^(1mo|3mo|6mo|1y|2y)$"),
    interval: str = Query(default="1d", regex="^(1d|1wk)$"),
):
    ns_ticker = ticker if ticker.endswith(".NS") else f"{ticker}.NS"
    try:
        df = yf.download(
            ns_ticker,
            period=period,
            interval=interval,
            auto_adjust=True,
            progress=False,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Data fetch failed: {e}")

    if df.empty:
        raise HTTPException(status_code=404, detail="No data found for ticker")

    candles = []
    for ts, row in df.iterrows():
        try:
            candles.append({
                "time": int(ts.timestamp()),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"]),
            })
        except (TypeError, ValueError):
            pass

    return {"ticker": ticker, "period": period, "interval": interval, "candles": candles}


@router.get("/quote/{ticker}")
async def get_quote(ticker: str):
    ns_ticker = ticker if ticker.endswith(".NS") else f"{ticker}.NS"
    try:
        info = yf.Ticker(ns_ticker).fast_info
        return {
            "ticker": ticker,
            "price": round(float(info.last_price), 2),
            "prev_close": round(float(info.previous_close), 2),
            "change_pct": round((info.last_price - info.previous_close) / info.previous_close * 100, 2),
            "market_cap": int(info.market_cap) if info.market_cap else None,
            "volume": int(info.three_month_average_volume) if info.three_month_average_volume else None,
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/indices/snapshot")
async def indices_snapshot():
    symbols = {
        "SENSEX": "^BSESN",
        "NIFTY_50": "^NSEI",
        "NIFTY_BANK": "^NSEBANK",
        "NIFTY_IT": "^CNXIT",
        "NIFTY_MIDCAP": "^NSEMDCP50",
    }
    result = []
    for name, sym in symbols.items():
        try:
            info = yf.Ticker(sym).fast_info
            prev = info.previous_close
            last = info.last_price
            result.append({
                "name": name,
                "symbol": sym,
                "price": round(float(last), 2),
                "change_pct": round((last - prev) / prev * 100, 2),
            })
        except Exception:
            result.append({"name": name, "symbol": sym, "price": None, "change_pct": None})
    return result
