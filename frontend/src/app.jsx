import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'
import BackTesting from './pages/backTesting.jsx'
import LiveAnalysis from './pages/liveAnalysis.jsx'
import Home from './pages/home.jsx'

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
                    <Route path="/" element={<Home/>} />
                    <Route path = "/signals" element = {<LiveAnalysis />} />
                    <Route path = "/backtesting" element = {<BackTesting />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}
