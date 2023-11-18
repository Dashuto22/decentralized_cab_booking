// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;



import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RideKoin.sol";
import "./XclusiveRydePass.sol";

contract RydeAsset is ERC1155, Ownable {
    uint256 public MINT_PRICE = 10 wei;

    RideKoin public rideKoinContract;
    XclusiveRydePass public xclusiveRydePassContract;

    uint256 private currentTokenID = 2; 

    mapping(uint256 => string) public tokenDescriptions;
    enum UserRole { None, Driver, Rider }
    mapping(address => UserRole) public userRoles;

    struct RideRequest {
        address rider;
        string fromLocation;
        string toLocation;
    }

    uint256 private currentRequestId = 0;
    mapping(uint256 => RideRequest) public rideRequests;


    constructor(address _rideKoinContractAddress, address _xclusiveRydePassContractAddress) 
        ERC1155("abcdce") 
            Ownable(msg.sender)  
    {
        rideKoinContract = RideKoin(_rideKoinContractAddress);
        xclusiveRydePassContract = XclusiveRydePass(_xclusiveRydePassContractAddress);
    }

    event RideRequested(uint256 requestId, address rider, string fromLocation, string toLocation);

    function registerAsDriver() public {
        userRoles[msg.sender] = UserRole.Driver;
    }

    function registerAsRider() public {
        userRoles[msg.sender] = UserRole.Rider;
    }

    function getUserRole(address a) public view returns (UserRole){
        return userRoles[a];
    }

    function mintXclusiveRydePass(address to) public payable {
        xclusiveRydePassContract.safeMint{value: msg.value}(to);
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

    function sellRideKoin(uint256 tokenAmount) public {
        rideKoinContract.sellToken(tokenAmount);
    }

    function withdrawFundsFromRideKoin() public onlyOwner {
        rideKoinContract.withdraw();
    }


    function getRideKoinBalance(address user) public view returns (uint256) {
        return rideKoinContract._balanceOf(user);
    }

    function getXclusiveRydePassCount(address user) public view returns (uint256) {
        return xclusiveRydePassContract.balanceOf(user);
    }


    function getTokenDescription(uint256 tokenId) external view returns (string memory) {
        return tokenDescriptions[tokenId];
    }

        struct SpecialTokenDetail {
        uint256 rydeKoinAmount;
        uint256 xclusiveRydePassID;
    }

    mapping(uint256 => uint256) public specialTokenValues; // The value of each SpecialToken in wei


    mapping(uint256 => SpecialTokenDetail) public specialTokenDetails;

    function createSpecialToken(uint256 rydeKoinAmount, uint256 xclusiveRydePassID) public payable {
        require(rideKoinContract._balanceOf(msg.sender) >= rydeKoinAmount, "Not enough RideKoin");
        require(xclusiveRydePassContract.ownerOf(xclusiveRydePassID) == msg.sender, "You don't own the specified XclusiveRydePass");
        rideKoinContract.transferFrom(msg.sender, address(this), rydeKoinAmount);
        xclusiveRydePassContract.transferFrom(msg.sender, address(this), xclusiveRydePassID);

        specialTokenDetails[currentTokenID] = SpecialTokenDetail({
            rydeKoinAmount: rydeKoinAmount,
            xclusiveRydePassID: xclusiveRydePassID
        });

        _mint(msg.sender, currentTokenID, 1, "");
        currentTokenID++;
    } /* Before using this function ensure that the smart contract is approved by both RideKoin and XRP smart contracts as we are authorising the ERC1155
        Contract to transfer money on behaf of the user. This method will be improved in phase 2.
    
    */

    modifier onlyOwnerOrAccount(address account) {
        require(account == msg.sender || owner() == msg.sender, "Not the owner or the specified ownr");
        _;
    }

    function viewOwnedSpecialTokens(address account) public onlyOwnerOrAccount(account) view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(account,2);
        uint256[] memory ownedTokens = new uint256[](tokenCount);
        
        uint256 counter = 0;
        for (uint256 i = 0; i < currentTokenID; i++) {
            if (balanceOf(account, i) > 0) {
                ownedTokens[counter] = i;
                counter++;
            }
        }
        return ownedTokens;
    }


    function returnSpecialToken(uint256 specialTokenID) external {
       require(balanceOf(msg.sender, specialTokenID) > 0, "You don't own the specified special token");
        uint256 additionalRideKoinsForXclusivePass = 2;
        rideKoinContract.transfer(msg.sender, specialTokenDetails[specialTokenID].rydeKoinAmount + additionalRideKoinsForXclusivePass);
        delete specialTokenDetails[specialTokenID];
    }

    mapping(uint256 => uint256) public xclusivePassPrices;

    function setXclusivePassPrice(uint256 xclusiveRydePassID, uint256 price) external {
        require(xclusiveRydePassContract.ownerOf(xclusiveRydePassID) == msg.sender, "You don't own the specified XclusiveRydePass");
        xclusivePassPrices[xclusiveRydePassID] = price;     
    }

    function mintBatchXclusiveRydePass(address[] memory to) public payable {
        require(msg.value == MINT_PRICE * to.length, "Incorrect amount of Ether sent");
        
        for (uint256 i = 0; i < to.length; i++) {
            xclusiveRydePassContract.safeMint{value: MINT_PRICE}(to[i]);
        }
    }

    function transferBatch(address from, address[] memory to, uint256[] memory tokenId) public {
        require(to.length == tokenId.length, "Array length mismatch");

        uint256[] memory amounts = new uint256[](to.length);
        for (uint256 i = 0; i < to.length; i++) {
            amounts[i] = 1; // You can customize the amounts if needed
        
        safeBatchTransferFrom(from, to[i], tokenId, amounts, "");
        }

        //safeBatchTransferFrom(from, to, tokenId, amounts, "");
    }

    

    function transferBatchXclusiveRydePass(address from, address[] memory to, uint256[] memory tokenId) public {
        require(to.length == tokenId.length, "Array length mismatch");

        for (uint256 i = 0; i < to.length; i++) {
            xclusiveRydePassContract.transferFrom(from, to[i], tokenId[i]);
        }


    }

    function createRideRequest(string memory fromLocation, string memory toLocation) public {
        require(userRoles[msg.sender] == UserRole.Rider, "Only riders can create requests");
        rideRequests[currentRequestId] = RideRequest({
            rider: msg.sender,
            fromLocation: fromLocation,
            toLocation: toLocation
        });
        emit RideRequested(currentRequestId, msg.sender, fromLocation, toLocation);
        currentRequestId++;
    }

    function viewRideRequests() public view returns (RideRequest[] memory) {
        RideRequest[] memory requests = new RideRequest[](currentRequestId);
        for (uint i = 0; i < currentRequestId; i++) {
            requests[i] = rideRequests[i];
        }
        return requests;
    }
}