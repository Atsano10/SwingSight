// Signup page — same structure as Login but calls supabase.auth.signUp({ email, password })
// On success, navigate to /signals
// On error, display the error message
// Include a link back to /login for users who already have an account

import { FcGoogle } from 'react-icons/fc'

export default function SignUp(){
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
                            <input className='inputField' type="email" id='email' placeholder="your@email.com" required/>
                        </div>
                        <div className='inputGroup'>
                            <label className='inputLabel' htmlFor="password">Password</label>
                            <input className='inputField' type="password" id="password" placeholder="Your password" required/>
                        </div>
                        <div className='inputGroup'>
                            <label className='inputLabel' htmlFor="password">Confirm Password</label>
                            <input className='inputField' type="password" id="password" placeholder="Your password" required/>
                        </div>
                    </div>
                    <button className='mainButton'>Sign Up</button>
                    <div className="breaker"><span>or</span></div>
                    <button className='subButtons'>Log In</button>
                    <button className='subButtons'><FcGoogle size={18} /></button>
                </div>
            </div>
        </div>
    )
}