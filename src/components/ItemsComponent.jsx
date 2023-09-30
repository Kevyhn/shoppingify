import {useEffect} from 'react'
import {useAuth} from '../context/authContext'
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

const ItemsComponent = ({setItems, items, setDetails, details, setItem, setList, list, item}) => {		
	const {user, loading} = useAuth();	

	useEffect(() => {
		getItems()
	}, [])	

	const showDetails = (id, e) => {
		for (let i = 0; i <= items.length; i++) {
			const itemStored = items[i]?.items.filter(item => item.id === id);			
			if (itemStored?.length === 1) {				
				setItem(itemStored[0]);	
				setDetails(true);			
			}							
		}
		if (window.innerWidth >= 810) return null;
		let aside = e.target.ownerDocument.body.firstElementChild.firstElementChild.lastChild;;					
		aside.classList.toggle('move');	
	}

	const getItems = async () => {				
		const req = doc(db, user.uid, 'items');
		const res = await getDoc(req);		
		let items = res.data()?.items;
		if (items === undefined) items = [];			
		setItems(items);		
	}

	if (loading) return <h1>Loading...</h1>	

	return (
		<>				
			<div className="header">
				<h1><span>Shoppingify</span> allows you take your shopping list wherever you go</h1>
				<div className="search-input">
					<button><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
					<input type="text" name="item" placeholder="search item"/>
				</div>			
			</div>
			<div className="items-list">				
				{				
					items.length >= 1 ? items.map(element => {												
						return (
							<div key={element.id}>
								<p className="category-name">{element.category}</p>
								<div className="list">
									{
										element.items.map(item => {
											return (
												<div className="item" key={item.id}>
													<span onClick={(e) => showDetails(item.id, e)}>{item.name}</span><button onClick={(e) => showDetails(item.id, e)}><FontAwesomeIcon icon={faPlus}/></button>
												</div>
											)
										})
									}
								</div>							
							</div>
						)
					}) : <h3>Items not found</h3>
				}							
			</div>
		</>
	)
}

export default ItemsComponent;