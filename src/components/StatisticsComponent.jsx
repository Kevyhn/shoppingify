import {useState, useEffect} from 'react'
import {useAuth} from '../context/authContext'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {v4 as uuidv4} from 'uuid'
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import {months} from './HistoryComponent'

const StatisticsComponent = () => {
	const [topItems, setTopItems] = useState([]);
	const [topCategories, setTopCategories] = useState([]);
	const {user} = useAuth();
	const [data, setData] = useState([]);

	useEffect(() => {
		getData()
	}, [])

	const getData = async () => {
		const req = doc(db, user.uid, 'list');
		const res = await getDoc(req);
		let lists = res.data()?.lists;	
		if (!lists) lists = [];
		let listTotal = [];
		lists.forEach(lists => {			
			lists.list.forEach(obj => {
				if (!obj.items) return null;
				obj.items.forEach(item => {
					listTotal.push(item);
				})
			})
		})
		getTops(listTotal);
		getSummary(listTotal)
	}

	const getTops = (list) => {
		let itemsTops = {};
		let categoriesTops = {};
		let pcsMax = 0;	
		let itemsMax = 0;	
		list.forEach(cant => pcsMax += parseInt(cant.pcs));
		list.forEach(item => {			
			if (!itemsTops[item.name]) itemsTops[item.name] = parseInt(item.pcs)
			else itemsTops[item.name] = parseInt(item.pcs) + parseInt(itemsTops[item.name]);					
			itemsMax += 1;
			if (!categoriesTops[item.category]) categoriesTops[item.category] = 1
			else categoriesTops[item.category]++;
			
		})					
		let itemsTop = setPorcent(itemsTops, pcsMax);
		let categoryTop = setPorcent(categoriesTops, itemsMax);
		setTopItems(itemsTop);
		setTopCategories(categoryTop);
	}

	const setPorcent = (obj, cant) => {		
		let topsArr = [];
		for (let name in obj) {				
			let item = obj[name];				
			let porcent = parseInt(item / cant * 100);
			topsArr.push({id: uuidv4(), name, porcent});
		}
		topsArr.sort((a, b) => b.porcent - a.porcent);		
		if (topsArr.length >= 3) return topsArr.slice(0, 3);	
		return topsArr;
	}

	const getSummary = (list) => {				
		let setObj = {};			
		list.forEach(item => 											
			setObj[months[item.month] + item.year.toString()] = months[item.month] + '-' + item.year);					
		let summary = [];
		for (let i in setObj) {
			let objToSave = {};
			let objSlipt = setObj[i].split('-');
			let filter = list.filter(obj => 
				months[obj.month] === objSlipt[0] && obj.year.toString() === objSlipt[1]);					
			let pcsTotal = 0;
			filter.forEach(element => pcsTotal += parseInt(element.pcs));							
			objToSave.name = objSlipt[0];
			objToSave.pcs = pcsTotal;
			summary.push(objToSave);				
		}			
		if (summary.length >= 13) summary = summary.splice(-12);		
		setData(summary);		
	}

	return (
		<div className="statistics">
			<div className="top">
				<div className="stat">
					<h2>Top items</h2>
					{topItems.length === 0 ? <p style={{textAlign: 'center'}}>No data</p> : ''}
					{
						topItems.map(item => {
							return (
								<div key={item.id}>
									<div className="item-stat">
										<p>{item.name}</p>
										<p>{item.porcent}%</p>
									</div>						
									<div className="br-bg">
										<div className="br-progress" style={{background: '#f9a109', width: `${item.porcent}%`}}></div>
									</div>
								</div>	
							)
						})
					}					
				</div>
				<div className="stat">
					<h2>Top Categories</h2>
					{topCategories.length === 0 ? <p style={{textAlign: 'center'}}>No data</p> : ''}
					{
						topCategories.map(item => {
							return (
								<div key={item.id}>
									<div className="item-stat">
										<p>{item.name}</p>
										<p>{item.porcent}%</p>
									</div>						
									<div className="br-bg">
										<div className="br-progress" style={{background: '#56ccf2', width: `${item.porcent}%`}}></div>
									</div>
								</div>	
							)
						})
					}
				</div>				
			</div>
			<h2>Yearly Summary</h2>			
			{
				data.length === 0 ? <p style={{textAlign: 'center'}}>No data</p> : (
					<LineChart width={window.innerWidth >= 810 ? window.innerWidth - 500 : window.innerWidth - 120} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
					    <Line type="monotone" dataKey="pcs" stroke="#f9a109" />
					    <CartesianGrid stroke="transparent" strokeDasharray="1 1" />
					    <XAxis dataKey="name" />
					    <YAxis />
					    <Tooltip />
		  			</LineChart>
				)
			}		
		</div>
	)
}

export default StatisticsComponent;