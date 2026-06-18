// This file creates a global auth context so any component can access the current user
// Create a Context with createContext, then build an AuthProvider component that:
//   - Tracks the current user in useState
//   - On mount, fetches the active session from Supabase and listens for auth changes with onAuthStateChange
//   - Exposes user, loading, and a logout function via the context value
// Also export a useAuth() custom hook that calls useContext so other files don't need to import the context directly
