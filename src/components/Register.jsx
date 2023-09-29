import {Link, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {useAuth} from '../context/authContext'

const Register = () => {
	const [user, setUser] = useState({		
		email: '',
		password: ''
	})
	const {signup} = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');

	const handleChange = ({target: {name, value}}) => {		
		setUser({...user, [name]: value});		
	}	

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await signup(user.email, user.password);
			navigate('/items');
		} catch (error) {
			let message = error.message.split(':')[1].trim();
			setError(message);
			console.clear();
			setTimeout(() => {
				setError('');
			}, 5000);
		}		
	}

	return (
		<div className="login-register">
			{error.length >= 1 ? <div className="error-msg">{error}</div> : ''}
			<div className="form">
				<h2>Register</h2>				
				<form onSubmit={handleSubmit}>											
					<input type="email" name="email" placeholder="Enter your email" onChange={handleChange}/>					
					<input type="password" name="password" placeholder="Enter your password" onChange={handleChange}/>				
					<input type="submit" value="Register"/>												
				</form>
				<p>Already have an account? <Link to="/login">Login</Link></p>								
			</div>				
		</div>
	)
}

export default Register;