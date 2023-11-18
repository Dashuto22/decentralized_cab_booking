import React, { useState, useEffect } from 'react';
import { initializeWeb3 } from '../utils/web3';
import contractAbi from '../Rydeasset.json';

import './AssetManagement.css'; // Import the CSS file

function AssetManagement() {
    // State for each input and the receiver's address
    const [web3, setWeb3] = useState(null);
    const [buyRideKoin, setBuyRideKoin] = useState('');
    const [buyXRTPasses, setBuyXRTPasses] = useState('');
    const [createRideAsset, setCreateRideAsset] = useState('');
    const [sendRideKoin, setSendRideKoin] = useState('');
    const [sendXRTPasses, setSendXRTPasses] = useState('');
    const [sendRideAsset, setSendRideAsset] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');


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

    // Handlers for each button click
    // Add your logic here

    const handleBuyRideKoin = async () => {
        if (web3) {
          const contractAddress = '0x326525609782e20697bB91D4b52f124bD7cf4988';
          const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
    
          try {
            // Convert input value to a BigNumber if necessary
            const tokenAmount = web3.utils.toBN(buyRideKoin);
    
            // Call the smart contract function
            await contractInstance.methods.buyRideKoin(tokenAmount).send({ from: 'SENDER_ADDRESS', value: web3.utils.toWei('AMOUNT_IN_ETHER', 'ether') });
            
            console.log('Transaction successful for buyRideKoin');
          } catch (error) {
            console.error('Error in buyRideKoin transaction:', error);
          }
        }
      };
    const handleBuyXRTPasses = () => { /* logic */ };
    const handleCreateRideAsset = () => { /* logic */ };
    const handleSendRideKoin = () => { /* logic */ };
    const handleSendXRTPasses = () => { /* logic */ };
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
                    <input type="text" value={buyXRTPasses} onChange={(e) => setBuyXRTPasses(e.target.value)} placeholder="Buy XRT Passes" />
                    <button onClick={handleBuyXRTPasses}>Buy</button>
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
                    <input type="text" value={sendXRTPasses} onChange={(e) => setSendXRTPasses(e.target.value)} placeholder="Send XRT Passes" />
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
