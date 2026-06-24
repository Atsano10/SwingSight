import { useState, useEffect } from 'react'

export default function BackTesting(){
    const [analysis, setAnalysis] = useState([])
    const [scanResults, setScanResults] = useState([])
    const [activeTab, setActiveTab] = useState('backtests')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/backtests`)
            .then(res => res.json())
            .then(data => setAnalysis(data))
        fetch(`${import.meta.env.VITE_API_URL}/api/scan-results`)
            .then(res => res.json())
            .then(data => setScanResults(data))
    }, [])

    const groupedByDate = scanResults.reduce((acc, signal) => {
        if (!acc[signal.date]) acc[signal.date] = []
        acc[signal.date].push(signal)
        return acc
    }, {})

    const resolvedTrades = analysis.filter(t => t.outcome !== 'OPEN')

    const totalTrades = activeTab === 'live' ? scanResults.length : resolvedTrades.length
    const wins = activeTab === 'live' ? '--' : resolvedTrades.filter(t => t.outcome === 'WIN').length
    const losses = activeTab === 'live' ? '--' : resolvedTrades.filter(t => t.outcome === 'LOSS').length
    const totalPL = activeTab === 'live' ? '--' : resolvedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0).toFixed(2)

    return(
        <main>
            <div className='summary'>
                <div className='summaryCard totalTrades'>
                    <div className='summaryLabel'>{activeTab === 'live' ? 'Total Signals' : 'Total Trades'}</div>
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
                    <div className='summaryValue'>{activeTab === 'live' ? '--' : `$${totalPL}`}</div>
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

                {activeTab === 'live' ? (
                    Object.keys(groupedByDate).length === 0 ? (
                        <p className='noData'>No scan results yet</p>
                    ) : (
                        Object.entries(groupedByDate).map(([date, signals]) => (
                            <div key={date}>
                                <div className='scanDateHeader'>{date}</div>
                                {signals.map(signal => (
                                    <div className='analysis' key={signal.ticker + date}>
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
                                        <div className='analysisField'>
                                            <span className='analysisLabel'>P&L</span>
                                            <span className='analysisValue'>Pending</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )
                ) : resolvedTrades.map(trade => (
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
                            <span className={trade.outcome === 'WIN' ? 'analysisValue Win' : 'analysisValue Loss'}>{trade.outcome}</span>
                        </div>
                        <div className='analysisField'>
                            <span className='analysisLabel'>P&L</span>
                            <span className='analysisValue'>${trade.profitLoss}</span>
                        </div>
                    </div>
                ))}
                </div>
        </main>
    )
}
