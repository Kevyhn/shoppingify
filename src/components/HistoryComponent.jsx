import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {v4 as uuidv4} from 'uuid'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons'

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const HistoryComponent = ({history, setHistory}) => {		
	const {user} = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		getHistory();
	}, [])

	const getHistory = () => {			
		const req = doc(db, user.uid, 'list');
		getDoc(req).then(res => {
			let lists = res.data()?.lists;							
			if (lists === undefined) return null;					
			lists.forEach(listStored => {
				let {list} = listStored;				
				let created = list.filter(obj => obj.createdAt)[0].createdAt;
				let dateFormat = created.split(' ')[1].split('.').reverse().join('-');						
				list.date = new Date(dateFormat);
			})			
			lists.forEach(obj => {
				obj.list.forEach(listStored => {
					if (listStored.items) return null;								
					obj.timeStamp = listStored.timeStamp;
					delete listStored.timeStamp;
				})
			})		
			lists.sort((a, b) => b.timeStamp - a.timeStamp);						
			let newList	= [];							
			lists.forEach(listStored => {
				let month = listStored.list.date.getMonth();
				let year = listStored.list.date.getFullYear();		
				let dateString = `${months[month]} ${year}`;
				let index = newList.findIndex(obj => obj.date === dateString);
				if (index >= 0) {					
					newList[index].lists.push(listStored.list);
				} else {					
					newList.push({id: uuidv4(), date: dateString, lists: [listStored.list]});
				}								
			})			
			setHistory(newList)
		})				
	}	

	const getListDetails = (id) => {
		id.forEach(ids => {
			if (ids) navigate(`/history/${ids}`);
		})		
	}

	const handleStatus = async (id) => {
		let listSelected = [];
		id.forEach(ids => {
			if (!ids) return null;
			history.forEach(list => {
				list.lists.forEach(listStored => {
					listStored.forEach(obj => {					
						if(obj.listId === ids) {
							let index = listStored.findIndex(obj => obj.listId);							
							listSelected = listStored[index];
						}						
					})									
				})
			})
		})		
		const req = doc(db, user.uid, 'list');
		const res = await getDoc(req);
		let lists = res.data().lists;
		lists.forEach(lists => {			
			lists.list.forEach(listStored => {									
				if (listStored.listId === listSelected.listId) {					
					let i = lists.list.findIndex(obj => obj.status);
					if (lists.list[i].status === 'cancelled') lists.list[i].status = 'completed'											
					else return null;
				}				
			})
		})						
		try {
			await setDoc(doc(db, user.uid, 'list'), {lists});			
		} catch (error) {
			console.log(error);
		}
		getHistory();
	}

	return (
		<>	
			<div className="header">
				<h1>Shopping history</h1>
			</div>			
			<div className="history-lists">
				{
					history.length >= 1 ? history.map(element => {
						return (							
							<div key={element.id}>								
								<p>{element.date}</p>								
								{
									element.lists.map(list => {
										return (											
											<div className="history" key={list.map(prop => prop.listId)}>																					
												<p className="list-name" onClick={(e) => getListDetails(list.map(prop => prop.listId))}>{list.map(prop => prop.listName)}</p>
												<div className="info">
													<span className="date"><FontAwesomeIcon icon={faCalendarDays}/>{list.map(prop => prop.createdAt)}</span>
													<span className={list.map(prop => prop.status).toString().replace(/,/g, '') == 'completed' ? 'status' : 'status-cancel'} onClick={() => handleStatus(list.map(prop => prop.listId))}>{list.map(prop => prop.status)}</span>
													<span className="details-button" onClick={(e) => getListDetails(list.map(prop => prop.listId))}>></span>				
												</div>
											</div>
										)
									})
								}								
							</div>
						)
					}) : <p style={{textAlign: 'center'}}>No data</p>
				}
			</div>			

		</>
	)
}

export default HistoryComponent;