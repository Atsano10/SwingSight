import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignUp(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConPass] = useState('')
    const navigate = useNavigate()

    async function handleSignUp(){
        if (password == confirmPassword){
            const {error} = await supabase.auth.signUp({email, password})
            if(error) alert(error.message)
            else
                navigate('/signals')
        }else alert ("Passwords do not match.")
    }


    return(
        <div className='loginWrapper'>
            <div className='logInPanel'>
                <div className='infoPanel'>
                    <div className='loginBrand'>SwingSight</div>
                    <h1>Analyze swing trades.</h1>
                    <p className='loginTagline'>Scan your watchlist for swing trade setups using moving average crossovers and pullback detection.</p>
                </div>
                <div className='formPanel'>
                    <div className='welcomeHeading'>Welcome Back</div>
                    <div className='formContainer'>
                        <p className='formSubtitle'>Log in to your account</p>
                        <div className='inputGroup'>
                            <label className='inputLabel' htmlFor='email'>Email</label>
                            <input className='inputField' type="email" id='email' placeholder="your@email.com" value = {email}
                            onChange = {(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className='inputGroup'>
                            <label className='inputLabel' htmlFor="password">Password</label>
                            <input className='inputField' type="password" id="password" placeholder="Your password" value = {password}
                            onChange = {(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div className='inputGroup'>
                            <label className='inputLabel' htmlFor="password">Confirm Password</label>
                            <input className='inputField' type="password" id="password" placeholder="Your password" value = {confirmPassword}
                            onChange = {(e) => setConPass(e.target.value)} required/>
                        </div>
                    </div>
                    <button className='mainButton' onClick = {handleSignUp} >Sign Up</button>
                    <div className="breaker"><span>or</span></div>
                    <button className='subButtons' onClick = {() => navigate('/login')}>Log In</button>
                    <button className='subButtons'><FcGoogle size={18} /></button>
                </div>
            </div>
        </div>
    )
}