import sqlite3
import yfinance as yf
import pandas as pd

EXPIRATION_DAYS = 21

def resolve_scan_results(db_path):
    conn = sqlite3.connect(db_path)
    rows = conn.execute(
        "SELECT id, date, ticker, entry, stop, target, shares FROM scan_results WHERE outcome IS NULL"
    ).fetchall()
    conn.close()

    if not rows:
        return

    tickers = list(set(r[2] for r in rows))

    bulk_data = yf.download(
        tickers=tickers,
        period="3mo",
        interval="1d",
        group_by="ticker",
        progress=False,
        auto_adjust=False,
    )

    if bulk_data.empty:
        return

    conn = sqlite3.connect(db_path)
    for row in rows:
        id_, date, ticker, entry, stop, target, shares = row
        try:
            df = bulk_data[ticker].copy() if len(tickers) > 1 else bulk_data.copy()
            df.dropna(inplace=True)

            entry_date = pd.Timestamp(date)
            future = df[df.index > entry_date].head(EXPIRATION_DAYS)

            if future.empty:
                continue

            outcome = None
            exit_price = None
            exit_date = None

            for dt, candle in future.iterrows():
                if candle["Low"] <= stop:
                    exit_price = stop
                    exit_date = str(dt.date())
                    outcome = "LOSS"
                    break
                if candle["High"] >= target:
                    exit_price = target
                    exit_date = str(dt.date())
                    outcome = "WIN"
                    break
            else:
                if len(future) >= EXPIRATION_DAYS:
                    last = future.iloc[-1]
                    exit_price = round(float(last["Close"]), 2)
                    exit_date = str(future.index[-1].date())
                    outcome = "EXPIRED"

            if outcome:
                profit_loss = round((exit_price - entry) * shares, 2)
                conn.execute(
                    "UPDATE scan_results SET outcome=?, profit_loss=?, exit_date=?, exit_price=? WHERE id=?",
                    (outcome, profit_loss, exit_date, round(exit_price, 2), id_)
                )
        except Exception as e:
            print(f"Error resolving {ticker}: {e}")

    conn.commit()
    conn.close()
