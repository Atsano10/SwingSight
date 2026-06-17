import yfinance as yf
import pandas as pd
from backtestConfig import (
    watchlist, maShort, maLong, pullbackDays,
    accountBalance, riskPerTrade, minRewardRisk,
    tradeExpirationDays, startMonthsBack, endMonthsBack,
)


def _apply_indicators(df):
    df[f"ma{maShort}"] = df["Close"].rolling(window=maShort).mean()
    df[f"ma{maLong}"] = df["Close"].rolling(window=maLong).mean()
    return df


def _is_uptrend(df):
    latest = df.iloc[-1]
    return (
        latest["Close"] > latest[f"ma{maShort}"] and
        latest[f"ma{maShort}"] > latest[f"ma{maLong}"]
    )


def _is_pullback(df):
    recent = df["Close"].iloc[-pullbackDays:]
    return recent.iloc[-1] < recent.iloc[0]


def _calc_position_size(entry_price, stop_price):
    risk_amount = accountBalance * riskPerTrade
    risk_per_share = entry_price - stop_price
    if risk_per_share <= 0:
        return 0
    return round(risk_amount / risk_per_share, 2)


def _scan_at_date(bulk_data, scan_date, months_back):
    ideas = []
    for ticker in watchlist:
        try:
            if ticker not in bulk_data.columns.get_level_values(0):
                continue
            df = bulk_data[ticker].copy()
            df.dropna(inplace=True)
            df = df[df.index <= scan_date].copy()
            if df.empty or len(df) < maLong:
                continue
            df = _apply_indicators(df)
            df.dropna(inplace=True)
            if not _is_uptrend(df):
                continue
            if not _is_pullback(df):
                continue

            latest = df.iloc[-1]
            entry = round(float(latest["Close"]), 2)
            stop = round(float(df["Low"].iloc[-pullbackDays:].min()), 2)
            risk_per_share = entry - stop
            target = round(entry + (risk_per_share * minRewardRisk), 2)
            shares = _calc_position_size(entry, stop)

            ideas.append({
                "monthsBack": months_back,
                "ticker": ticker,
                "entryDate": str(latest.name.date()),
                "entry": entry,
                "stop": stop,
                "target": target,
                "shares": shares,
            })
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")
    return ideas


def _check_outcome(bulk_data, ticker, trade):
    df = bulk_data[ticker].copy()
    df.dropna(inplace=True)

    entry_date = pd.Timestamp(trade["entryDate"])
    future = df[df.index > entry_date].head(tradeExpirationDays)

    if future.empty:
        return {"exitDate": None, "exitPrice": None, "outcome": "OPEN", "profitLoss": 0}

    for date, candle in future.iterrows():
        if candle["Low"] <= trade["stop"]:
            exit_price = trade["stop"]
            outcome = "LOSS"
            break
        if candle["High"] >= trade["target"]:
            exit_price = trade["target"]
            outcome = "WIN"
            break
    else:
        if len(future) < tradeExpirationDays:
            return {"exitDate": None, "exitPrice": None, "outcome": "OPEN", "profitLoss": 0}
        last = future.iloc[-1]
        date = future.index[-1]
        exit_price = float(last["Close"])
        outcome = "EXPIRED"

    profit_loss = (exit_price - trade["entry"]) * trade["shares"]
    return {
        "exitDate": str(date.date()),
        "exitPrice": round(exit_price, 2),
        "outcome": outcome,
        "profitLoss": round(profit_loss, 2),
    }


def run_backtest():
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
        return []

    all_trades = []
    for months_back in range(startMonthsBack, endMonthsBack - 1, -1):
        scan_date = pd.Timestamp.today() - pd.DateOffset(months=months_back)
        print(f"Testing scan from {months_back} months back: {scan_date.date()}")
        ideas = _scan_at_date(bulk_data, scan_date, months_back)
        for trade in ideas:
            outcome = _check_outcome(bulk_data, trade["ticker"], trade)
            all_trades.append({**trade, **outcome})

    return all_trades


if __name__ == "__main__":
    results = run_backtest()
    if not results:
        print("No backtest results found.")
    else:
        df = pd.DataFrame(results)
        print(df.to_string(index=False))
        wins = len(df[df["outcome"] == "WIN"])
        losses = len(df[df["outcome"] == "LOSS"])
        expired = len(df[df["outcome"] == "EXPIRED"])
        open_t = len(df[df["outcome"] == "OPEN"])
        total_pl = round(df["profitLoss"].sum(), 2)
        print(f"\nBacktest summary")
        print(f"Wins: {wins}  Losses: {losses}  Expired: {expired}  Open: {open_t}")
        print(f"Total P/L: ${total_pl}")
