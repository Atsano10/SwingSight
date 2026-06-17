import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scanner import run_scan
from backtest import run_backtest

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
