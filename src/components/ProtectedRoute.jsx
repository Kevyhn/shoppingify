import {useAuth} from '../context/authContext'
import {Navigate} from 'react-router-dom'

export const ProtectedRoute = ({children}) => {
	const {user, loading} = useAuth();

	if (loading) return (
		<div className="loading-container">
			<div class="spinner"></div>
		</div>
	)

	if (!user) return <Navigate to="/login"/>

	return <>{children}</>
}