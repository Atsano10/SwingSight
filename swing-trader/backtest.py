import yfinance as yf
import pandas as pd
import pandas_ta as ta
from backtestConfig import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk, monthsBack, tradeExpirationDays

# Download everything in watchlist at the same time
print("Downloading data from Yahoo Finance...")
bulk_data = yf.download(
    tickers=watchlist, 
    period="2y", 
    interval="1d", 
    group_by="ticker", 
    progress=False, 
    auto_adjust=False,
)
if bulk_data.empty:
    print("Failed to download data. Try again later.")
    exit()

# sets the backtesting time
pretendScanDate = pd.Timestamp.today() - pd.DateOffset(months=monthsBack)


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

# scans watchlist for potential buys
def scanStocks():
    ideas = []

    for ticker in watchlist:
        try:
            if ticker in bulk_data.columns.levels[0]:
                df = bulk_data[ticker].copy()
                df.dropna(inplace=True)
                df = df[df.index <= pretendScanDate].copy()
            else:
                continue
            
            if df.empty or len(df) < maLong:
                continue

            df = applyIndicators(df)
            df.dropna(inplace=True)

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
                "entryDate": latest.name.date(),
                "entry": entryPrice,
                "stop": stopPrice,
                "target": targetPrice,
                "shares": shares,
            })
        
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")
            continue
    
    return pd.DataFrame(ideas)

#sets the outcomes for each trade
def checkTradeOutcome(ticker, trade):
    df = bulk_data[ticker].copy()
    df.dropna(inplace=True)

    entryDate = pd.Timestamp(trade["entryDate"])
    future = df[df.index > entryDate].head(tradeExpirationDays)

    if future.empty:
        return {
            "exitDate": None,
            "exitPrice": None,
            "outcome": "NO DATA",
            "profitLoss": 0,
        }

    for date, candle in future.iterrows():
        hitStop = candle["Low"] <= trade["stop"]
        hitTarget = candle["High"] >= trade["target"]

        if hitStop:
            exitPrice = trade["stop"]
            outcome = "LOSS"
            break

        if hitTarget:
            exitPrice = trade["target"]
            outcome = "WIN"
            break
    else:
        lastCandle = future.iloc[-1]
        date = future.index[-1]
        exitPrice = float(lastCandle["Close"])
        outcome = "EXPIRED"

    profitLoss = (exitPrice - trade["entry"]) * trade["shares"]

    return {
        "exitDate": date.date(),
        "exitPrice": round(exitPrice, 2),
        "outcome": outcome,
        "profitLoss": round(profitLoss, 2),
    }


results = scanStocks()

if results.empty:
    print("No backtest trade ideas found.")
else:
    completedTrades = []

    for trade in results.to_dict("records"):
        outcome = checkTradeOutcome(trade["ticker"], trade)
        completedTrades.append({**trade, **outcome})

    results = pd.DataFrame(completedTrades)
    print(results.to_string(index=False))