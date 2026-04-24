# StockPro — Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.11+
- Railway account (free tier)
- Supabase account (free tier)
- Upstash Redis account (free tier)
- Vercel account (free tier)

---

## 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run: `supabase/migrations/001_initial.sql`
3. Copy your **Project URL** and **Service Role Key** from Settings → API

---

## 2. Upstash Redis

1. Create a database at [upstash.com](https://upstash.com)
2. Copy **REST URL** and **REST Token**

---

## 3. Backend (Railway)

```bash
cd apps/api
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, UPSTASH_* values, CRON_SECRET
```

Deploy to Railway:
1. Push this repo to GitHub
2. New Railway project → Deploy from GitHub → select `apps/api` folder
3. Set environment variables from your `.env`
4. Railway will detect the Dockerfile and deploy automatically
5. Copy the Railway public URL (e.g. `https://stock-pro-api.railway.app`)

---

## 4. Frontend (Vercel)

```bash
cd apps/web
cp .env.example .env.local
# fill in all values including API_BASE_URL from Railway
```

Deploy to Vercel:
1. Import GitHub repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web`
3. Add all environment variables from `.env.example`
4. Deploy

The `vercel.json` at root handles the cron job (runs nightly at 11 AM UTC = 4:30 PM IST on weekdays).

---

## 5. Initial Data Seed

After both services are live, trigger the first signal computation:

```bash
curl -X POST https://your-app.vercel.app/api/cron/nightly \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

This will take 3–5 minutes as it downloads 1 year of data for NSE 500 stocks and computes all 11 signals.

---

## Local Development

**Backend:**
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # fill in values
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm install
cp .env.example .env.local  # set API_BASE_URL=http://localhost:8000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Adding More NSE Tickers

Edit `apps/api/data/nse500.py` — add tickers as `SYMBOL.NS` (Yahoo Finance format).
Full NSE listed companies: https://www.nseindia.com/market-data/securities-available-for-trading

---

## PWA Icons

Generate icons with [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):
```bash
npx pwa-asset-generator logo.png public/ --manifest apps/web/public/manifest.json
```
