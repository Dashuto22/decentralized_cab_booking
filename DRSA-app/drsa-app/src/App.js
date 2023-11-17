import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractAbi from './rydekoin.json';
import './App.css';

const MapScreen = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState(''); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideKoins, setRideKoins] = useState(0); // Initialize with default value
  const [xrtPass, setXrtPass] = useState(0);

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

  useEffect(() => {
    const loadNetwork = async () => {
      if (web3 && account) {
        const networkId = await web3.eth.net.getId();
        setNetwork(networkId);

        // Print the first 10 Ganache Account Addresses
        const accounts = await web3.eth.getAccounts();
        console.log('First 10 Ganache Account Addresses:', accounts.slice(0, 10));
      }
    };

    loadNetwork();
  }, [web3, account]);


  useEffect(() => {
    const loadBalances = async () => {
      if (web3 && account) {
        // Call the smart contract functions to get balances
        const rideKoinBalance = await getRideKoinBalance(web3,account);
        //const xrtPassBalance = await getXclusiveRydePassCount(web3, account);

        // Update the state with the retrieved balances
        setRideKoins(rideKoinBalance);
        //setXrtPass(xrtPassBalance);
      }
    };

    loadBalances();
  }, [web3, account]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getRideKoinBalance = async (web3, account) => {
    // Replace with your contract ABI and address
    const contractAddress =  "0xd9145CCE52D386f254917e481eB44e9943F39138"/* The address of your deployed RydeAsset contract */;
    const rydekoinContract = new web3.eth.Contract(contractAbi, contractAddress);

    try {
      // Call the getRideKoinBalance function
      const balance = await rydekoinContract.methods.balanceOf(account).call();
      return balance;
    } catch (error) {
      console.error('Error getting RideKoin balance:', error);
      return 0; // Return a default value in case of an error
    }
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