import React, { useState } from 'react';
import './App.css';

const MapScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="mapScreen" style={{ backgroundImage: `url("/assets/GoogleMapTA.webp")` }}>
      {sidebarOpen && <Sidebar />}
      <button className="sidebarToggle" onClick={toggleSidebar}>
        {/* Icon for the button */}
      </button>
      <div className="locationInputs">
      <input className="inputField" type="text" placeholder="From" />
        <input className="inputField" type="text" placeholder="To" />
      </div>
      <button className="bookButton">Book</button>

    </div>
  );
};

const Sidebar = () => {
  const [rideKoins, setRideKoins] = useState(1000);
  const [xrtPass, setXrtPass] = useState(2);

  // Define a method to add more koin/pass
  const addMore = () => {
    // Implement functionality to add more RideKoins or XRT Passes
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <img src="profile-pic-url" alt="Profile" />
        <p>Timothy</p>
        <p>RideKoins: {rideKoins}</p>
        <p>XRT Pass: {xrtPass}</p>
        <button onClick={addMore}>Add More</button>
      </div>
    </div>
  );
};

export default MapScreen;