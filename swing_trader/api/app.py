import sys
import os
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
}

class ConfigUpdate(BaseModel):
    accountBalance: float
    riskPerTrade: float
    minRewardRisk: float
    maxOpenTrades: int
    pullbackDays: int

app = FastAPI(title="SwingSight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/scans")
def get_scans():
    return run_scan()


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
    return config