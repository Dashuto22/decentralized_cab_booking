// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./RideKoin.sol";
import "./XclusiveRydePass.sol";

//import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Enumerable.sol";

contract TransacX is ERC1155,  Ownable  {
    // Token IDs
    uint256 public constant RIDE_CREDITS = 1;
    uint256 public constant MEMBERSHIP_PASS = 2;
    uint256 public constant SPECIAL_VOUCHER = 3;
    uint256 private nextTokenID = 4;

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

     

    // Function to mint membership passes (non-fungible)
    function mintMembershipPass(address to) public onlyOwner {
        _mint(to, MEMBERSHIP_PASS, 1, "");
    }


    // Function to mint special vouchers (can be fungible or non-fungible)
    function mintSpecialVoucher(address to, uint256 amount, bool isFungible) public onlyOwner {
        uint256 tokenId = isFungible ? SPECIAL_VOUCHER : _getNextTokenID();
        _mint(to, tokenId, amount, "");
    }

    // Function to perform safe batch transfers
    function safeBatchTransfer(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        public
    {
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    // Internal function to generate a new token ID for non-fungible vo

    function _getNextTokenID() private  returns (uint256) {
        return nextTokenID++;
    }
    
}