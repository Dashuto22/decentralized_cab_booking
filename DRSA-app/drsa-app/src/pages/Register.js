import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaCarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import contractAbi from '../Rydeasset.json';
import './Register.css'; // Assuming you have a CSS file for styling
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure

function Register() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();

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
      const contractAddress = '0x98eA6F30bd1819920F2FE8aB42EfE233e33f9741';
      const rydeContract = new web3.eth.Contract(contractAbi, contractAddress);

      try {
        await registrationFunction(rydeContract, account);
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        console.log('Registered successfully');
        console.log("account is", account);
        console.log("role is: ", role);
        navigate('/rider'); // Redirect to rider page or driver page based on role
      } catch (error) {
        console.error('Error registering:', error);
        // Handle errors or display error messages
      }
    }
  };

  const handleRiderRegister = () => {
    handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsRider().send({ from: account });
    });
  };

  const handleDriverRegister = () => {
    handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsDriver().send({ from: account });
    });
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
