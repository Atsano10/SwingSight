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
from pydantic import BaseModel

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
    return run_scan(config)


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
