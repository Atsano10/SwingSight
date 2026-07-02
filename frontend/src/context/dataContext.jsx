import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export function DataProvider({ children }) {
    const [scanResults, setScanResults] = useState([])
    const [backtests, setBacktests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/backtests`).then(r => r.json()),
            fetch(`${import.meta.env.VITE_API_URL}/api/scan-results`).then(r => r.json())
        ])
            .then(([backtestData, scanData]) => {
                setBacktests(backtestData)
                setScanResults(scanData)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    return (
        <DataContext.Provider value={{ scanResults, backtests, loading }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    return useContext(DataContext)
}
