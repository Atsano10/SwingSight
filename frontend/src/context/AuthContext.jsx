import { createContext, useContext, useState, useEffect } from "react";
import {supabase} from '../lib/supabase.js'

export const AuthContext  = createContext();

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // getSession is the authoritative restore — sets user AND ends loading
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // onAuthStateChange only handles subsequent changes (login, logout, token refresh)
        const { data : {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

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
