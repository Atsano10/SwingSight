import { useAuth } from '../context/AuthContext'

export default function Settings() {
    const { user } = useAuth()

    return (
        <div className='settingsPage'>
            <div className='settingsCard'>
                <h2 className='settingsTitle'>Settings</h2>
                <div className='settingsSection'>
                    <p className='settingsLabel'>Account</p>
                    <p className='settingsValue'>{user?.email}</p>
                </div>
            </div>
        </div>
    )
}
