import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import Transacx from 'contractsAbi/TransacX.json';
import './Navbar.css';
import { IconContext } from 'react-icons';
import userNames from './users.json'; // Import the JSON file
import { initializeWeb3 } from '../utils/web3'; // Adjust the path based on your actual folder structure
import RydeAsset from '../Rydeasset.json';
import { useRideKoin } from '../pages/RideKoinContext';
import { useRidePass } from '../pages/RidePassContext';
import config from '../config/config'; // Adjust the path based on your file structure



function Navbar() {

    const currentUserAddress = "0xAbc123..."; // Replace with dynamic logic to get the current user's address

    const [sidebar, setSidebar] = useState(false);
    const [userName, setUserName] = useState("Timothy");
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [rideKoin, setRideKoins] = useState(0);
    const [xrpPasses, setXrpPasses] = useState(0);
    const {rideKoins} = useRideKoin();
    const {ridePass}  = useRidePass();

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
            if (web3 && account) {
                const contractAddress = config.transacxContract;
                const contract = new web3.eth.Contract(Transacx.abi, contractAddress);
                const rideKoinsBalance = await contract.methods.getRideKoinBalance(account).call({from : account});
                const xrpPassesBalance = await contract.methods.getXclusiveRydePassCount(account).call({from : account});
                setRideKoins(rideKoinsBalance);
                console.log(rideKoins)
                console.log("XRP COunt: ", xrpPassesBalance )
                setXrpPasses(xrpPassesBalance);
            }
        };
        loadBalances();
    }, []);
    const showSidebar = () => setSidebar(!sidebar);

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
                                <div>RideKoins: {rideKoins}</div>
                                <div>XRP Passes: {ridePass}</div>
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
