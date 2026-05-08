# Holds temporary account data for paper trade simulation.

accountBalance = 10000       
riskPerTrade = 0.05      # 1% max risk per trade 
minRewardRisk = 2.0      # 2:1 reward/risk ratio
maxOpenTrades = 5        # Max trades at once

watchlist = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "META",
    "NVDA", "AMD", "XOM", "CVX", "UNH",
    "JNJ", "PFE","TSLA", "F", "GM",
    "DIS", "NFLX","SPY", "COST", "QBTS",
    "SNDK", "AVGO","SNOW", "TSM", "NOK",
    "VST",
]

maShort = 50              # 50-day moving average
maLong = 200              # 200-day moving average
pullbackDays = 7          # Max days of pullback to consider