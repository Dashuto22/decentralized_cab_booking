import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import Transacx from 'contractsAbi/TransacX.json';
import RideKoin from 'contractsAbi/RideKoin.json';
import './Navbar.css';
import { IconContext } from 'react-icons';
import userNames from './users.json'; // Import the JSON file
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure
import RydeAsset from '../Rydeasset.json';
import { useRideKoin } from '../pages/RideKoinContext';
import { useRidePass } from '../pages/RidePassContext';
import config from '../config/config'; // Adjust the path based on your file structure



function Navbar( { redeemToken }) {

    const currentUserAddress = "0xAbc123..."; // Replace with dynamic logic to get the current user's address

    const [sidebar, setSidebar] = useState(false);
    const [userName, setUserName] = useState("Timothy");
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [rideKoin, setRideKoins_] = useState(0);
    const [xrpPasses, setXrpPasses] = useState(0);
    const [rideCredits, setRideCredits] = useState(0);
    const [nftTokenIds, setNftTokenIds] = useState([]);
    const {rideKoins} = useRideKoin();
    const {ridePass}  = useRidePass();
    const { setRideKoins } = useRideKoin();


    useEffect(() => {
        // Initialize web3 and set the web3 instance
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
        // Fetch the account and set the current account
        const loadAccount = async () => {
            if (web3) {
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                if (accounts[0] && userNames[accounts[0]]) {
                    setUserName(userNames[accounts[0]]);
                }
            }
        };

        loadAccount();
    }, [web3]);


    useEffect(() => {
        const loadBalances = async () => {
            if (account) {
                const contractAddress = config.transacxContract;
                const contract = new web3.eth.Contract(Transacx.abi, contractAddress);
                const rideKoinsBalance = await contract.methods.getRideKoinBalance(account).call({from : account});
                const xrpPassesBalance = await contract.methods.getXclusiveRydePassCount(account).call({from : account});
                
                const { rideCredits, nftTokenIds } = await contract.methods.getUserTokens(account).call({ from: account });
                console.log("Response from getUserTokens: ",  rideCredits, nftTokenIds );

                setRideKoins_(rideKoinsBalance);
                setRideKoins(rideKoinsBalance);
                console.log(rideKoins)
                console.log("XRP COunt: ", xrpPassesBalance )
                setXrpPasses(xrpPassesBalance);
                console.log("RCNFTT", rideCredits, nftTokenIds);
                setRideCredits(rideCredits);
                setNftTokenIds(nftTokenIds);
            }
        };
        loadBalances();
    }, [account]);

    const showSidebar = () => setSidebar(!sidebar);

       // Redeem RideCredits
    const redeemRideCredits = async () => {
        // Logic to redeem RideCredits, e.g., calling a smart contract method
        if (!web3 || !account) {
            console.error('Web3 or account not initialized');
            return;
        }
    
        try {
            const contractAddress = config.transacxContract;
            const contract = new web3.eth.Contract(Transacx.abi, contractAddress);
            await contract.methods.burnToken(account, 1, 50).send({ from: account });
            await contract.methods.buyRideKoin(10).send({ from: account, value: 100 });

        }catch (error) {
            console.error('Error redeeming NFT token:', error);
        }

    };

    // Redeem NFT Tokens
    const redeemNFTToken = async (tokenId) => {
        if (!web3 || !account) {
            console.error('Web3 or account not initialized');
            return;
        }
    
        try {
            const contractAddress = config.transacxContract;
            const contract = new web3.eth.Contract(Transacx.abi, contractAddress);
            await contract.methods.burnToken(account, tokenId, 1).send({ from: account });

            const min = 2;
            const max = 20;
            const tokenAmt = Math.floor(Math.random() * (max - min + 1)) + min;
            // Call the smart contract method to redeem the NFT

            const contractAddress1 = config.rideKoinContract;
            const contract1 = new web3.eth.Contract(RideKoin.abi, contractAddress1);
            await contract.methods.buyRideKoin(tokenAmt).send({ from: account, value: tokenAmt*10 });
            setRideKoins_(Number(rideKoins) + tokenAmt);
            setRideKoins(Number(rideKoins) + tokenAmt);
            

    
            // Call the redeemToken prop to show the redemption card
            redeemToken(tokenAmt.toString());
        } catch (error) {
            console.error('Error redeeming NFT token:', error);
        }
    };


    // Dummy data for demonstration
    // const rideKoins = 100; // Replace with real data
    // const xrpPasses = 5; // Replace with real data

    return (
        <div>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className='navbar'>
                    <div className='navbar-left'>
                        <Link to="#" className='menu-bars'>
                            <FaIcons.FaBars onClick={showSidebar}/>
                        </Link>
                    </div>
                    <div className='navbar-center'>
                        <h1>Welcome to DRSA</h1>
                    </div>
                    <div className='navbar-right'>
                        <img src='/assets/drsa-logo.png' alt='DRSA Logo' className='navbar-logo' />
                    </div>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to="#" className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        <div className='profile-card'>
                            <img src='/assets/profile-pic.png' alt='Profile' className='profile-photo' />
                            <div className='info-box'>
                                <div>RideKoins: {rideKoins.toString()}</div>
                                <div>XRP Passes: {ridePass.toString()}</div>
                                <div>Ride Credits: {rideCredits.toString()}</div>
                                <button 
                                    onClick={redeemRideCredits} 
                                    disabled={rideCredits < 50}
                                    className={rideCredits < 50 ? 'button-disabled' : ''}
                                    title={rideCredits < 50 ? "You need a minimum of 50 RIDECREDITS to redeem" : ""}
                                >
                                    Redeem RideCredits
                                </button>
                                <div>Special Vouchers: {nftTokenIds.length}</div> {/* Displaying the count of NFTs */}
                                {nftTokenIds.map((tokenId, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => redeemNFTToken(tokenId)}
                                    >
                                        Redeem Special Voucher {tokenId.toString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className='user-name'>
                            Welcome {userName || "User"}!
                        </div>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })};
                    </ul>
                </nav>
            </IconContext.Provider>
        </div>
    );
}

export default Navbar;
