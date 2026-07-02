import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom'
import Analysising from './pages/backTesting.jsx'
import LiveAnalysis from './pages/liveAnalysis.jsx'
import LogIn from './pages/Login.jsx'
import SignUp from './pages/Signup.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { DataProvider } from './context/dataContext.jsx'

function RootRedirect() {
    const { user, loading } = useAuth()
    if (loading) return null
    return <Navigate to={user ? '/signals' : '/login'} />
}

function LoginRoute() {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? <Navigate to='/signals' /> : <LogIn />
}

function AppLayout() {
    const [isOpen, setIsOpen] = useState(false)
    const { logOut } = useAuth()
    return (
        <DataProvider>
            <>
                <header className='navbar'>
                    <h1 className='title'>SwingSight</h1>
                    <nav className='navButtons'>
                        <NavLink className='link' to="/signals">Signals</NavLink>
                        <NavLink className='link' to="/backtesting">Analysis</NavLink>
                        <button className='navOptions' onClick={() => setIsOpen(!isOpen)}>&#9776;</button>
                    </nav>
                </header>
                <div className={`sidePanel ${isOpen ? 'open' : ''}`}>
                    <div className="sideTop">
                        <div className='sideTitle'>SwingSight</div>
                        <button className='sideClose' onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <NavLink className='sideLink' to="/signals" onClick={() => setIsOpen(false)}>Signals</NavLink>
                    <NavLink className='sideLink' to="/backtesting" onClick={() => setIsOpen(false)}>Analysis</NavLink>
                    <button className='logOut' onClick={logOut}>Log Out</button>
                </div>
                <Outlet />
            </>
        </DataProvider>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<AppLayout />}>
                    <Route path="/signals" element={<ProtectedRoute><LiveAnalysis /></ProtectedRoute>} />
                    <Route path="/backtesting" element={<ProtectedRoute><Analysising /></ProtectedRoute>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
