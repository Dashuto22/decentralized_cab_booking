import {React, useEffect, useState} from 'react';
import { FaStar } from 'react-icons/fa';
import RydeAsset from 'contractsAbi/Rydeasset.json';
import Web3 from "web3";
import Transacx from 'contractsAbi/TransacX.json';
import config from '../config/config'; // Adjust the path based on your file structure
import { useRideKoin } from '../pages/RideKoinContext'; // Adjust the path
import './DriverDetails.css'
import XRPPasses from "../components/xrpPasses.json";
const DriverDetail = ({ driver }) => {
    const { name, model, carLicense, distance, fare, xrpId,  acceptRequestId, photos } = driver;

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const { setRideKoins } = useRideKoin();

    const starRating = 5; // Hardcoded for now, adjust as necessary
    // console.log("name, carModel, carLicense, distance, estimatedFare, xrpOption, profilePic", name, carModel, carLicense, distance, fare, xrp, profilePic);
    // console.log("fare:  ", fare);
    // console.log("AcceptReqId", acceptRequestId);

    useEffect(() => {
        console.log("DriverDetail props updated", driver);
    }, [driver]);



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

    const handleBookRide = async (acceptRequestId) => {
        const contractAddress = config.rydeAssetContractAddress;
        const contract = new web3.eth.Contract(RydeAsset.abi, contractAddress);

        const transacAddress = config.transacxContract;
        const transacxContract = new web3.eth.Contract(Transacx.abi, transacAddress);

        try {
            await contract.methods.bookRide(acceptRequestId).send({ from: account });

            alert("Ride booked successfully!");
            const newBalance = await transacxContract.methods.getRideKoinBalance(account).call({from: account});
            console.log("Balance: ", newBalance);
            setRideKoins(newBalance);
            // Update the UI or state as necessary
        } catch (error) {
            console.error('Error booking ride:', error);
            alert("Failed to book ride. You might not have sufficient RideKoins");
        }
    };

    return (
        <div className="driver-detail">
            <div className="driver-profile">
                <img src={photos} alt={name} className="profile-photo" />
                <div>{name}</div>
                <div>{model} ({carLicense})</div>
            </div>
            <div className="driver-info">
                <div className="driver-stars">
                    {[...Array(starRating)].map((_, index) => (
                        <FaStar key={index} color="#ffc107" /> // Assuming all drivers have full star rating for now
                    ))}
                </div>
                <div>{distance}</div>
                <div>Estimated Fare: {fare.toString()} RDK XRP: { XRPPasses[xrpId] }</div>
                <button onClick={() => handleBookRide(acceptRequestId)}>Book Now</button>
            </div>
        </div>
    );
};

export default DriverDetail;
