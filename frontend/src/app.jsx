import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'
import LiveAnalysis from './pages/liveAnalysis'

export default function App(){
    return(
        <BrowserRouter>
            <header className='navbar'>
                <h1 className = 'title'>SwingSight</h1>
                <nav className = 'navButtons'>
                    <NavLink className = 'link' to="/signals">Signals</NavLink>
                    <NavLink className = 'link' to = "/backtesting">BackTest</NavLink>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path = "/signals" element = {<LiveAnalysis/>} />
                    <Route path = "/backtesting" element = {<backTesting/>} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}