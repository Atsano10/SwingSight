import { useState } from 'react'
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'
import BackTesting from './pages/backTesting.jsx'
import LiveAnalysis from './pages/liveAnalysis.jsx'

export default function App(){
    const [isOpen, setIsOpen] = useState(false)
    return(
        <BrowserRouter>
            <header className='navbar'>
                <h1 className = 'title'>SwingSight</h1>
                <nav className = 'navButtons'>
                    <NavLink className = 'link' to="/signals">Signals</NavLink>
                    <NavLink className = 'link' to = "/backtesting">BackTest</NavLink>
                    <button className = 'navOptions' onClick={() => setIsOpen(!isOpen)}>&#9776;</button>
                </nav>
            </header>
            <div className={`sidePanel ${isOpen ? 'open' : ''}`}>
                <div className = "sideTop">
                    <div className = 'sideTitle'>SwingSight</div>
                    <button className = 'sideClose' onClick = {() => setIsOpen(false)} >X</button>
                </div>
                <NavLink className = 'sideLink' to="/signals" onClick = {() => setIsOpen(false)}>Signals</NavLink>
                <NavLink className = 'sideLink' to = "/backtesting" onClick = {() => setIsOpen(false)}>BackTest</NavLink>
                <button className = 'logOut'>Log Out</button>
            </div>
            <main>
                <Routes>
                    <Route path = "/signals" element = {<LiveAnalysis />} />
                    <Route path = "/backtesting" element = {<BackTesting />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}
