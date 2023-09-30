import {addToList as add} from '../helpers/addToList'
import {useAuth} from '../context/authContext'
import {doc, setDoc} from 'firebase/firestore' 
import {db} from '../firebase'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'

const ItemDetails = ({setDetails, details, item, items, setItems, setList, list}) => {	
	const {user} = useAuth();
	const deleteItem = async () => {
		const updatedItems = [];
		items.forEach(category => {
			const itemsFilter = category.items.filter(itemStored => itemStored.id !== item.id);
			category.items = itemsFilter;
			if (category.items.length === 0) {
				const categories = items.filter(categoryStored => categoryStored.id != category.id);
				setItems(categories);
			} else {
				updatedItems.push(category);
			}			
		})
		setItems(updatedItems);
		setDetails(false);
		try {
			await setDoc(doc(db, user.uid, 'items'), {items: updatedItems});
		} catch (error) {
			console.log(error);
		}
	}

	const addToList = () => {
		add(item, list, setList);
		setDetails(false);
	}

	const handleBack = (e) => {		
		setDetails(false);
		if (window.innerWidth >= 810) return null;
		let aside = e.target.ownerDocument.body.firstElementChild.firstElementChild.lastChild;		
		aside.classList.toggle('move');
	}

	return (
		<div className="item-details">
			<button onClick={(e) => handleBack(e)}><FontAwesomeIcon icon={faArrowLeft}/> Back</button>					
			{item.image ? (
				<div className="image-container">
					<img src={item.image} alt={`image of a ${item.name}`}/>
				</div>
			) : ''}							
			<span>name</span>
			<h4>{item.name}</h4>
			<span>category</span>
			<p>{item.category}</p>
			{item.note ? <><span>note</span><p>{item.note}</p></> : ''}					
			<div className="buttons">
				<button onClick={deleteItem}>delete</button>
				<button onClick={addToList} className="add">Add to list</button>
			</div>
		</div>
	)
}

export default ItemDetails;