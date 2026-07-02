import { useData } from '../context/dataContext.jsx'

export default function Table(){
    const { scanResults, loading } = useData()
    const today = new Date().toISOString().split('T')[0]
    const signals = scanResults.filter(s => s.date === today)

    return(
        <>
            {loading ? (
                <div className='loadingContainer'><div className='spinner' /></div>
            ) : signals.length === 0 ? (
                <div className='noSignals'>No trade signals found today</div>
            ) : (
                signals.map(signal => (
                    <div className='signal' key={signal.ticker}>
                        <div className='signalTicker'>
                            {signal.ticker}
                        </div>
                        <div className='signalField'>
                            <span className='signalLabel'>Entry</span>
                            <span className='signalValue'>{signal.entry}</span>
                        </div>
                        <div className='signalField'>
                            <span className='signalLabel'>Stop</span>
                            <span className='signalValue'>{signal.stop}</span>
                        </div>
                        <div className='signalField'>
                            <span className='signalLabel'>Target</span>
                            <span className='signalValue'>{signal.target}</span>
                        </div>
                        <div className='signalField'>
                            <span className='signalLabel'>Shares</span>
                            <span className='signalValue'>{signal.shares}</span>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
