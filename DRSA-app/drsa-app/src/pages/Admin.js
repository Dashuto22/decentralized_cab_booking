import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TransacX from 'contractsAbi/TransacX.json';
import './Admin.css';
import config from '../config/config';


const AdminPage = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('all');
    const [rideCredits, setRideCredits] = useState(0);
    const [nftAmount, setNftAmount] = useState(0);
    const [rideCreditsToMint, setRideCreditsToMint] = useState(0);
    const [nftToMint, setNftToMint] = useState(0);

    useEffect(() => {
        const loadWeb3AndContract = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const contractInstance = new web3Instance.eth.Contract(TransacX.abi, config.transacxContract);
                setContract(contractInstance);

                const fetchedAccounts = await web3Instance.eth.getAccounts();
                setAccounts(fetchedAccounts);
            } else {
                console.error('No Ethereum browser extension detected');
            }
        };

        loadWeb3AndContract();
    }, []);

    useEffect(() => {
        const loadAccount = async () => {
          if (web3) {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            setAccounts(accounts);

            const ethereumAccounts = await web3.eth.getAccounts();
            console.log(ethereumAccounts);

            // Fetch user data from the backend
            try {
                const response = await fetch('http://localhost:4000/api/user/get');
                const userData = await response.json();

                // Combine Ethereum accounts with user data
                // Set accounts state
                const accountAddresses = userData.map(user => user.account_address);
                setAccounts(accountAddresses);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback: set accounts state with only Ethereum accounts
                setAccounts(ethereumAccounts.map(account => ({ address: account })));
            }

          }
        };
    
        loadAccount();
      }, [web3]);

    const handleMintTokens = async () => {
        if (!contract) {
            console.error('Contract not initialized');
            return;
        }
    
        try {
            // Mint Ride Credits
            if (rideCreditsToMint > 0) {
                console.log("ridecredits to mint : ", rideCreditsToMint);
                await contract.methods.mintSpecialVoucher(accounts[0], rideCreditsToMint, true).send({ from: accounts[0] });
            }
    
            // Mint NFTs
            for (let i = 0; i < nftToMint; i++) {
                await contract.methods.mintSpecialVoucher(accounts[0], i, false).send({ from: accounts[0] });
            }
    
            alert('Tokens minted successfully!');
        } catch (error) {
            console.error('Error minting tokens:', error);
            alert('Failed to mint tokens');
        }
    };

    const handleDistributeTokens = async () => {
        if (!contract) {
            console.error('Contract not initialized');
            return;
        }
    
        try {
            const userAddresses = selectedAccount === 'all' ? accounts : [selectedAccount];
    
            // Prepare token IDs and amounts for distribution
            const tokenIds = [];
            const amounts = [];
    
            if (rideCredits > 0) {
                tokenIds.push(TransacX.RIDE_CREDITS);
                amounts.push(rideCredits);
            }
            let uT ;
            if (nftAmount > 0) {
                // Add NFT token IDs to the array for distribution
                 uT  = await contract.methods.getUserTokens(accounts[0]).call({ from: accounts[0] });
            }
                console.log("uT: ", uT);
                for (let i = 0; i < userAddresses.length; i++) {
                    let tn  = [];
                    let am = [];
                    tn.push(1);
                    am.push(rideCredits); 
                    tn.push(uT[1][i]);
                    am.push(1); 
                    console.log("here are the detals",)
                    await contract.methods.safeBatchTransfer(userAddresses[i], tn, am, '0x').send({ from: accounts[0] });
                }
    
    
           
            alert('Tokens distributed successfully!');
        } catch (error) {
            console.error('Error distributing tokens:', error);
            alert('Failed to distribute tokens');
        }
    };


    return (
        <div className="admin-container" style={{backgroundImage: `url("/assets/admin_page.png")`, flex: 1}}>
        <h1 className="admin-header">Admin - Promotional Event</h1>

            {/* Minting Section */}
      <div className="admin-section">
                <h2>Mint Tokens</h2>
                <div>
                    <label>
                        Ride Credits to Mint:
                        <input 
                            type="number" 
                            value={rideCreditsToMint} 
                            onChange={(e) => setRideCreditsToMint(e.target.value)} 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        NFTs to Mint:
                        <input 
                            type="number" 
                            value={nftToMint} 
                            onChange={(e) => setNftToMint(e.target.value)} 
                        />
                    </label>
                </div>
                <button onClick={handleMintTokens}>Mint Tokens</button>
            </div>

            {/* Distribution Section */}
            <div className="admin-section">
                <h2>Distribute Tokens</h2>
                <div>
                    <label>
                        Select Account:
                        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                            <option value="all">All</option>
                            {accounts.map((account, index) => (
                                <option key={index} value={account}>{account}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Ride Credits to Distribute:
                        <input 
                            type="number" 
                            value={rideCredits} 
                            onChange={(e) => setRideCredits(e.target.value)} 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        NFTs to Distribute:
                        <input 
                            type="number" 
                            value={nftAmount} 
                            onChange={(e) => setNftAmount(e.target.value)} 
                        />
                    </label>
                </div>
                <button onClick={handleDistributeTokens}>Distribute Tokens</button>
            </div>
        </div>
    );
};

export default AdminPage;
