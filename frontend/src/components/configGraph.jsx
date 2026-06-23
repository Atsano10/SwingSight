import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Graph(){
    const data = [
        {name: 'Start', balance: 2000},
        {name: 'Current', balance: 2000},
    ]

    return(
        <div className='portfolioContainer'>
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
        </div>
    )
}
