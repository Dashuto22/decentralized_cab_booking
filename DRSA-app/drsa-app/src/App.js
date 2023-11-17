import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Routes } from "react-router-dom";
import Register from './pages/Register';
import RiderScreen from './pages/Rider';




function App(){
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/rider" element={<RiderScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
