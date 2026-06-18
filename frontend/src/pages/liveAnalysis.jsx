import Table from '../components/tradeTable.jsx'
import Graph from '../components/configGraph.jsx'

export default function Signals(){
    return(
        <main>
            <div className = 'topContainer'>
                <Graph />
            </div>
            <div className = 'bottomContainer'>
                <div className = 'signalsContainer'>
                    <Table />
                </div>
            </div>
        </main>
    )
}
