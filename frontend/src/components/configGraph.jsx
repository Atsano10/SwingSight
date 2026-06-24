import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

export default function Graph(){
    const data = [
        {name: 'Start', balance: 2000},
        {name: 'Current', balance: 2000},
    ]

    const [settings, setSettings] = useState(false)

    const [config, setConfig] = useState({
        accountBalance: 2000,       
        riskPerTrade: 0.05,     
        minRewardRisk: 2.0,     
        maxOpenTrades: 5,              
        pullbackDays: 7         
    })

    const saveConfig = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/config`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(data => console.log('saved', data))
    }

    return(
        <div className='portfolioContainer' onClick={() => setSettings(true)}>
            <div className='graphHeader'>
                <div className='graphLabel'>Account Balance</div>
                <div className='graphBalance'>$2,000.00</div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 90, bottom: 20, left: 10 }}>
                    <YAxis
                        orientation="right"
                        domain={[1800, 2200]}
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
                    />
                    <Line
                        dataKey="balance"
                        stroke="#b482ff"
                        strokeWidth={2}
                        dot={{ fill: '#b482ff', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            {settings && (
                <div className='modalOverlay' onClick={() => setSettings(false)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <div>
                            <label>Risk Per Trade</label>
                            <input
                                type="number"
                                value={config.riskPerTrade}
                                onChange={(e) => setConfig({...config, riskPerTrade: e.target.value})}
                            />
                            <label>Account Balance</label>
                            <input
                                type="number"
                                value={config.accountBalance}
                                onChange={(e) => setConfig({...config, accountBalance: e.target.value})}
                            />
                            <label>Reward/Risk Ratio</label>
                            <input
                                type="number"
                                value={config.minRewardRisk}
                                onChange={(e) => setConfig({...config, minRewardRisk: e.target.value})}
                            />
                            <label>Max Open Trades</label>
                            <input
                                type="number"
                                value={config.maxOpenTrades}
                                onChange={(e) => setConfig({...config, maxOpenTrades: e.target.value})}
                            />
                            <label>Pullback Days</label>
                            <input
                                type="number"
                                value={config.pullbackDays}
                                onChange={(e) => setConfig({...config, pullbackDays: e.target.value})}
                            />
                        </div>
                        <button onClick={() => setSettings(false)}>Close</button>
                        <button onClick={saveConfig}>Save</button>
                    </div>
                </div>
)}
        </div>
    )
}
