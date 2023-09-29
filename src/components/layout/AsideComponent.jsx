import {useState} from 'react'
import FormComponent from '../FormComponent'
import ItemDetails from '../ItemDetails'
import ItemsList from '../ItemsList'
import icon1 from '../../assets/icon-1.svg'
import icon2 from '../../assets/icon-2.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons'

const AsideComponent = ({setItems, items, details, setDetails, item, list, setList}) => {
	const [open, setOpen] = useState(false);

	const handleAside = (e) => {
		let aside = e.target.ownerDocument.childNodes[1].childNodes[7].firstElementChild.firstElementChild.childNodes[2];	
		aside.classList.toggle('move');
	}

	return (
		<div className="aside">
			{
				window.innerWidth <= 430 ? <button onClick={e => handleAside(e)} style={{position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer'}}><FontAwesomeIcon icon={faX}/></button> : ''
			}
			<div className="add-container">
				<img src={icon1} alt="icon"/>
				<div>
					<p>Didn't find what you need?</p>
					<button onClick={() => setOpen(true)}>Add item</button>
				</div>
			</div>	
			{list.length >= 1 ? <ItemsList list={list} setList={setList}/> : (
				<div className="list-empty">
					<span className="no-items">No items</span>	
					<img className="icon-2" src={icon2} alt="icon"/>
				</div>									
			)}			
			{open ? <FormComponent setOpen={setOpen} setItems={setItems} items={items}/> : ''}
			{details ? <ItemDetails setDetails={setDetails} details={details} item={item} items={items} setItems={setItems} setList={setList} list={list}/> : ''}
		</div>
	)
}

export default AsideComponent;