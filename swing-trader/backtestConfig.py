# Holds fake account data, for backtesting algorithm.

accountBalance = 10000       
riskPerTrade = 0.05      # 5% max risk per trade 
minRewardRisk = 2.0      # 2:1 reward/risk ratio
maxOpenTrades = 5        # Max trades at once

watchlist = [
    "NVDA", "TSLA", "COST", 
    "QBTS", "SNOW",  "NOK", 
    "VST",
]

maShort = 50              # 50-day moving average
maLong = 200              # 200-day moving average
pullbackDays = 7          # Max days of pullback to consider

monthsBack = 5            # How far before we check our data
tradeExpirationDays = 21  # After how long the trade expires