import React from 'react';
import './App.css';
import Home from './components/Home';
import LoginForm from './components/Login/Login';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} ></Route>
      <Route path='/login' element={<LoginForm />}></Route>
    </Routes>
  );
}

export default App;
