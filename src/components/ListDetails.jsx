import {useParams, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {useAuth} from '../context/authContext'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarDays, faArrowLeft} from '@fortawesome/free-solid-svg-icons'

const ListDetails = () => {	
	const [historyList, setHistoryList] = useState([]);
	const [details, setDetails] = useState({});
	const params = useParams();	
	const {user} = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		getList()
	}, [])
	
	const getList = async () => {	
		let req = doc(db, user.uid, 'list');
		let res = await getDoc(req);
		let history = res.data().lists;
		let historyFilter = [];		
		history.forEach(listSaved => {		
			listSaved.list.forEach(obj => {
				if (obj.listId === params.id) {
					historyFilter = listSaved.list;
				}
			})
		})				
		let index = historyFilter.findIndex(obj => obj.listId);
		let objDetalils = historyFilter[index];
		historyFilter.splice(index, 1);		
		setDetails(objDetalils);					
		setHistoryList(historyFilter);
	}

	return (
		<div className="items-list">	
			<button className="back-button" onClick={() => navigate('/history')}><FontAwesomeIcon icon={faArrowLeft}/> Back</button>
			<h1 className="list-name">{details.listName}</h1>									
			<div className="createdAt"><FontAwesomeIcon icon={faCalendarDays} style={{marginRight: '10px'}}/>{details.createdAt}</div>						
			{
				historyList.map(element => {																			
					return (
						<div key={element.id}>													
							<p className="category-name">{element.category}</p>	
							<div className="list">					
								{
									element.items.map(item => {
										return (
											<div key={item.id} className="item">																								
												{item.name}
												<p className="pcs">{item.pcs} pcs</p>
											</div>
										)
									})
								}					
							</div>		
						</div>
					)
				})
			}
		</div>
	)
}

export default ListDetails