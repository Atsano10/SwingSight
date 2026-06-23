import { useState, useEffect } from "react"

export default function BackTesting(){
    const [analysis, setAnalysis] = useState([])
    const [signals, setSignals] = useState([])
    const [activeTab, setActiveTab] = useState('backtests')

    useEffect(() => {
        fetch('http://localhost:8000/api/backtests')
            .then(res => res.json())
            .then(data => setAnalysis(data))
        fetch('http://localhost:8000/api/scans')
            .then(res => res.json())
            .then(data => setSignals(data))
    }, [])

    const data = activeTab === 'backtests' ? analysis : signals // decides on which list to note on based on the tab
    const totalTrades = data.length // counts items
    const wins = data.filter(t => t.outcome === 'WIN').length // filters for only 'WIN', then counts
    const losses = data.filter(t => t.outcome === 'LOSS').length // filters for only 'LOSS', then counts
    const totalPL = data.reduce((sum, t) => sum + (t.profitLoss || 0), 0).toFixed(2) //Adds all the profit losses and rounds

    return(
        <main>
            <div className='summary'>
                <div className='summaryCard totalTrades'>
                    <div className='summaryLabel'>Total Trades</div>
                    <div className='summaryValue'>{totalTrades}</div>
                </div>
                <div className='summaryCard wins'>
                    <div className='summaryLabel'>Wins</div>
                    <div className='summaryValue'>{wins}</div>
                </div>
                <div className='summaryCard losses'>
                    <div className='summaryLabel'>Losses</div>
                    <div className='summaryValue'>{losses}</div>
                </div>
                <div className='summaryCard pnl'>
                    <div className='summaryLabel'>Total P&L</div>
                    <div className='summaryValue'>${totalPL}</div>
                </div>
            </div>

            <div className='analysisContainer'>
                <div className='tabBar'>
                    <button
                        className={`tabButton ${activeTab === 'backtests' ? 'tabActive' : ''}`}
                        onClick={() => setActiveTab('backtests')}
                    >
                        Backtests
                    </button>
                    <button
                        className={`tabButton ${activeTab === 'live' ? 'tabActive' : ''}`}
                        onClick={() => setActiveTab('live')}
                    >
                        Live Results
                    </button>
                </div>

                {activeTab === 'backtests' ? (
                    analysis.map(trade => (
                        <div className='analysis' key={trade.ticker + trade.entryDate}>
                            <div className='analysisField'>
                                <span className='analysisTicker'>{trade.ticker}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Entry Date</span>
                                <span className='analysisValue'>{trade.entryDate}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Entry</span>
                                <span className='analysisValue'>${trade.entry}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Stop</span>
                                <span className='analysisValue'>${trade.stop}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Target</span>
                                <span className='analysisValue'>${trade.target}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Shares</span>
                                <span className='analysisValue'>{trade.shares}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Exit Date</span>
                                <span className='analysisValue'>{trade.exitDate}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Exit Price</span>
                                <span className='analysisValue'>${trade.exitPrice}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>Outcome</span>
                                <span className='analysisValue'>{trade.outcome}</span>
                            </div>
                            <div className='analysisField'>
                                <span className='analysisLabel'>P&L</span>
                                <span className='analysisValue'>${trade.profitLoss}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    signals.length === 0 ? (
                        <p className='noData'>No live signals today</p>
                    ) : (
                        signals.map(signal => (
                            <div className='analysis' key={signal.ticker}>
                                <div className='analysisField'>
                                    <span className='analysisTicker'>{signal.ticker}</span>
                                </div>
                                <div className='analysisField'>
                                    <span className='analysisLabel'>Entry</span>
                                    <span className='analysisValue'>${signal.entry}</span>
                                </div>
                                <div className='analysisField'>
                                    <span className='analysisLabel'>Stop</span>
                                    <span className='analysisValue'>${signal.stop}</span>
                                </div>
                                <div className='analysisField'>
                                    <span className='analysisLabel'>Target</span>
                                    <span className='analysisValue'>${signal.target}</span>
                                </div>
                                <div className='analysisField'>
                                    <span className='analysisLabel'>Shares</span>
                                    <span className='analysisValue'>{signal.shares}</span>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </main>
    )
}
