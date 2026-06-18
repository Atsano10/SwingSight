import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/signals')
        }
    }

    return (
        <div className='authPage'>
            <div className='authCard'>
                <h2 className='authTitle'>Welcome back</h2>
                <form onSubmit={handleLogin} className='authForm'>
                    <input
                        className='authInput'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className='authInput'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className='authError'>{error}</p>}
                    <button className='authButton' type='submit' disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className='authSwitch'>
                    No account? <Link to='/signup'>Sign up</Link>
                </p>
            </div>
        </div>
    )
}
