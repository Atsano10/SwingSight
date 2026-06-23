import { useState, useEffect } from 'react'

export default function Table(){
    const [signals, setSignals] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/api/scans') // replace swing-sight-five.vercel.app
            .then(res => res.json())
            .then(data => setSignals(data))
        // starts empty and fills it up (Fetches -> JSON -> Stores)
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
