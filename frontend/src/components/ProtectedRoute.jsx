// A wrapper component that guards routes requiring a logged-in user
// Use the useAuth() hook to get the current user and loading state
// If still loading, render nothing (or a spinner)
// If there is no user, redirect to /login using <Navigate> from react-router-dom
// Otherwise render the children prop (the actual page)
