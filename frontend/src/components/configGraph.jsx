import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

export default function Graph(){
    const [settings, setSettings] = useState(false)
    const [balanceHistory, setBalanceHistory] = useState([])

    const [config, setConfig] = useState({
        accountBalance: 2000,
        riskPerTrade: 0.05,
        minRewardRisk: 2.0,
        maxOpenTrades: 5,
        pullbackDays: 7,
        maShort: 20,
        maLong: 50
    })

    const saveConfig = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/config`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(() => {
            fetch(`${import.meta.env.VITE_API_URL}/api/balance`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ balance: config.accountBalance })
            })
            .then(res => res.json())
            .then(entry => {
                setBalanceHistory(prev => [...prev, entry])
                setSettings(false)
            })
        })
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/config`)
            .then(res => res.json())
            .then(data => setConfig(data))

        fetch(`${import.meta.env.VITE_API_URL}/api/balance`)
            .then(res => res.json())
            .then(data => setBalanceHistory(data))
    }, [])

    return(
        <div className='portfolioContainer' onClick={() => setSettings(true)}>
            <div className='graphHeader'>
                <div className='graphLabel'>Account Balance</div>
                <div className='graphBalance'>${config.accountBalance}</div>
            </div>
            {balanceHistory.length === 0 ? (
                <div className='graphEmpty'>No balance history yet</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory} margin={{ top: 20, right: 90, bottom: 20, left: 10 }}>
                    <YAxis
                        orientation="right"
                        domain={['auto', 'auto']}
                        tickCount={3}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a0a0c0', fontSize: 12, dx: 20 }}
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a5c', borderRadius: '8px', color: 'white' }}
                        formatter={(value) => [`$${value}`, 'Balance']}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.date ?? label}
                    />
                    <Line
                        dataKey="balance"
                        stroke="#b482ff"
                        strokeWidth={2}
                        dot={{ fill: '#b482ff', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            )}
            {settings && (
                <div className='modalOverlay' onClick={() => setSettings(false)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <div className='modalTitle'>Graph Config Settings</div>
                        <div className='modalFields'>
                            <div className='modalField'>
                                <label>Balance</label>
                                <input
                                    type="number"
                                    value={config.accountBalance}
                                    onChange={(e) => setConfig({...config, accountBalance: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>Risk / Trade</label>
                                <input
                                    type="number"
                                    value={config.riskPerTrade}
                                    onChange={(e) => setConfig({...config, riskPerTrade: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>Reward / Risk</label>
                                <input
                                    type="number"
                                    value={config.minRewardRisk}
                                    onChange={(e) => setConfig({...config, minRewardRisk: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>Max Trades</label>
                                <input
                                    type="number"
                                    value={config.maxOpenTrades}
                                    onChange={(e) => setConfig({...config, maxOpenTrades: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>Pullback Days</label>
                                <input
                                    type="number"
                                    value={config.pullbackDays}
                                    onChange={(e) => setConfig({...config, pullbackDays: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>MA Short</label>
                                <input
                                    type="number"
                                    value={config.maShort}
                                    onChange={(e) => setConfig({...config, maShort: e.target.value})}
                                />
                            </div>
                            <div className='modalField'>
                                <label>MA Long</label>
                                <input
                                    type="number"
                                    value={config.maLong}
                                    onChange={(e) => setConfig({...config, maLong: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className='modalButtons'>
                            <button className='modalClose' onClick={() => setSettings(false)}>Cancel</button>
                            <button className='modalSave' onClick={saveConfig}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
