import React, { useState, useEffect } from 'react';
import xrpPassDescriptions from '../components/xrpPasses.json'; // Adjust the path as necessary
import './XRPPasses.css'; // CSS file for styling the cards
import RydeAsset from 'contractsAbi/RydeAsset.json';
import config from "../config/config";
import Transacx from 'contractsAbi/TransacX.json';
import Web3 from "web3";

const XRPPasses = () => {
    const [xrpPasses, setXrpPasses] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');

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
        if (web3 && account) {
            console.log("blala")
            fetchXrpPasses();
        }
    }, [web3, account]);

    const fetchXrpPasses = async () => {

        if (!web3) {
            console.log("Web3 is not initialized yet.");
            return;
        }

        const contractAddress = config.transacxContract/* The address of your deployed RydeAsset contract */;
        const rydeAssetContract = new web3.eth.Contract(Transacx.abi, contractAddress);

        const passCount = await rydeAssetContract.methods.getXclusiveRydePassCount(account).call({from:account});
        const passes = [];
        for (let i = 0; i < passCount; i++) {
            const tokens = await rydeAssetContract.methods.getTokens(account).call({from:account});
            const tokenId = tokens[i];
            const price = await rydeAssetContract.methods.xclusivePassPrices(tokenId).call({from:account});
            passes.push({ id: tokenId, price, description: xrpPassDescriptions[tokenId.toString()] });
        }
        console.log("passes", passes);
        setXrpPasses(passes);
    };


    return (
        <div className="xrp-passes-container">
            {xrpPasses.map(pass => (
                <div key={pass.id} className="xrp-pass-card">
                    <img src={`https://source.unsplash.com/random/200x200?sig=${pass.id}`} alt="XRP Pass" />
                    <div className="pass-info">
                        <h3>XRP Pass # {pass.id.toString()}</h3>
                        <p>Description: {pass.description} Wei</p>

                        <p>Price: {pass.price.toString()} Wei</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default XRPPasses;
