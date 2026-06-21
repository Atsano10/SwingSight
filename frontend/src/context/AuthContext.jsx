import { createContext, useContext, useState, useEffect } from "react";
import {supabase} from '../lib/supabase.js'

export const AuthContext  = createContext();

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // checks for active session. (logged in)
        async function getSession(){
            const { data: {session} } = await supabase.auth.getSession()
            // if there is a session store the user otherwise null.
            setUser(session?.user ?? null)
        }
        getSession()

        // check for login and logouts
        const { data : {subscription}} = supabase.auth.onAuthStateChange ( (_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false) // done loading
        })

        //stops checking for more 
        return () => subscription.unsubscribe()
    }, []) 

    // signs out
    async function logOut(){
        await supabase.auth.signOut()
    }

    return(
        <AuthContext.Provider value = {{user, loading, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}
