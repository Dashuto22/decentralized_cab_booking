import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import RydeAsset from 'contractsAbi/Rydeasset.json';
import '../App.css';
import userNames from "../components/users.json"; // Make sure the path is correct
import cars from "../components/cars.json"
import models from "../components/models.json"
import { FaSpinner } from 'react-icons/fa';
import DriverDetail from "../components/DriverDetails";
import Modal from 'react-modal'; // Install react-modal if not already installed
import config from '../config/config'; // Adjust the path based on your file structure



const RiderScreen = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const isSearchingRef = useRef(isSearching);


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '600px',
      width: '80%',
      border: '1px solid #ccc',
      maxHeight: '80vh', // Maximum height of the modal
      overflowY: 'auto' // Enable vertical scrolling
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
  };

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
    const contractAddress = config.rydeAssetContractAddress/* The address of your deployed RydeAsset contract */;
    const rideAssetContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

    try {
      // Call the getRideKoinBalance function
      //console.log("heehaaa",rydekoinContract.methods);
      //const send = await rydekoinContract.methods.whoami().call({from : account});
      //console.log("whoami : ", send)

      const balance = await rideAssetContract.methods.getRideKoinBalance(account).call({from: account});

      console.log("account address: ", account)
      return balance;
    } catch (error) {
      console.error('Error getting RideKoin balance:', error);
      return 0; // Return a default value in case of an error
    }
  };



  useEffect(() => {
    isSearchingRef.current = isSearching;

    if (isSearching) {
      console.log(isSearching);
    }
  }, [isSearching]);

  useEffect(() => {
    console.log("Accepted Rides Updated:", acceptedRides);
    // if (acceptedRides.length > 0) {
      setIsOpen(true); // Open the modal if there are accepted rides

  }, [acceptedRides]);

  const handleBookRide = async () => {
    if (!fromLocation || !toLocation) {
      alert("Please enter both 'From' and 'To' locations");
      return;
    }
    const contractAddress = config.rydeAssetContractAddress;
    const contract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

    try {
      await contract.methods.createRideRequest(fromLocation, toLocation).send({from: account});
      setIsSearching(true);

      // Run spinner for 30 seconds then revert back
      setTimeout(() => {
        setIsSearching(false);
      }, 30000);
    } catch (error) {
      console.error('Error creating ride request:', error);
    }
  };

  const checkForAcceptedRides = async (contract, account) => {

    console.log("is search", isSearchingRef.current);
    try {
      // Assuming `viewAcceptedRequests` is a function in your smart contract
      const rides = await contract.methods.viewAcceptedRequest(account).call({from: account});
      console.log("rideee", rides);
      if (rides.length > 0) {

        const validRides = rides.filter(ride =>
            ride.driver !== "0x0000000000000000000000000000000000000000" &&
            ride.rider !== "0x0000000000000000000000000000000000000000"
        );
        const rideDetails = validRides.map((ride) => ({
          name: userNames[ride.driver], // This assumes you have a mapping of driver addresses to names
          model: models[ride.driver], // Hardcoded for now
          stars: 5, // Hardcoded for now
          distance: '2 mins away', // Hardcoded for now
          fare: ride.fare,
          xrpId: ride.xrpID,
          acceptRequestId: ride.acceptRequestId,
          photos: cars[ride.driver]
          // ... any other details you want to include
        }));
        setAcceptedRides(rideDetails);
        console.log("ride", acceptedRides);
        setIsSearching(false);
      } else if (isSearchingRef.current) {
        console.log("ye kaha aa gaye hum");
        setIsOpen(true);
        // setTimeout(() => checkForAcceptedRides(contract, account), 200);
      }
    } catch (error) {
      console.error('Error fetching accepted rides:', error);
    }
  };

  const viewStatus = () => {
    const contractAddress = config.rydeAssetContractAddress;
    const contract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
    checkForAcceptedRides(contract, account);
    console.log("kurgu", acceptedRides);
    // setIsOpen(true);
  };

  const refreshAcceptedRides = () => {
    const contractAddress = config.rydeAssetContractAddress; // Your deployed RydeAsset contract address
    const contract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
    checkForAcceptedRides(contract, account);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsSearching(false);
  };


  return (
      <div style={{display: 'flex', height: '100vh'}}>
        <div className="mapScreen" style={{backgroundImage: `url("/assets/GoogleMapTA.webp")`, flex: 1}}>
          <button className="sidebarToggle" onClick={toggleSidebar}>
            {/* Icon for the button */}
          </button>
          <div className="locationInputs">
            <input className="inputField" type="text" placeholder="From" value={fromLocation}
                   onChange={(e) => setFromLocation(e.target.value)}/>
            <input className="inputField" type="text" placeholder="To" value={toLocation}
                   onChange={(e) => setToLocation(e.target.value)}/>
          </div>
          <button className="bookButton" onClick={handleBookRide}>
            {isSearching ? <FaSpinner icon="spinner" className="spinner"/> : 'Book'}
          </button>
          <button className="bookButton" onClick={viewStatus}>View Status</button>
        </div>

        {/* Modal for displaying accepted rides */}
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Available Drivers">
          <h2>Available Drivers</h2>
          {acceptedRides.length === 0 && !isSearching && <div>No rides have been accepted yet.</div>}
          {acceptedRides.map((ride, index) => (
              <DriverDetail key={index} driver={ride} />
          ))}
          <button onClick={refreshAcceptedRides}>Refresh</button>
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
  );
};

export default RiderScreen;