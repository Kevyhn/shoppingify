import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faList, faArrowRotateLeft, faChartSimple, faCartShopping, faRightToBracket} from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/logo.svg'
import {useAuth} from '../../context/authContext'

const NavComponent = ({list}) => {
	const {logout} = useAuth();

	const handleLogout = async () => await logout();

	const handleAside = (e) => {
		if (window.innerWidth >= 810) return null;
		let aside = e.target.ownerDocument.childNodes[1].childNodes[7].firstElementChild.firstElementChild.childNodes[2];
		aside.classList.toggle('move');		
	}
	
	return (
		<div className="nav">
			<div className="nav-icon">								
				<img src={logo} alt="shoppingify logo"/>				
			</div>
			<div className="icons">				
				<Link to="/items">
					<FontAwesomeIcon icon={faList}/>
					<span>Items</span>					
				</Link>				
				<Link to="/history">
					<FontAwesomeIcon icon={faArrowRotateLeft}/>
					<span>History</span>					
				</Link>			
				<Link to="/statistics">
					<FontAwesomeIcon icon={faChartSimple}/>
					<span>Statistics</span>					
				</Link>				
			</div>
			<button style={{background: 'none', border: 'none', fontSize: '18px', color: '#eb5757', cursor: 'pointer'}} onClick={handleLogout}><FontAwesomeIcon icon={faRightToBracket}/></button>
			<div className="cart-icon" onClick={e => handleAside(e)}>				
				<span>{list.length}</span>
				<FontAwesomeIcon icon={faCartShopping}/>
			</div>
		</div>
	)
}

export default NavComponent;