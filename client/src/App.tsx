import React, {useContext, useEffect} from 'react';
import './App.css';
import Home from './components/Home';
import LoginForm from './components/Login/Login';
import { Routes, Route } from "react-router-dom";
import Cart from './components/Cart';
import { FlightContext } from './stateManagement/FlightContext';
import { authToken } from './auth/authToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {setIsLoggedIn, isLoggedIn, token, setToken, localstorage, setUser} = useContext(FlightContext)
  useEffect(() => {
    if(!token && localstorage) {
      setToken(localstorage)
  }
  if(token) {
      authToken(token, setUser, setIsLoggedIn, isLoggedIn)
  }
  },[token])

  return (
    <Routes>
      <Route path='/' element={<Home />} ></Route>
      <Route path='/login' element={<LoginForm />}></Route>
      <Route path='/cart' element={<Cart />}></Route>
    </Routes>
  );
}

export default App;
