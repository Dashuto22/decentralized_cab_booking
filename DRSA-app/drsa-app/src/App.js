import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Routes } from "react-router-dom";
import Register from './pages/Register';
import RiderScreen from './pages/Rider';
import DriverScreen from "./pages/Driver";
import AssetManagement from "./pages/AssetManagement";
import { RideKoinProvider } from './pages/RideKoinContext';





function App(){
  return (
      <RideKoinProvider>
      <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/rider" element={<RiderScreen />} />
        <Route path="/driver" element={<DriverScreen />} />
        <Route path="/payment" element={<AssetManagement />} />
      </Routes>
    </Router>
          </ RideKoinProvider>
          );
}

export default App;
