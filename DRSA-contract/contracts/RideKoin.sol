// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RideKoin is ERC20, Ownable {
    uint256 public tokenPrice; 

    constructor(uint256 initialPrice)
        ERC20("RideKoin", "RDK")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 70000000 * 10 ** decimals());
        tokenPrice = initialPrice;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    modifier onlyOwnerOrAccountHolder(address user) {
        require(user == msg.sender || owner() == msg.sender, "Not enough Permissions");
        _;
    }

    function balanceOf(address user) public view override onlyOwnerOrAccountHolder(user) returns (uint256) {
        return super.balanceOf(user);
    }

    function _balanceOf(address user) external view returns (uint256) {
        return super.balanceOf(user);
    } // <-- tHis is for use in ERC1155

    function getEtherBalance(address user) public view onlyOwnerOrAccountHolder(user) returns (uint256) {
        return user.balance;
    }

    function setTokenPrice(uint256 newPrice) external onlyOwner {
        tokenPrice = newPrice;
    }

    function buyToken(uint256 tokenAmount) public payable {
        uint256 requiredEther = tokenAmount * tokenPrice;
        require(msg.value == requiredEther, "Ether sent doesn't match the required amount for tokens");
        _transfer(owner(), msg.sender, tokenAmount); // Transfer RideKoin tokens from owner to buyer
    }


     function sellToken(uint256 tokenAmount) public {
        uint256 etherAmount = tokenAmount * tokenPrice;
        // require(address(owner).balance >= etherAmount, "Contract does not have enough ether to buy the tokens");
        _transfer(msg.sender, owner(), tokenAmount); 
        payable(msg.sender).transfer(etherAmount);   
    }

    function burnFrom(address user, uint256 amount) public {
        require(user == msg.sender, "You the user can burn his/her tokens");
        _burn(user, amount);
    }


    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function approveAddress(address spender, uint256 amount) public payable  onlyOwner {
        _approve(msg.sender, spender, amount);
    }

}


