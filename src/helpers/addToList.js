import {v4 as uuidv4} from 'uuid'

export const addToList = (item, list, setList) => {		
	if (list.length <= 0) {
		setList([...list, {id: uuidv4(), category: item.category, items: [item]}]);
	}	

	let itemRepeat = [];
	list.forEach(categoryStored => {
		categoryStored.items.forEach(itemStored => {					
			if (itemStored.id === item.id) {
				itemRepeat = [itemStored];
			}
		})	
	})
					
	if (itemRepeat.length >= 1) return null;
	
	const indexCategory = list.findIndex(categoryStored => categoryStored.category === item.category);

	if (indexCategory >= 0) {
		list[indexCategory].items.push(item);
		setList(list);
	} else {		
		setList([...list, {id: uuidv4(), category: item.category, items: [item]}]);
	}
}  