import {useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'
import {doc, setDoc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {v4 as uuidv4} from 'uuid'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faX} from '@fortawesome/free-solid-svg-icons'
import icon2 from '../assets/icon-2.svg'

const ItemsList = ({list, setList}) => {
	const [edit, setEdit] = useState(true);
	const [name, setName] = useState('Shopping list');
	const [status, setStatus] = useState('completed');
	const listNameInp = useRef();
	const {user} = useAuth();
	const [openCancel, setOpenCancel] = useState(false);
	const navigate = useNavigate();

	const sendList = async (e) => {				
		setList([]);
		e.preventDefault();			
		const target = e.target;
		let pcs = [];
		let date = new Date();
		for (let i = 0; i <= target.length - 2; i++) {
			pcs.push({
				cant: target[i].value,
				id: target[i].offsetParent.offsetParent.dataset.id
			})
		}			
		list.forEach(category => {	
			category.items.forEach(element => {
				delete element.image;
				delete element.note;				
				let pcsCant = pcs.filter(cant => cant.id === element.id);
				element.pcs = pcsCant[0].cant;		
				element.month = date.getMonth();
				element.year = date.getFullYear();
			})
		})					
		try {		
			let lists = [];		
			const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];	
			const date = new Date();										
			const dateFormat = `${days[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
			if (status === 'completed') setStatus('completed')
			else setStatus('cancelled');			
			const req = doc(db, user.uid, 'list');
			const res = await getDoc(req);					
			const listStored = res.data()?.lists;			
			list.push({listName: name, status, createdAt: dateFormat, timeStamp: Date.now(), listId: uuidv4()});
			if (listStored === undefined) {														
				lists.push({list});			
			} else {
				listStored.push({list});
				lists = listStored;				
			}				
			let cancelList = false;						
			let max = [];
			lists.forEach(listStored => {
				let filterStatus = listStored.list.filter(obj => obj.status === 'cancelled');						
				if (filterStatus.length >= 1) max.push(filterStatus[0]);
			})			
			if (max.length >= 2) cancelList = true;
			if (cancelList && status === 'cancelled') {
				alert('Complete all your lists before creating another');				
				setStatus('completed');
				setOpenCancel(false);
				navigate('/history');
				let aside = e.target.ownerDocument.body.firstElementChild.firstElementChild.lastChild;			
				aside.classList.toggle('move');
				return null;
			}			
			await setDoc(doc(db, user.uid, 'list'), {lists});														
			setStatus('completed');												
		} catch (error) {
			console.log(error);
		}
	}

	const setNameList = () => {
		setName(listNameInp.current.value);
		setEdit(false);
	}

	const operation = (e, operator) => {		
		let value = parseInt(e.target.offsetParent.childNodes[2].firstChild.value);
		if (isNaN(value)) return null;		
		operator === '+' ? value++ : value--;
		value <= 0 ? null : e.target.offsetParent.childNodes[2].firstChild.value = value;
	}

	const deleteItem = (id) => {	
		const newList = [];
		list.forEach(category => {			
			const itemsFilter = category.items.filter(element => element.id !== id);
			category.items = itemsFilter;
			if (category.items.length === 0) {
				const categories = list.filter(categoryStored => categoryStored.id != category.id);
				setList(categories);
			} else {
				newList.push(category);
			}
		})
		setList(newList);				
	}

	const setChecked = (e) => {		
		const target = e.target;			
		if (target.textContent.length >= 1) {
			target.textContent = ''; 		
			target.nextElementSibling.style.textDecoration = "none";
		} else {
			target.textContent = '✔'; 		
			target.nextElementSibling.style.textDecoration = "line-through";
		}
	}

	return (
		<div>
			<div className="list-name">
				<h4>{name}</h4>
				<span style={{cursor: 'pointer'}} onClick={() => setEdit(true)}><FontAwesomeIcon icon={faPen}/></span>
			</div>
			<form className="form-list" onSubmit={sendList}>				
				{list.map(element => {
					return (
						<div className="category" key={element.id}>
							<p>{element.category}</p>							
							{
								element.items?.map(item => {
									return (
										<div className="item-list" key={item.id} data-id={item.id}>
											<div className="checkbox" style={edit ? {display: 'none'} : {display: 'flex'}} onClick={(e) => setChecked(e)}></div>
											<span className={!edit ? "item-name" : ""}>{item.name}</span>
											<div className={edit ? "spinner-input active" : "spinner-input no-active"}>
												{edit ? (
													<>
														<div className="button-delete" onClick={() => deleteItem(item.id)}><FontAwesomeIcon icon={faTrash}/></div>
														<div className="button" onClick={(e) => operation(e, '-')}>-</div>
													</>
												) : ''}
												<div className="input">													
													<input type="text" defaultValue="1" readOnly={edit ? "" : "readonly"}/>
													<span>pcs</span>
												</div>
												{edit ? (
													<div className="button" onClick={(e) => operation(e, '+')}>+</div>
												) : ''}												
											</div>											
										</div>					
									)										
								})
							}
						</div>
					)
				})}
				<div className="buttons-section">			
					{edit ? (
						<div className="list-name-input">
							<input type="text" name="list" ref={listNameInp} placeholder="Enter a name" defaultValue={name}/>						
							<div className="button-save" onClick={setNameList}>Save</div>
						</div>
					) : (
						<div className="buttons">
							<div onClick={() => setOpenCancel(true)} className="button-cancel">cancel</div>						
							<input type="submit" value="Complete"/>
						</div>	
					)}
				</div>	
				{
					openCancel ? (
						<div className="modal-bg">							
							<div className="modal">
								<div className="close-modal"><span onClick={() => setOpenCancel(false)}><FontAwesomeIcon icon={faX}/></span></div>
								<h3>Are you sure that you want to cancel this list?</h3>
								<div className="buttons-section-cancel">
									<div onClick={() => {setOpenCancel(false); setList([])}}>cancel</div>
									<button onClick={() => setStatus('cancelled')}>Yes</button>
								</div>
							</div>
						</div>
					) : ''
				}
			</form>					
		</div>
	)
}

export default ItemsList