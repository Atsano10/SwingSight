import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'

export default function App(){
    return(
        <BrowserRouter>
            <header className='navbar'>
                <h1 className = 'title'>SwingSight</h1>
                <nav className = 'navButtons'>
                    <NavLink className = 'link' to="/">Signals</NavLink>
                    <NavLink className = 'link' to = "/backtesting">BackTest</NavLink>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path = "/" element = {<h2>Live Analysis Page</h2>} />
                    <Route path = "/backtesting" element = {<h2>Back Testing Page</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}