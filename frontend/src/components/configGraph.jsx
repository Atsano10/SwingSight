import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Graph(){
    const data = [
        {name: 'Start', balance: 2000},
        {name: 'End', balance: 2000},
    ]
    /* TODO: Fix Styles*/
    return(
        <div className= 'portfolioContainer'> 
        <ResponsiveContainer width="95%" height="95%">
            <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="balance" />
            </LineChart>
        </ResponsiveContainer>
        </div>
    )
}
