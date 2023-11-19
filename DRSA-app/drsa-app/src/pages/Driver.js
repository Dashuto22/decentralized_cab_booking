import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RydeAsset from '../Rydeasset.json';

import '../App.css';
import { FaSpinner } from 'react-icons/fa'; // For the spinner icon
import Modal from 'react-modal'; // Install react-modal if not already installed
import RiderDetail from '../components/RiderDetails'; // The new component created above
import './Driver.css'
import userNames from "../components/users.json";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#e0e0e0', // Change the background color to grey
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid #ccc', // Optional: add a border to the modal
        boxSizing: 'border-box', // Make sure padding and borders are included in the total width and height
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Optional: change the overlay background color for better contrast
    },
};

Modal.setAppElement('#root');

const DriverScreen = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [network, setNetwork] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isSearching, setIsSearching] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [riders, setRiders] = useState([]); // You would fetch this from your backend

    // Dummy data for riders
    const dummyRiders = [
        { name: 'Bina', dropLocation: '13 Maple Road', stars: 4, distance: '2 mins', profilePic: '/path/to/image' },
        // ... other riders ...
    ];

    const startDrive = async () => {
        setIsSearching(true);

        // Call the smart contract function after the spinner
        try {
            const contractAddress = "0xb1692d63D4BB8E780295f96bEdfD5ee54f929B66"; // Your deployed RydeAsset contract address
            const rideAssetContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);
            const requests = await rideAssetContract.methods.viewRideRequests().call({from: account});
            console.log("requests", requests);
            // Process the requests
            const processedRequests = requests.map((request, index) => {
                // Replace with your actual mapping from address to name
                const riderName = userNames[request[0]]; // Placeholder for actual name mapping
                return {
                    name: riderName,
                    dropLocation: request[2],
                    stars: 4, // hardcoded for now
                    distance: '2 mins', // hardcoded for now
                    profilePic: '/path/to/image' // placeholder or fetch from your mapping
                };
            });

            setRiders(processedRequests);
        } catch (error) {
            console.error('Error fetching ride requests:', error);
        }

        setIsSearching(false);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    const getRideKoinBalance = async (web3, account) => {
        // Replace with your contract ABI and address
        const contractAddress =  "0xD5d3Ce14A8EE4F1ca6732208dB070F77DFB6b75f"/* The address of your deployed RydeAsset contract */;
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
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div className="mapScreen" style={{ backgroundImage: `url("/assets/GoogleMapTA.webp")`, flex: 1 }}>
                {/* ... existing content ... */}
                <button className="bookButton" onClick={startDrive}>
                    {isSearching ? <FaSpinner className="spinner" /> : 'Start Drive'}
                </button>
            </div>

            {/* Modal for displaying riders */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Rider Details"
            >
                <h2>Nearby Riders</h2>
                {riders.map((rider, index) => (
                    <RiderDetail key={index} rider={rider} />
                ))}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default DriverScreen;