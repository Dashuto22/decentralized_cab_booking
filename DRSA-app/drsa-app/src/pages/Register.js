import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaCarAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import  RydeAsset  from 'contractsAbi/RydeAsset.json';
import Transacx from 'contractsAbi/TransacX.json';
import contractAbi from '../Rydeasset.json';
import './Register.css'; // Assuming you have a CSS file for styling
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure
import { useRideKoin } from './RideKoinContext';
import { useRidePass } from './RidePassContext';

import config from '../config/config'; // Adjust the path based on your file structure

function Register() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(0);

  const { setRideKoins } = useRideKoin();
  const { setRidePass } = useRidePass();

  const firstNames = ["Alex", "Charlie", "Taylor", "Jordan", "Morgan", "Jamie", "Casey", "Avery", "Riley", "Peyton"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

  const generateRandomUsername = () => {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${randomFirstName} ${randomLastName}`;
  };

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
        console.log("acc");
        const accounts = await web3.eth.getAccounts();
        console.log("acc1", accounts);
        setAccount(accounts[0]);
      }
    };

    loadAccount();
  }, [web3]);

  useEffect(() => {
    const loadUserRole = async () => {
      if (web3 && account) {
        const contractAddress = config.rydeAssetContractAddress;
        const rydeContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        setUserRole(role);
      }
    };

    loadUserRole();
  }, [web3, account]);

  useEffect(() => {
    // Clear or update localStorage when the account changes
    localStorage.setItem('rideKoins', JSON.stringify(0));
  }, [account]);

  const handleRegistration = async (registrationFunction) => {
    console.log("here0");
    if (web3 && account) {
      console.log(account);
      const contractAddress = config.rydeAssetContractAddress;
      console.log("here1");
      const rydeContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
      console.log("here2");

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

  const handleRiderRegister = async () => {
    console.log("Rider registration initiated");
    await handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsRider().send({ from: account });
      try {
        await postUserData(account, 2); // 2 for rider
        navigate('/rider'); // Redirect to rider page
      } catch (error) {
        console.error('Error in rider registration postUserData:', error);
        // Implement user-friendly error handling here
      }
    });
  };

  const handleDriverRegister = async () => {
    console.log("Driver registration initiated");
    await handleRegistration(async (rydeContract, account) => {
      await rydeContract.methods.registerAsDriver().send({ from: account });
      try {
        await postUserData(account, 1); // 1 for driver
        navigate('/driver'); // Redirect to driver page
      } catch (error) {
        console.error('Error in driver registration postUserData:', error);
        // Implement user-friendly error handling here
      }
    });
  };


  const postUserData = async (account, userRole) => {
    const userName = generateRandomUsername();
    const numberOfRides = 0;
  
    try {
      const response = await fetch('http://34.118.242.219:4000/api/user/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountAddress: account,
          userName,
          userRole,
          numberOfRides
        }),
      });
  
      const data = await response.json();

      console.log('User data posted:', data);
    } catch (error) {
      console.error('Error posting user data:', error);
    }
  };

  const handleLogin = async () => {
    if (web3 && account) {
      const contractAddress = config.rydeAssetContractAddress;
      const rydeContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
      const transacAddress = config.transacxContract;
      const transacContract = new web3.eth.Contract(Transacx.abi, transacAddress);
      

      try {
        const role = await rydeContract.methods.getUserRole(account).call({ from: account });
        const balance = await transacContract.methods.getRideKoinBalance(account).call({from : account});
        const xrpBalance = await transacContract.methods.getXclusiveRydePassCount(account).call({from : account});

        console.log("account is", account);
        console.log("role is: ", role);
        setUserRole(role);
        console.log(typeof role); // Outputs: string

        if(role==2)
          navigate('/rider'); // Redirect to rider page or driver page based on role
        else if(role==1){
          navigate('/driver');
        }
        setRideKoins(parseInt(balance));
        setRidePass(parseInt(xrpBalance));



      } catch (error) {
        console.error('Error registering:', error);
        // Handle errors or display error messages
      }
    }
  };

  return (
      <div className="register-container" style={{backgroundImage: `url("/assets/drsa-main.png")`, flex: 1}}>
        <div className="content-box">
        {userRole.toString() === "0" && (
            <>
              <button className="register-button" onClick={handleRiderRegister}>
                <FaAddressCard />
                <span>Register as Rider</span>
              </button>
              <button className="register-button" onClick={handleDriverRegister}>
                <FaCarAlt />
                <span>Register as Driver</span>
              </button>
            </>
        )}
        {userRole.toString() !== "0" && (
            <>
              <div className="user-info">
                <h2>{`Welcome, ${account}`}</h2>
                <p>{userRole.toString() === "1" ? 'Role: Driver' : 'Role: Rider'}</p>
              </div>
              <button className="register-button" onClick={handleLogin}>
                <FaLock />
                <span>Login</span>
              </button>
            </>
        )}
      </div>
      </div>

  );

}

export default Register;
