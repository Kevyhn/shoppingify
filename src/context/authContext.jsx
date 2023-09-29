import {createContext, useContext, useEffect, useState} from 'react'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut
} from 'firebase/auth'

import {auth} from '../firebase'

export const authContext = createContext();

export const useAuth = () => {
	const context = useContext(authContext);
	return context;
}

export const AuthProvider = ({children}) => {	
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const signup = (email, password) => 
		createUserWithEmailAndPassword(auth, email, password);

	const login = async (email, password) => {
		const userCredentials = await signInWithEmailAndPassword(auth, email, password);		
	}

	const logout = () => {
		signOut(auth);
		window.location.reload();
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			setUser(currentUser);
			setLoading(false);
		})

		return () => unsubscribe()
	}, []);

	return (
		<authContext.Provider value={{signup, login, user, logout, loading}}>
			{children}
		</authContext.Provider>
	)
}