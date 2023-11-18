import Web3 from 'web3';

let web3Instance = null;

export const initializeWeb3 = async () => {
  if (web3Instance) {
    return web3Instance;
  }

  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.enable();
      web3Instance = new Web3(window.ethereum);
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  } else if (window.web3) {
    // Use Mist/MetaMask provider
    web3Instance = new Web3(window.web3.currentProvider);
  } else {
    console.error('No Ethereum browser extension detected');
    throw new Error('No Ethereum browser extension detected');
  }

  return web3Instance;
};
