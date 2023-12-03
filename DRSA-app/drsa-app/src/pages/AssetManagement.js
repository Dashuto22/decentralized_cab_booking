import React, { useState, useEffect, useRef } from 'react';
import { initializeWeb3 } from '../utils/web3';
import RydeAsset from 'contractsAbi/Rydeasset.json';
import Transacx from 'contractsAbi/TransacX.json';
import RydePass from 'contractsAbi/XclusiveRydePass.json'

import './AssetManagement.css'; // Import the CSS file
import { useRideKoin } from './RideKoinContext';
import { useRidePass } from './RidePassContext';
import config from '../config/config'; // Adjust the path based on your file structure


function AssetManagement() {
    // State for each input and the receiver's address
    const { setRideKoins } = useRideKoin();
    const {setRidePass} = useRidePass();


    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [buyRideKoin, setBuyRideKoin] = useState('');
    const [viewXRTPasses, setviewXRTPasses] = useState('');
    const [XRTPassid, setXRTPassid] = useState('');
    const [createRideAsset, setCreateRideAsset] = useState('');
    const [sendRideKoin, setSendRideKoin] = useState('');
    const [sendXRTPasses, setSendXRTPasses] = useState('');
    const [sellXRP, setSellXRP] = useState('');
    const [receiverAddress1, setReceiverAddress1] = useState('');
    const [receiverAddress2, setReceiverAddress2] = useState('');
    const [receiverAddress3, setReceiverAddress3] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [ids, setIds] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [transferData, setTransferData] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [userRole, setUserRole] = useState(null); // State to store user role
    const [createXRPValue, setCreateXRPValue] = useState(''); // State for XRP Pass creation value

    const [xrpPassIdToSetPrice, setXrpPassIdToSetPrice] = useState('');
    const [xrpPassPrice, setXrpPassPrice] = useState('');

    useEffect(() => {
        // Fetch user role from the contract
        const fetchUserRole = async () => {
            if (web3 && account) {
                const contractInstance = new web3.eth.Contract(RydeAsset.abi, config.rydeAssetContractAddress);
                const role = await contractInstance.methods.getUserRole(account).call({ from: account });
                setUserRole(Number(role)); // Set user role (1 for driver, 2 for rider)
                console.log("Heya! ", role);
            }
        };

        fetchUserRole();
    }, [web3, account]);


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
            const contractAddress = config.transacxContract;
            const contractInstance = new web3.eth.Contract(Transacx.abi, contractAddress);
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
        const contractAddress = config.transacxContract;
        const contractInstance = new web3.eth.Contract(Transacx.abi, contractAddress);
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
        const contractAddress = config.transacxContract;
        const contractInstance = new web3.eth.Contract(Transacx.abi, contractAddress);
        setContractInstance(contractInstance);
        try {
            if (contractInstance) {
                // Call the smart contract function
                const val = sendRideKoin;
                const receiver = receiverAddress1;
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
        const contractAddress = config.transacxContract;
        const contractInstance = new web3.eth.Contract(Transacx.abi, contractAddress);
        setContractInstance(contractInstance);
        try {
            if (contractInstance) {
                // Convert input values to appropriate types
                console.log("XRTPassid", XRTPassid)
                const passId = XRTPassid;
                //const passId = parseInt(XRTPassid, 10); // assuming passId is an integer
                const receiver = receiverAddress2;
                console.log("receiver ", receiver)

                // Call the smart contract function
                await contractInstance.methods.transferXclusiveRydePass(receiver, passId).send({ from: account });
                //setSendXRTPasses()
                setRidePass(previousPass => previousPass - 1);
                console.log(`Transaction successful for transferring Xclusive Ryde Pass with ID ${passId} to ${receiver}`);
            } else {
                console.error('Contract instance not available');
            }
        } catch (error) {
            console.error('Error in transferXclusiveRydePass call:', error);
        }
    };

    const handleSendRideAsset = async () => {

        try {
            const contractInstance = new web3.eth.Contract(RydeAsset.abi, config.rydeAssetContractAddress);
            console.log(sellXRP, receiverAddress3);
            await contractInstance.methods.exchangeRydePass(account, receiverAddress3, sellXRP).send({from: account});
            alert(`Price for XRP Pass ID ${xrpPassIdToSetPrice} set to ${xrpPassPrice}`);
        } catch (error) {
            console.error('Error selling the XRP', error);
            alert('Failed to sell.');
        }
    };

    const handleCreateXRPPass = async () => {
        if (userRole === 1) { // Check if user is a driver
            try {
                const contractInstance = new web3.eth.Contract(Transacx.abi, config.transacxContract);
                // Logic to create XRP Pass and set its value
                console.log("account: ", account);
                await contractInstance.methods.mintXclusiveRydePass(account).send({ from: account, value: 10 });
                setRidePass(previousPass => previousPass + 1);
                console.log("XRP Pass created with value: ", createXRPValue);
            } catch (error) {
                console.error('Error creating XRP Pass:', error);
            }
        } else {
            alert("Only drivers can create XRP Passes.");
        }
    };

    const handleSetXRPPrice = async () => {
        if (!xrpPassIdToSetPrice || !xrpPassPrice) {
            alert("Please enter both the XRP Pass ID and the price to set");
            return;
        }

        try {
            const contractInstance = new web3.eth.Contract(Transacx.abi, config.transacxContract);
            await contractInstance.methods.setXclusivePassPrice(xrpPassIdToSetPrice, xrpPassPrice).send({ from: account });
            alert(`Price for XRP Pass ID ${xrpPassIdToSetPrice} set to ${xrpPassPrice}`);
        } catch (error) {
            console.error('Error setting XRP Pass price:', error);
            alert('Failed to set price for XRP Pass.');
        }
    };

    const XRPBox = () => (
        <div className="card">
            <div className="row">
                <button onClick={handleCreateXRPPass}>Create XRP Pass</button>
            </div>
        </div>
    );


    const handleSafeBatchTransfer = async () => {
        const contractAddress = config.transacxContract;
        const contractInstance = new web3.eth.Contract(Transacx.abi, contractAddress);
        setContractInstance(contractInstance);

        try {
            // Ensure the user is connected to MetaMask or another Ethereum provider

            // Call the smart contract function
            
            const transfer = await contractInstance.methods.safeBatchTransfer(
                toAddress,
                ids,
                amounts,
                web3.utils.utf8ToHex(transferData) // Convert transferData to hex if needed
            ).send({ from: account });

            console.log('batch transfer done:', transfer);
            // You can handle the response or update state as needed
        } catch (error) {
            console.error('Error in safeBatchTransfer call:', error);
        }
    };

    return (
        <div className="asset-management">
            {userRole === 1 && <XRPBox />} {/* Render XRP Box if userRole is 1 */}
            {userRole === 1 && <div className="card">
                <div className="row">
                    <input type="text" value={xrpPassIdToSetPrice} onChange={(e) => setXrpPassIdToSetPrice(e.target.value)} placeholder="Enter XRP Pass ID" />
                    <input type="text" value={xrpPassPrice} onChange={(e) => setXrpPassPrice(e.target.value)} placeholder="Set Price" />
                    <button onClick={handleSetXRPPrice}>Set Price</button>
                </div>
            </div>}
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
                    <input type="text" value={sendRideKoin} onChange={(e) => setSendRideKoin(e.target.value)} placeholder="Send RideKoin" />
                    <input type="text" value={receiverAddress1} onChange={(e) => setReceiverAddress1(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendRideKoin}>Send</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={XRTPassid} onChange={(e) => setXRTPassid(e.target.value)} placeholder="Enter XRT PassID" />
                    <input type="text" value={receiverAddress2} onChange={(e) => setReceiverAddress2(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendXRTPasses}>Send</button>
                </div>
            </div>
            <div className="card">
                <div className="row">
                    <input type="text" value={sellXRP} onChange={(e) => setSellXRP(e.target.value)} placeholder="Sell XRP" />
                    <input type="text" value={receiverAddress3} onChange={(e) => setReceiverAddress3(e.target.value)} placeholder="Receiver's Address" />
                    <button onClick={handleSendRideAsset}>Sell XRP</button>
                </div>
            </div>

            <div className="card">
                <div className="row">
                    <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="To Address" />
        
                    {/* Assuming 'ids' and 'amounts' are arrays in your component state */}
                    <input type="text" value={ids.join(',')} onChange={(e) => setIds(e.target.value.split(',').map(Number))} placeholder="IDs (comma-separated)" />
                    <input type="text" value={amounts.join(',')} onChange={(e) => setAmounts(e.target.value.split(',').map(Number))} placeholder="Amounts (comma-separated)" />
        
                    <input type="text" value={transferData} onChange={(e) => setTransferData(e.target.value)} placeholder="Transfer Data" />

                    <button onClick={handleSafeBatchTransfer}>Safe Batch Transfer</button>
                </div>
            </div>

        </div>
    );
}

export default AssetManagement;
