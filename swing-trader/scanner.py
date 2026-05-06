import yfinance as yf
import pandas as pd
from config import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk

def getData(ticker):
    df = yf.download(ticker, period = "1y", interval = "1d", progress = False)
    df.dropna(inplace = True)
    return df

def applyIndicators(df):
    df[f"ma{maShort}"] = df["Close"].rolling(window = maShort).mean()
    df[f"ma{maLong}"] = df["Close"].rolling(window = maLong).mean()