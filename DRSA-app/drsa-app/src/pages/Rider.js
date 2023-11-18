import React, { useState, useEffect } from 'react';
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure
import contractAbi from '../rydekoin.json';
import '../App.css';

const RiderScreen = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rideKoins, setRideKoins] = useState(0); // Initialize with default value

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
        console.log("Acc: ", accounts);
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
        const rideKoinBalance = await getRideKoinBalance(web3, account);

        // Update the state with the retrieved balances
        console.log(rideKoinBalance);
        setRideKoins(rideKoinBalance);
      }
    };

    loadBalances();
  }, [web3, account]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getRideKoinBalance = async (web3, account) => {
    const contractAddress = '0x98eA6F30bd1819920F2FE8aB42EfE233e33f9741';
    const rydekoinContract = new web3.eth.Contract(contractAbi, contractAddress);

    try {
      const balance = await rydekoinContract.methods.getRideKoinBalance(account).call({ from: account });
      console.log("account address: ", account);
      return balance;
    } catch (error) {
      console.error('Error getting RideKoin balance:', error);
      return 0; // Return a default value in case of an error
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div className="mapScreen" style={{ backgroundImage: `url("/assets/GoogleMapTA.webp")`, flex: 1 }}>
        <button className="sidebarToggle" onClick={() => toggleSidebar()}>
          {/* Icon for the button */}
        </button>
        <div className="locationInputs">
          <input className="inputField" type="text" placeholder="From" />
          <input className="inputField" type="text" placeholder="To" />
        </div>
        <button className="bookButton">Book</button>
      </div>
    </div>
  );
};

export default RiderScreen;
