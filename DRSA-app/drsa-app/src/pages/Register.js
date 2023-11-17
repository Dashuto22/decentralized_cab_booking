import React from 'react';
import { FaAddressCard, FaCarAlt } from "react-icons/fa";
import './Register.css'; // Assuming you have a CSS file for styling

function Register() {

  const handleRiderRegister = () => {
    console.log("Registered as Rider");
    // Redirect to rider registration page
    // Example: window.location.href = '/rider-register';
    window.location.href = '/rider';
  };

  const handleDriverRegister = () => {
    console.log("Registered as Driver");
    // Redirect to driver registration page
    // Example: window.location.href = '/driver-register';
  };

  return (
    <div className="register-container">
      <button className="register-button" onClick={handleRiderRegister}>
        <FaAddressCard />
        <span>Register as Rider</span>
      </button>
      <button className="register-button" onClick={handleDriverRegister}>
        <FaCarAlt />
        <span>Register as Driver</span>
      </button>
    </div>
  );
}

export default Register;
