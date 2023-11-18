import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaCarAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import  RydeAsset  from 'contractsAbi/Rydeasset.json';
import contractAbi from '../Rydeasset.json';
import './Register.css'; // Assuming you have a CSS file for styling
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure
import { useRideKoin } from './RideKoinContext';

function Register() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  const { setRideKoins } = useRideKoin();

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        const web3Instance = await initializeWeb3();
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Error initializing web3:', error);
      }
    };

    loadWeb3();
  }, []);

  useEffect(() => {
    const loadAccount = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };

    loadAccount();
  }, [web3]);

  const handleRegistration = async (registrationFunction) => {
    if (web3 && account) {
      const contractAddress = '0xb1692d63D4BB8E780295f96bEdfD5ee54f929B66';
      const rydeContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

      try {
        await registrationFunction(rydeContract, account);
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        console.log('Registered successfully');
        console.log("account is", account);
        console.log("role is: ", role);
      } catch (error) {
        console.error('Error registering:', error);
        // Handle errors or display error messages
      }
    }
  };

  const handleRiderRegister = () => {
    handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsRider().send({ from: account });
      navigate('/rider'); // Redirect to rider page or driver page based on role
    });
  };

  const handleDriverRegister = () => {
    handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsDriver().send({ from: account });
      navigate('/driver'); // Redirect to rider page or driver page based on role
    });
  };

  const handleLogin = async () => {
    if (web3 && account) {
      const contractAddress = '0xb1692d63D4BB8E780295f96bEdfD5ee54f929B66';
      const rydeContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

      try {
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        const balance = await rydeContract.methods.getRideKoinBalance(account).call({from : account});
        console.log("account is", account);
        console.log("role is: ", role);
        if(role==2)
          navigate('/rider'); // Redirect to rider page or driver page based on role
        else{
          navigate('/driver');
        }
        setRideKoins(previousKoins => previousKoins + parseInt(balance));

      } catch (error) {
        console.error('Error registering:', error);
        // Handle errors or display error messages
      }
    }
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
      <button className="register-button" onClick={handleLogin}>
        <FaLock />
        <span>Login</span>
      </button>
    </div>
  );
}

export default Register;
