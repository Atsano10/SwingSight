import { FcGoogle } from 'react-icons/fc'

export default function LogIn(){
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
                    </div>
                    <button className='mainButton'>Log In</button>
                    <div className="breaker"><span>or</span></div>
                    <button className='subButtons'>Sign Up</button>
                    <button className='subButtons'><FcGoogle size={18} /></button>
                </div>
            </div>
        </div>
    )
}