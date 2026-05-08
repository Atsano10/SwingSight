import yfinance as yf
import pandas as pd
import pandas_ta as ta
from config import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk

# Download everything in watchlist at the same time
print("Downloading data from Yahoo Finance...")
bulk_data = yf.download(
    tickers=watchlist, 
    period="1y", 
    interval="1d", 
    group_by="ticker", 
    progress=False, 
    auto_adjust=False,
)
if bulk_data.empty:
    print("Failed to download data. Try again later.")
    exit()

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
        latest[f"ma{maShort}"] > latest[f"ma{maLong}"]
    )

#checks if the stock has been declining over the last 7 days.
def isPullback(df):
    recent = df["Close"].iloc[-pullbackDays:]
    return recent.iloc[-1] < recent.iloc[0]

#calculates a good buying shares size.
def calcPositionSize(entryPrice, stopPrice):
    riskAmount = accountBalance * riskPerTrade
    riskPerShare = entryPrice - stopPrice
    if riskPerShare <= 0:
        return 0
    shares  = riskAmount / riskPerShare
    return round(shares,2)

#scans watchlist for potential buys
# scans watchlist for potential buys
def scanStocks():
    ideas = []

    for ticker in watchlist:
        try:
            if ticker in bulk_data.columns.levels[0]:
                df = bulk_data[ticker].copy()
                df.dropna(inplace=True)
            else:
                continue
            
            # Apply your exact same logic
            df = applyIndicators(df)

            if df.empty or len(df) < maLong:
                continue
            if not isUptrend(df):
                continue
            if not isPullback(df):
                continue

            latest = df.iloc[-1]
            entryPrice = round(float(latest["Close"]),2)
            stopPrice = round(float(df["Low"].iloc[-pullbackDays:].min()), 2)
            riskPerShare = entryPrice - stopPrice
                
            targetPrice = round(entryPrice + (riskPerShare * minRewardRisk), 2)
            shares = calcPositionSize(entryPrice, stopPrice)

            ideas.append({
                "ticker": ticker,
                "entry": entryPrice,
                "stop": stopPrice,
                "target": targetPrice,
                "shares": shares,
            })
        
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")
            continue
    
    return pd.DataFrame(ideas)

results = scanStocks()
if results.empty:
    print("No trade ideas found today.")
else:
    print(results.to_string(index=False))