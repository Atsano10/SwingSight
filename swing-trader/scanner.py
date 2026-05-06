import yfinance as yf
import pandas as pd
from config import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk

#downloads data from given stock
def getData(ticker):
    df = yf.download(ticker, period = "1y", interval = "1d", progress = False)
    df.dropna(inplace = True)
    return df

#adds moving average columns 
def applyIndicators(df):
    df[f"ma{maShort}"] = df["Close"].rolling(window = maShort).mean()
    df[f"ma{maLong}"] = df["Close"].rolling(window = maLong).mean()
    return df

#checks if the most recent day is above the 50 and 200 day moving average
def isUptrend(df):
    latest = df.iloc[-1]
    return(
        latest["Close"] > latest[f"ma{maShort}"] and
        latest["Close"] > latest[f"ma{maLong}"]
    )

