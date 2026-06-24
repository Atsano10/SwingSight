import { useState, useEffect } from 'react'

export default function Table(){
    const [signals, setSignals] = useState([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/scan-results`)
            .then(res => res.json())
            .then(data => {
                const today = new Date().toISOString().split('T')[0]
                setSignals(data.filter(s => s.date === today))
            })
    }, [])


    return(
        <>
            {signals.length === 0 ? (
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
