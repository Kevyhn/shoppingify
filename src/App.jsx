import './App.css'
import {useState} from 'react'
import {HashRouter, Routes, Route, Link} from 'react-router-dom'
import NavComponent from './components/layout/NavComponent'
import AsideComponent from './components/layout/AsideComponent'
import ItemsComponent from './components/ItemsComponent'
import HistoryComponent from './components/HistoryComponent'
import StatisticsComponent from './components/StatisticsComponent'
import {AuthProvider} from './context/authContext'
import Login from './components/Login'
import Register from './components/Register'
import ListDetails from './components/ListDetails'
import {ProtectedRoute} from './components/ProtectedRoute'

function App() {
  const [items, setItems] = useState([]);
  const [details, setDetails] = useState(false);
  const [item, setItem] = useState({});
  const [list, setList] = useState([]);
  const [history, setHistory] = useState([]);

  return (    
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <NavComponent list={list}/>
          <div className="main">
            <Routes>          
              <Route path="*" element={<div className="route-error"><h2>Erorr 404 <br/><Link to="/">Home</Link></h2></div>}/>  
              <Route path="/login" element={<Login/>}/>            
              <Route path="/register" element={<Register/>}/>              
              <Route path="/" element={
                <ProtectedRoute>
                  <ItemsComponent setItems={setItems} items={items} setDetails={setDetails} setItem={setItem} setList={setList} list={list} item={item}/>
                </ProtectedRoute>                
              }/>
              <Route path="/items" element={
                <ProtectedRoute>
                  <ItemsComponent setItems={setItems} items={items} setDetails={setDetails} setItem={setItem} setList={setList} list={list} item={item}/>
                </ProtectedRoute>                
              }/>
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryComponent history={history} setHistory={setHistory}/>
                </ProtectedRoute>                
              }/>
              <Route path="/history/:id" element={
                <ProtectedRoute>
                  <ListDetails/>
                </ProtectedRoute>                
              }/>
              <Route path="/statistics" element={
                <ProtectedRoute>
                  <StatisticsComponent/>
                </ProtectedRoute>                
              }/>
            </Routes> 
          </div>
          <AsideComponent setItems={setItems} items={items} details={details} setDetails={setDetails} item={item} list={list} setList={setList}/>
        </HashRouter>
      </AuthProvider>
    </div>    
  )
}

export default App
