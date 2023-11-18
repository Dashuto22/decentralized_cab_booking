import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { FaAddressCard, FaCarAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import  contractAbi  from '../Rydeasset.json';
import './Register.css'; // Assuming you have a CSS file for styling

function Register() {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
      } else {
        console.error('No Ethereum browser extension detected');
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



  const handleRiderRegister = async () => {
    if (web3 && account) {

      const contractAddress = '0x326525609782e20697bB91D4b52f124bD7cf4988';

      const rydeContract = new web3.eth.Contract(contractAbi, contractAddress);
      

      try {

        //console.log("methods here", rydeContract.methods);
        await rydeContract.methods.registerAsRider().send({ from: account });
        console.log('Registered as Rider');
        console.log("account is", account);
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        console.log("role is: ", role);
        navigate('/rider'); // Redirect to rider page
      } catch (error) {
        console.error('Error registering as Rider:', error);
        // Handle errors or display error messages to the user
      }
    }
  };

  const handleDriverRegister = async () => {
    if (web3 && account) {

      const contractAddress = '0x326525609782e20697bB91D4b52f124bD7cf4988';

      const rydeContract = new web3.eth.Contract(contractAbi, contractAddress);
      

      try {
        await rydeContract.methods.registerAsDriver().send({ from: account });
        console.log('account is: ', account);
        console.log('Registered as Driver');
        const role = await rydeContract.methods.getUserRole(account).call({ from: account});
        console.log("role is: ", role);
        //navigate('/driver'); // Redirect to driver page
      } catch (error) {
        console.error('Error registering as Driver:', error);
        // Handle errors or display error messages to the driver
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
    </div>
  );
}

export default Register;
