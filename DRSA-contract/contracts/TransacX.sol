// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./RideKoin.sol";
import "./XclusiveRydepass.sol";

//import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Enumerable.sol";

contract TransacX is ERC1155,  Ownable  {
    // Token IDs
    uint256 public constant RIDE_CREDITS = 1;
    uint256 public constant MEMBERSHIP_PASS = 2;
    uint256 private nextTokenID = 3;

    mapping(uint256 => uint256) public xclusivePassPrices;


    RideKoin public rideKoinContract;
    XclusiveRydePass public xclusiveRydePassContract;

    
    constructor(address _rideKoinContractAddress, address _xclusiveRydePassContractAddress)
        ERC1155("abcdcef")
            Ownable(msg.sender)
    {
        rideKoinContract = RideKoin(_rideKoinContractAddress);
        xclusiveRydePassContract = XclusiveRydePass(_xclusiveRydePassContractAddress);
    }
    // Function to mint ride credits (fungible)



    function mintXclusiveRydePass(address to) public payable {
        xclusiveRydePassContract.safeMint{value: msg.value}(to);
    }


    function transferRideKoins(address from, address to, uint256 value) public {
    require(value > 0, "Value must be greater than 0");
    require(rideKoinContract._balanceOf(from) >= value, "Insufficient RideKoin balance");
    rideKoinContract.transferRidekoins(from, to, value);

}

    function transferXclusiveRydePass(address from, address to, uint256 tokenId) public {
        xclusiveRydePassContract.transferFrom(from, to, tokenId);
    }

    function getTokens(address owner) public view returns (uint256[] memory) {
        return xclusiveRydePassContract.getTokens(owner);
    }

    function buyRideKoin(uint256 tokenAmount) public payable {
        rideKoinContract.buyToken{value: msg.value}(tokenAmount);
        rideKoinContract.transfer(msg.sender, tokenAmount);
    }

    function getRideKoinBalance(address user) public view returns (uint256) {
        return rideKoinContract._balanceOf(user);
    }

    function getXclusiveRydePassCount(address user) public view returns (uint256) {
        return xclusiveRydePassContract.balanceOf(user);
    }

    function setXclusivePassPrice(uint256 xclusiveRydePassID, uint256 price) external {
        require(xclusiveRydePassContract.ownerOf(xclusiveRydePassID) == msg.sender, "You don't own the specified XclusiveRydePass");
        xclusivePassPrices[xclusiveRydePassID] = price;
    }

    function mintRideCredits(address to, uint256 amount) public onlyOwner {
        _mint(to, RIDE_CREDITS, amount, "");
    }

    


    function mintSpecialVoucher(address to, uint256 amount, bool isFungible) public onlyOwner {
        uint256 tokenId;
        if (isFungible) {
            tokenId = RIDE_CREDITS;
        } else {
            tokenId = _getNextTokenID();
            amount = 1; // Ensure only one NFT is minted
        }
        _mint(to, tokenId, amount, "");
    }

    function safeBatchTransfer(
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
    ) public {
    _safeBatchTransferFrom(msg.sender, to, ids, amounts, data);
    }

    // Internal function to generate a new token ID for non-fungible vo

    function _getNextTokenID() private  returns (uint256) {
        return nextTokenID++;
    }

    function getUserTokens(address user) public view returns (uint256 rideCredits, uint256[] memory nftTokenIds) {
        // Get the number of Ride Credits the user has
        rideCredits = balanceOf(user, RIDE_CREDITS);

        // Count how many NFTs the user has
        uint256 nftCount = 0;
        for (uint256 i = MEMBERSHIP_PASS; i < nextTokenID; i++) {
            if (balanceOf(user, i) > 0) {
                nftCount++;
            }
        }

        // Collect the NFT token IDs
        nftTokenIds = new uint256[](nftCount);
        uint256 nftIndex = 0;
        for (uint256 i = MEMBERSHIP_PASS; i < nextTokenID; i++) {
            if (balanceOf(user, i) > 0) {
                nftTokenIds[nftIndex] = i;
                nftIndex++;
            }
        }

        return (rideCredits, nftTokenIds);
    }

    function burnToken(address user, uint256 tokenId, uint256 amount) public {
        require(balanceOf(user, tokenId) >= amount, "Insufficient token balance to burn");

        if (tokenId == RIDE_CREDITS) {
            // Burn Ride Credits (fungible token)
            require(amount > 0, "Amount must be greater than 0 for fungible tokens");
            _burn(user, tokenId, amount);
        } else {
            // Burn NFT (non-fungible token)
            require(amount == 1, "Amount must be 1 for non-fungible tokens");
            require(tokenId >= MEMBERSHIP_PASS && tokenId < nextTokenID, "Invalid NFT token ID");
            _burn(user, tokenId, amount);
    }
    }

    
}