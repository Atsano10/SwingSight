import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LiveAnalysis from './pages/liveAnalysis'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <header className='navbar'>
            <h1 className='title'>SwingSight</h1>
            {user && (
                <nav className='navButtons'>
                    <NavLink className='link' to='/signals'>Signals</NavLink>
                    <NavLink className='link' to='/backtesting'>BackTest</NavLink>
                    <NavLink className='link' to='/settings'>Settings</NavLink>
                    <button className='logoutButton' onClick={handleLogout}>Logout</button>
                </nav>
            )}
        </header>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <main>
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/signals' element={<ProtectedRoute><LiveAnalysis /></ProtectedRoute>} />
                        <Route path='/backtesting' element={<ProtectedRoute><LiveAnalysis /></ProtectedRoute>} />
                        <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    )
}
