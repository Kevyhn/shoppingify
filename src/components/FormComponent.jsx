import {v4 as uuidv4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import {doc, setDoc} from 'firebase/firestore'
import {auth, db} from '../firebase'
import {useState, useRef} from 'react'

const FormComponent = ({setOpen, setItems, items}) => {
	const [categories, setCategories] = useState(false);
	const [names, setName] = useState([{name: 'Fruit and vegetables'}, {name: 'Meat and Fish'}, {name: 'Beverages'}, {name: 'Pets'}]);
	const navigate = useNavigate();
	const categoryInp = useRef();
	const form = useRef();

	const addNewItem = async (e) => {
		e.preventDefault();		
		let item = {};
		item.id = uuidv4();			
		const indexCategory = items.findIndex(item => item.category === e.target[3].value);	
		for (let i = 0; i <= 3; i++) item[e.target[i].name] = e.target[i].value;	
		if (item.name === '' || item.category === '') return null;			
		if (indexCategory >= 0) items[indexCategory].items.push(item)			
		else items[items.length] = {id: uuidv4(), category: item.category, items: [item]};
		setItems([...items]);				
		try {											
			await setDoc(doc(db, auth.currentUser.uid, 'items'), {items});
		} catch (error) {
			console.log(error);
		}
		navigate('/items');
		form.current.reset();
		if (window.innerWidth >= 810) return null;
		let aside = e.target.ownerDocument.childNodes[1].childNodes[7].firstElementChild.firstElementChild.childNodes[2];
		aside.classList.toggle('move');	
	}
	
	const setCategory = (e) => {
		categoryInp.current.value = e.target.textContent;
		setCategories(false);		
	}

	return (
		<div className="form-container">
			<h3>Add a new item</h3>
			<form onSubmit={addNewItem} ref={form}>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" placeholder="Enter a name" required/>
				<label htmlFor="note">Note (optional)</label>				
				<textarea name="note" placeholder="Enter a note"/>
				<label htmlFor="image">Image (optional)</label>
				<input type="text" name="image" placeholder="Enter a url"/>
				<label htmlFor="category">Category</label>
				<input type="text" name="category" placeholder="Enter a category" onClick={e => setCategories(true)} readOnly ref={categoryInp} required/>	
				{
					categories ? (
						<div className="options">
							{names.map((element, index) => <div onClick={e => setCategory(e)} key={index} className="option">{element.name}</div>)}														
						</div>
					) : ''
				}
				<div className="form-buttons">
					<button onClick={() => setOpen(false)}>Cancel</button>
					<input type="submit" value="Save"/>
				</div>
			</form>			
		</div>
	)
}

export default FormComponent;