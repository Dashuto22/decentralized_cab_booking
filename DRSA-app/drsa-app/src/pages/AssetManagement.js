import React, { useState, useEffect, useRef } from 'react';
import { initializeWeb3 } from '../utils/web3';
import contractAbi from '../Rydeasset.json';
import rydepassAbi from '../XclusiveRydepass.json';

import './AssetManagement.css'; // Import the CSS file
import { useRideKoin } from './RideKoinContext';


function AssetManagement() {
    // State for each input and the receiver's address
    const { setRideKoins } = useRideKoin();


    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [buyRideKoin, setBuyRideKoin] = useState('');
    const [viewXRTPasses, setviewXRTPasses] = useState('');
    const [XRTPassid, setXRTPassid] = useState('');
    const [createRideAsset, setCreateRideAsset] = useState('');
    const [sendRideKoin, setSendRideKoin] = useState('');
    const [sendXRTPasses, setSendXRTPasses] = useState('');
    const [sendRideAsset, setSendRideAsset] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [contractInstance, setContractInstance] = useState(null);


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

    // Handlers for each button click
    // Add your logic here

    const handleBuyRideKoin = async () => {
        try {


            const contractAddress = '0x489794436375AE5D6FCcc6EfcB9c84744881437C';

            const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
            setContractInstance(contractInstance);


            // Convert input value to a BigNumber if necessary
            const tokenAmount = buyRideKoin;
            const tokenAmountInWei = tokenAmount * 10;

            // Call the smart contract function
            await contractInstance.methods.buyRideKoin(tokenAmount).send({ from: account, value: tokenAmountInWei });

            console.log('Transaction successful for buyRideKoin');
            setRideKoins(previousKoins => previousKoins + parseInt(tokenAmount));

        } catch (error) {
            console.error('Error in buyRideKoin transaction:', error);
        }
    };

    const handleViewXRTPasses = async () => {
        const contractAddress = '0x489794436375AE5D6FCcc6EfcB9c84744881437C';
        const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
        setContractInstance(contractInstance);
        try {
            if (contractInstance) {
                // Call the smart contract function
                const tokens = await contractInstance.methods.getTokens(account).call({ from: account });
                console.log('Tokens owned:', tokens);
                setviewXRTPasses(tokens);
            } else {
                console.error('Contract instance not available');
            }
        } catch (error) {
            console.error('Error in getTokens call:', error);
        }
    };
    
    const handleCreateRideAsset = () => { /* logic */ };
    

    const handleSendRideKoin = async () => {
        const contractAddress = '0x489794436375AE5D6FCcc6EfcB9c84744881437C';
        const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
        setContractInstance(contractInstance);
        try {
            if (contractInstance) {
                // Call the smart contract function
                const val = sendRideKoin;
                const receiver = receiverAddress;
                console.log("methods", contractInstance.methods);
                const ride_koins = await contractInstance.methods.transferRideKoins(account, receiver, val).send({ from: account });
                console.log('Ride koins sent:', ride_koins);
                setSendRideKoin(ride_koins);
            } else {
                console.error('Contract instance not available');
            }
        } catch (error) {
            console.error('Error in sending tokens call:', error);
        }
    };

    const handleSendXRTPasses = async () => {
        const contractAddress = '0x2579a54D8503e01bb2d7d7d0288d689583A09aBf';
        const contractInstance = new web3.eth.Contract(rydepassAbi, contractAddress);
        setContractInstance(contractInstance);
        try {
            if (contractInstance) {
                // Convert input values to appropriate types
                console.log("XRTPassid", XRTPassid)
                const passId = XRTPassid;
                //const passId = parseInt(XRTPassid, 10); // assuming passId is an integer
                const receiver = receiverAddress;
                console.log("receiver ", receiver)
    
                // Call the smart contract function
                await contractInstance.methods.transferToken(receiver,account, passId).send({ from: account });
    
                console.log(`Transaction successful for transferring Xclusive Ryde Pass with ID ${passId} to ${receiver}`);
            } else {
                console.error('Contract instance not available');
            }
        } catch (error) {
            console.error('Error in transferXclusiveRydePass call:', error);
        }
    };
    
    const handleSendRideAsset = () => { /* logic */ };

    return (
        <div className="asset-management">
            <div className="card">
                <div className="row">
                    <input type="text" value={buyRideKoin} onChange={(e) => setBuyRideKoin(e.target.value)} placeholder="Buy RideKoin" />
                    <button onClick={handleBuyRideKoin}>Buy</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={viewXRTPasses} onChange={(e) => setviewXRTPasses(e.target.value)} placeholder="View XRT Passes" />
                    <button onClick={handleViewXRTPasses }>View</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={createRideAsset} onChange={(e) => setCreateRideAsset(e.target.value)} placeholder="Create RideAsset" />
                    <button onClick={handleCreateRideAsset}>Create</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={sendRideKoin} onChange={(e) => setSendRideKoin(e.target.value)} placeholder="Send RideKoin" />
                    <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendRideKoin}>Send</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={XRTPassid} onChange={(e) => setXRTPassid(e.target.value)} placeholder="Enter XRT PassID" />
                    <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendXRTPasses}>Send</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={sendRideAsset} onChange={(e) => setSendRideAsset(e.target.value)} placeholder="Send RideAsset" />
                    <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendRideAsset}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default AssetManagement;
