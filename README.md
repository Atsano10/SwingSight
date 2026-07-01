# SwingSight

A full-stack swing trading signal generator with automated scanning, backtesting, and portfolio tracking.

## Overview

SwingSight scans a watchlist of stocks using technical analysis to identify swing trade setups. It runs on a schedule, tracks trade outcomes automatically, and provides a web dashboard for monitoring signals and portfolio performance.

**Strategy logic:**
- Long entry when price > 50-day MA > 200-day MA (confirmed uptrend)
- Entry triggered after a short-term pullback without breaking recent support
- Position sizing based on configurable risk per trade
- Exits: target hit (WIN), stop hit (LOSS), or 21-day expiration (EXPIRED)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Recharts |
| Auth | Supabase (email/password + Google OAuth) |
| Backend | FastAPI, APScheduler, yfinance, pandas-ta |
| Database | SQLite (trade signals, config, balance history) |

---

## Features

- **Automated scanning** — runs every Monday & Wednesday at 4 PM ET via APScheduler
- **Backtesting engine** — simulates strategy over historical data with full P&L tracking
- **Trade resolution** — daily job at 5 PM ET that closes open trades and records WIN/LOSS/EXPIRED outcomes
- **Configurable strategy** — adjust account balance, risk %, reward:risk ratio, MA periods, and pullback window from the UI
- **Portfolio chart** — line chart of account balance over time
- **Protected routes** — all pages require authentication

---

## Project Structure

```
SwingSight/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── pages/             # Login, Signup, Signals, Analysis
│       ├── components/        # TradeTable, ConfigGraph, ProtectedRoute
│       ├── context/           # Supabase auth context
│       └── lib/               # Supabase client
└── swing_trader/              # Python backend
    ├── api/
    │   └── app.py             # FastAPI routes + scheduler
    ├── scanner.py             # Live signal detection
    ├── backtest.py            # Historical simulation engine
    ├── resolver.py            # Trade outcome resolution
    ├── config.py              # Live strategy parameters
    ├── backtestConfig.py      # Backtest parameters
    └── data/
        └── trades.db          # SQLite database
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project (for auth)

### Backend

```bash
cd swing_trader
pip install -r requirements.txt
uvicorn api.app:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

Then:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/scans` | Run a live scan and return today's signals |
| `GET` | `/api/scan-results` | Fetch all historical scan results |
| `POST` | `/api/resolve` | Trigger outcome resolution for pending trades |
| `GET` | `/api/backtests` | Run and return backtest results |
| `GET` | `/api/config` | Get current strategy configuration |
| `POST` | `/api/config` | Update strategy parameters |
| `GET` | `/api/balance` | Get balance history |
| `POST` | `/api/balance` | Record a new balance snapshot |

---

## Default Configuration

| Parameter | Value |
|---|---|
| Account balance | $2,000 |
| Risk per trade | 5% |
| Reward:risk ratio | 2.0 |
| Short MA | 50-day |
| Long MA | 200-day |
| Pullback window | 7 days |
| Trade expiration | 21 days |

The watchlist includes 22 large-cap and sector tickers: AAPL, MSFT, GOOGL, AMZN, META, NVDA, AMD, XOM, CVX, TSLA, DIS, NFLX, SPY, COST, QBTS, SNDK, AVGO, SNOW, TSM, NOK, VST.

---

## License 

MIT

---
