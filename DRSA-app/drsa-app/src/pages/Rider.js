import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RydeAsset from 'contractsAbi/Rydeasset.json';
import '../App.css';




const RiderScreen = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState(''); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

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
        console.log("Acc: ", accounts)
        setAccount(accounts[0]);
      }
    };

    loadAccount();
  }, [web3]);

  // useEffect(() => {
  //   const loadNetwork = async () => {
  //     if (web3 && account) {
  //       const networkId = await web3.eth.net.getId();
  //       setNetwork(networkId);
  //
  //       // Print the first 10 Ganache Account Addresses
  //       const accounts = await web3.eth.getAccounts();
  //       console.log('First 10 Ganache Account Addresses:', accounts.slice(0, 10));
  //     }
  //   };
  //
  //   loadNetwork();
  // }, [web3, account]);


  // useEffect(() => {
  //   const loadBalances = async () => {
  //     if (web3 && account) {
  //       //Call the smart contract functions to get balances
  //       const rideKoinBalance = await getRideKoinBalance(web3,account);
  //       //const xrtPassBalance = await getXclusiveRydePassCount(web3, account);
  //
  //       //Update the state with the retrieved balances
  //       console.log(rideKoinBalance)
  //       setRideKoins(rideKoinBalance);
  //       //setXrtPass(xrtPassBalance);
  //     }
  //   };

  //   loadBalances();
  // }, [web3, account]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const getRideKoinBalance = async (web3, account) => {
    // Replace with your contract ABI and address
    const contractAddress =  "0xb1692d63D4BB8E780295f96bEdfD5ee54f929B66"/* The address of your deployed RydeAsset contract */;
    const rideAssetContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

    try {
      // Call the getRideKoinBalance function
      //console.log("heehaaa",rydekoinContract.methods);
      //const send = await rydekoinContract.methods.whoami().call({from : account});
      //console.log("whoami : ", send)

      const balance = await rideAssetContract.methods.getRideKoinBalance(account).call({from : account});

      console.log("account address: ", account)
      return balance;
    } catch (error) {
      console.error('Error getting RideKoin balance:', error);
      return 0; // Return a default value in case of an error
    }
  };

  const handleBookRide = async () => {
    if (!fromLocation || !toLocation) {
      alert("Please enter both 'From' and 'To' locations");
      return;
    }
    const contractAddress =  "0xb1692d63D4BB8E780295f96bEdfD5ee54f929B66"/* The address of your deployed RydeAsset contract */;
    const contract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
    try {
      await contract.methods.createRideRequest(fromLocation, toLocation).send({ from: account });
      alert("Ride request created successfully");
    } catch (error) {
      console.error('Error creating ride request:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      <div className="mapScreen" style={{ backgroundImage: `url("/assets/GoogleMapTA.webp")`, flex: 1 }}>
        <button className="sidebarToggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {/* Icon for the button */}
        </button>
        <div className="locationInputs">
          <input className="inputField" type="text" placeholder="From" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} />
          <input className="inputField" type="text" placeholder="To" value={toLocation} onChange={(e) => setToLocation(e.target.value)} />
        </div>
        <button className="bookButton" onClick={handleBookRide}>Book</button>
      </div>
    </div>
  );
};

export default RiderScreen;