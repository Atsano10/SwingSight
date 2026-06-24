import sys
import os
import sqlite3
import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "trades.db")

def load_config_from_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    conn.commit()
    rows = conn.execute("SELECT key, value FROM config").fetchall()
    conn.close()
    saved = {}
    for key, value in rows:
        try:
            saved[key] = int(value)
        except ValueError:
            try:
                saved[key] = float(value)
            except ValueError:
                saved[key] = value
    return saved



sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scanner import run_scan
from backtest import run_backtest
from resolver import resolve_scan_results
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler

config = {
    "accountBalance": 2000,
    "riskPerTrade": 0.05,
    "minRewardRisk": 2.0,
    "maxOpenTrades": 5,
    "pullbackDays": 7,
    "maShort": 50,
    "maLong": 200,

    "watchlist": [
        "AAPL", "MSFT", "GOOGL", "AMZN", "META",
        "NVDA", "AMD", "XOM", "CVX", "TSLA",
        "DIS", "NFLX","SPY", "COST", "QBTS",
        "SNDK", "AVGO","SNOW", "TSM", "NOK",
        "VST",
    ]
}

saved = load_config_from_db()
config.update(saved)

class ConfigUpdate(BaseModel):
    accountBalance: float
    riskPerTrade: float
    minRewardRisk: float
    maxOpenTrades: int
    pullbackDays: int
    maShort: int = 50
    maLong: int = 200

class BalanceEntry(BaseModel):
    balance: float

app = FastAPI(title="SwingSight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/scans")
def get_scans():
    signals = run_scan(config)
    if signals:
        date = datetime.date.today().isoformat()
        save_scan_results(signals, date)
    return signals

@app.get("/api/scan-results")
def get_scan_results():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT date, ticker, entry, stop, target, shares, outcome, profit_loss, exit_date, exit_price FROM scan_results ORDER BY date DESC, id ASC"
    ).fetchall()
    conn.close()
    return [
        {
            "date": r[0], "ticker": r[1], "entry": r[2], "stop": r[3],
            "target": r[4], "shares": r[5], "outcome": r[6],
            "profitLoss": r[7], "exitDate": r[8], "exitPrice": r[9]
        }
        for r in rows
    ]

@app.post("/api/resolve")
def trigger_resolve():
    resolve_scan_results(DB_PATH)
    return {"status": "done"}


@app.get("/api/backtests")
def get_backtests():
    return run_backtest()

@app.get("/api/config")
def get_config():
    return config

@app.post("/api/config")
def update_config(data: ConfigUpdate):
    global config
    config.update(data.model_dump())
    conn = sqlite3.connect(DB_PATH)
    for key, value in data.model_dump().items():
        conn.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", (key, str(value)))
    conn.commit()
    conn.close()
    return config

def init_balance_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS balance_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            balance REAL
        )
    """)
    conn.commit()
    conn.close()

init_balance_table()

def init_scan_results_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS scan_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            ticker TEXT,
            entry REAL,
            stop REAL,
            target REAL,
            shares REAL,
            outcome TEXT,
            profit_loss REAL,
            exit_date TEXT,
            exit_price REAL
        )
    """)
    for col, col_type in [("outcome", "TEXT"), ("profit_loss", "REAL"), ("exit_date", "TEXT"), ("exit_price", "REAL")]:
        try:
            conn.execute(f"ALTER TABLE scan_results ADD COLUMN {col} {col_type}")
        except Exception:
            pass
    conn.commit()
    conn.close()

init_scan_results_table()

def save_scan_results(signals, date):
    conn = sqlite3.connect(DB_PATH)
    existing = conn.execute("SELECT COUNT(*) FROM scan_results WHERE date = ?", (date,)).fetchone()[0]
    if existing == 0:
        for s in signals:
            conn.execute(
                "INSERT INTO scan_results (date, ticker, entry, stop, target, shares) VALUES (?, ?, ?, ?, ?, ?)",
                (date, s["ticker"], s["entry"], s["stop"], s["target"], s["shares"])
            )
        conn.commit()
    conn.close()

def scheduled_scan():
    date = datetime.date.today().isoformat()
    signals = run_scan(config)
    if signals:
        save_scan_results(signals, date)

scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_scan, 'cron', day_of_week='mon,wed', hour=16, minute=0)
scheduler.add_job(resolve_scan_results, 'cron', hour=17, minute=0, args=[DB_PATH])
scheduler.start()

@app.get("/api/balance")
def get_balance():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT date, balance FROM balance_history ORDER BY id").fetchall()
    conn.close()
    return [{"date": row[0], "balance": row[1]} for row in rows]

@app.post("/api/balance")
def add_balance(data: BalanceEntry):
    date = datetime.date.today().isoformat()
    conn = sqlite3.connect(DB_PATH)
    conn.execute("INSERT INTO balance_history (date, balance) VALUES (?, ?)", (date, data.balance))
    conn.commit()
    conn.close()
    return {"date": date, "balance": data.balance}
