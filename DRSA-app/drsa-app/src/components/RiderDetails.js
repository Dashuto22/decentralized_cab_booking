import React, {useEffect, useState} from 'react';
import { FaStar } from 'react-icons/fa';
import contractAbi from '../Rydeasset.json';
import RydeAsset from 'contractsAbi/Rydeasset.json';
import config from '../config/config'; // Adjust the path based on your file structure
import XRPPasses from "../components/xrpPasses.json";
import Web3 from "web3";

const RiderDetail = ({ rider }) => {
    const { name, dropLocation, stars, distance, profilePic, requestId } = rider;
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [fare, setFare] = useState(0); // State to store the entered fare
    const [xrpPasses, setXrpPasses] = useState([]);
    const [selectedXrpPassID, setSelectedXrpPassID] = useState('');
    const [xrpId, setXrpId] = useState('');

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


    useEffect(() => {
        const fetchXrpPasses = async () => {
            const contract = new web3.eth.Contract(RydeAsset.abi, config.rydeAssetContractAddress);
            const tokens = await contract.methods.getTokens(account).call({ from: account });

            // Fetch descriptions and prices for each token
            const passesWithDetails = await Promise.all(tokens.map(async (token) => {
                const description = XRPPasses[token];
                const price = await contract.methods.xclusivePassPrices(token).call({ from: account });
                return {
                    id: token,
                    description,
                    price,
                };
            }));

            setXrpPasses(passesWithDetails);
            console.log("passes", passesWithDetails);
        };

        if (web3 && account) {
            fetchXrpPasses();
        }
    }, [web3, account]);

    const handleAcceptRide = async () => {
        const contractAddress = config.rydeAssetContractAddress;
        const rideAssetContract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

        try {
            console.log("selected : ", selectedXrpPassID);
            await rideAssetContract.methods.acceptRideRequest(requestId, fare, selectedXrpPassID).send({ from: account });
            alert("Ride accepted successfully!");
        } catch (error) {
            console.error('Error accepting ride:', error);
            alert("Failed to accept ride.");
        }
    };


    return (
        <div className="rider-detail">
            <div className="rider-profile">
                <img src={profilePic} alt={name} className="profile-photo" />
                <div>{name}</div>
            </div>
            <div className="rider-info">
                <div>Drop Location: {dropLocation}</div>
                <div className="rider-stars">
                    {[...Array(5)].map((_, index) => (
                        <FaStar key={index} color={index < stars ? "#ffc107" : "#e4e5e9"} />
                    ))}
                </div>
                <div>{distance} away</div>
                <input
                    type="number"
                    placeholder="Enter Fare"
                    className="fare-input"
                    onChange={(e) => setFare(e.target.value)} // Update fare state on change
                />
                <div>
                    <div>
                        Transfer XRP:
                        <select
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                console.log("Selected ID: ", selectedId);
                                console.log("Available passes: ", xrpPasses);

                                // Ensure you're comparing the same type. Convert both to strings if necessary.
                                const selectedPass = xrpPasses.find((pass) => pass.id.toString() === selectedId.toString());
                                setSelectedXrpPassID(selectedId); // Store the ID

                                if (selectedPass) {
                                    console.log("Selected XRP Pass Description: ", selectedPass.description);
                                    setSelectedXrpPassID(selectedId); // Store the ID
                                } else {
                                    console.log("No matching XRP Pass found for ID: ", selectedId);
                                }
                            }}
                        >
                            <option value="">Select XRP Pass</option>
                            {xrpPasses.map((xrpPass) => (
                                <option key={xrpPass.id} value={xrpPass.id.toString()}>
                                    {xrpPass.description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button onClick={handleAcceptRide} className="accept-button">Accept</button>
            </div>
        </div>
    );
};

export default RiderDetail;
