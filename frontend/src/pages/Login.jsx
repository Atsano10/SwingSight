export default function LogIn(){
    return(
        <div>
            <div className = 'logInPanel'>
                <div className = 'infoPanel'>
                    <div>SwingSight</div>
                    <h1>Analyze swing trades.</h1>
                    <p>Bla bla bla bla bla bla bla bla</p>
                </div>
                <div className = 'formPanel'>
                    <div>Welcome Back</div>
                    <div className = 'formContainer'>
                        <p>Log in to your account</p>
                        <div>
                            <label>Email</label>
                            <input type="email" id = 'email' placeholder="Your username" required/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id = "password" placeholder="Your password" required/>
                        </div>
                    </div>
                    <button >Log In</button>
                    <div className="breaker"><span>or</span></div>
                </div>
            </div>    
        </div>
    )
}