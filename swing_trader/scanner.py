import yfinance as yf
import pandas as pd
from config import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk


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


def run_scan():
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
        return []

    ideas = []
    for ticker in watchlist:
        try:
            if ticker not in bulk_data.columns.get_level_values(0):
                continue
            df = bulk_data[ticker].copy()
            df.dropna(inplace=True)
            df = _apply_indicators(df)
            if df.empty or len(df) < maLong:
                continue
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
                "ticker": ticker,
                "entry": entry,
                "stop": stop,
                "target": target,
                "shares": shares,
            })
        except Exception as e:
            print(f"Error scanning {ticker}: {e}")

    return ideas


if __name__ == "__main__":
    results = run_scan()
    if not results:
        print("No trade ideas found today.")
    else:
        print(pd.DataFrame(results).to_string(index=False))
