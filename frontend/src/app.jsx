import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom'
import BackTesting from './pages/backTesting.jsx'
import LiveAnalysis from './pages/liveAnalysis.jsx'
import Settings from './pages/settings.jsx'
import LogIn from './pages/login.jsx'

function AppLayout() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <header className='navbar'>
                <h1 className='title'>SwingSight</h1>
                <nav className='navButtons'>
                    <NavLink className='link' to="/signals">Signals</NavLink>
                    <NavLink className='link' to="/backtesting">BackTest</NavLink>
                    <button className='navOptions' onClick={() => setIsOpen(!isOpen)}>&#9776;</button>
                </nav>
            </header>
            <div className={`sidePanel ${isOpen ? 'open' : ''}`}>
                <div className="sideTop">
                    <div className='sideTitle'>SwingSight</div>
                    <button className='sideClose' onClick={() => setIsOpen(false)}>X</button>
                </div>
                <NavLink className='sideLink' to="/signals" onClick={() => setIsOpen(false)}>Signals</NavLink>
                <NavLink className='sideLink' to="/backtesting" onClick={() => setIsOpen(false)}>BackTest</NavLink>
                <NavLink className='sideLink' to="/settings" onClick={() => setIsOpen(false)}>Settings</NavLink>
                <button className='logOut'>Log Out</button>
            </div>
            <Outlet />
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route element={<AppLayout />}>
                    <Route path="/signals" element={<LiveAnalysis />} />
                    <Route path="/backtesting" element={<BackTesting />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
