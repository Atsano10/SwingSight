import yfinance as yf
import pandas as pd

def _apply_indicators(df, config):
    df[f"ma{config['maShort']}"] = df["Close"].rolling(window=config['maShort']).mean()
    df[f"ma{config['maLong']}"] = df["Close"].rolling(window=config['maLong']).mean()
    return df


def _is_uptrend(df,config):
    latest = df.iloc[-1]
    return (
        latest["Close"] > latest[f"ma{config['maShort']}"] and
        latest[f"ma{config['maShort']}"] > latest[f"ma{config['maLong']}"]
    )


def _is_pullback(df, config):
    recent = df["Close"].iloc[-config['pullbackDays']:]
    return recent.iloc[-1] < recent.iloc[0]


def _calc_position_size(entry_price, stop_price, config):
    risk_amount = config['accountBalance'] * config['riskPerTrade']
    risk_per_share = entry_price - stop_price
    if risk_per_share <= 0:
        return 0
    return round(risk_amount / risk_per_share, 2)


def run_scan(config):
    print("Downloading data from Yahoo Finance...")
    bulk_data = yf.download(
        tickers=config['watchlist'],
        period="1y",
        interval="1d",
        group_by="ticker",
        progress=False,
        auto_adjust=False,
    )
    if bulk_data.empty:
        return []

    ideas = []
    for ticker in config['watchlist']:
        try:
            if ticker not in bulk_data.columns.get_level_values(0):
                continue
            df = bulk_data[ticker].copy()
            df.dropna(inplace=True)
            df = _apply_indicators(df,config)
            if df.empty or len(df) < config['maLong']:
                continue
            if not _is_uptrend(df,config):
                continue
            if not _is_pullback(df,config):
                continue

            latest = df.iloc[-1]
            entry = round(float(latest["Close"]), 2)
            stop = round(float(df["Low"].iloc[-config['pullbackDays']:].min()), 2)
            risk_per_share = entry - stop
            target = round(entry + (risk_per_share * config['minRewardRisk']), 2)
            shares = _calc_position_size(entry, stop, config)

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
    from config import watchlist, maShort, maLong, pullbackDays, accountBalance, riskPerTrade, minRewardRisk
    default_config = {
        "accountBalance": accountBalance,
        "riskPerTrade": riskPerTrade,
        "minRewardRisk": minRewardRisk,
        "pullbackDays": pullbackDays,
        "maShort": maShort,
        "maLong": maLong,
        "watchlist": watchlist,
    }
    results = run_scan(default_config)