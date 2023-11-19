// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;



import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RideKoin.sol";
import "./XclusiveRydepass.sol";


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
        uint requestId;
    }

    struct AcceptedRide {
        address driver;
        address rider;
        uint256 fare;
        uint256 xclusiveRydePassID;
        uint requestId;
        uint acceptRequestId;
    }

    struct ConfirmedRide {
        address rider;
        uint256 fare;
        address driver;
    }

    uint256 private currentRequestId = 0;
    uint256 private currentAcceptRequestId = 0;

    mapping(uint256 => RideRequest) public rideRequests;
    mapping(uint256 => AcceptedRide) public acceptedRides;

    mapping(address => uint256[]) private acceptedRequestIds;
    mapping(address => ConfirmedRide[]) public confirmedRides;



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
            toLocation: toLocation,
            requestId: currentRequestId
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



    function acceptRideRequest(uint256 requestId, uint256 fare, uint256 xclusiveRydePassID) public {
        require(userRoles[msg.sender] == UserRole.Driver, "Only drivers can accept requests");
        require(rideRequests[requestId].rider != address(0), "Invalid request ID");
        // Mark the request as accepted

        // Add the accepted ride to the mapping
        acceptedRides[currentAcceptRequestId] = AcceptedRide({
            driver: msg.sender,
            rider: rideRequests[requestId].rider,
            fare: fare,
            xclusiveRydePassID: xclusiveRydePassID,
            requestId: requestId,
            acceptRequestId: currentAcceptRequestId
        });

        // Store the request ID in the rider's accepted request IDs
        acceptedRequestIds[rideRequests[requestId].rider].push(currentAcceptRequestId);
        currentAcceptRequestId++;
    }

    function viewAcceptedRequest(address rider) public view returns (AcceptedRide[] memory) {
        require(rider == msg.sender, "Only the rider who created the request can view it");

        uint256[] storage riderAcceptedRequestIds = acceptedRequestIds[rider];
        AcceptedRide[] memory riderAcceptedRides = new AcceptedRide[](riderAcceptedRequestIds.length);

        for (uint256 i = 0; i < riderAcceptedRequestIds.length; i++) {
            uint256 requestId = riderAcceptedRequestIds[i];
            riderAcceptedRides[i] = acceptedRides[requestId];
        }

        return riderAcceptedRides;
    }

    function bookRide(uint256 acceptRequestId) public {
        require(userRoles[msg.sender] == UserRole.Rider, "Only riders can book rides");
        require(acceptedRides[acceptRequestId].rider != address(0), "Invalid request ID");
        require(rideKoinContract._balanceOf(msg.sender) >= acceptedRides[acceptRequestId].fare, "Insufficient RideKoins");

        // Transfer RideKoins from rider to contract
        rideKoinContract.transferFrom(msg.sender, address(this), acceptedRides[acceptRequestId].fare);

        // Add the ride to the confirmed list for the driver
        confirmedRides[acceptedRides[acceptRequestId].driver].push(ConfirmedRide({
            rider: msg.sender,
            fare: acceptedRides[acceptRequestId].fare,
            driver: acceptedRides[acceptRequestId].driver
        }));

        // Remove the request from rideRequests and acceptedRides
        delete rideRequests[acceptedRides[acceptRequestId].requestId];
        delete acceptedRides[acceptRequestId];
    }
}