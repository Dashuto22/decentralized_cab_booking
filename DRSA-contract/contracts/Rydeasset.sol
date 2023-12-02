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

    enum UserRole { None, Driver, Rider }
    mapping(address => UserRole) public userRoles;

    struct RideRequest {
        address rider;
        string fromLocation;
        string toLocation;
        uint requestId;
        bool isAccepted;
    }

    struct AcceptedRide {
        address driver;
        address rider;
        uint256 fare;
        uint xrpID;
        uint requestId;
        uint acceptRequestId;
        bool isAccepted;
    }

    struct ConfirmedRide {
        address rider;
        uint256 fare;
        uint256 xrpToken;
        uint flag;
    }

    uint256 private currentRequestId = 0;
    uint256 private currentAcceptRequestId = 0;

    mapping(uint256 => RideRequest) public rideRequests;
    mapping(uint256 => AcceptedRide) public acceptedRides;

    mapping(address => uint256[]) private acceptedRequestIds;
    mapping(address => ConfirmedRide[]) public confirmedRides;
    mapping(uint256 => uint256) public xclusivePassPrices;

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

    function createRideRequest(string memory fromLocation, string memory toLocation) public {
        require(userRoles[msg.sender] == UserRole.Rider, "Only riders can create requests");
        rideRequests[currentRequestId] = RideRequest({
            rider: msg.sender,
            fromLocation: fromLocation,
            toLocation: toLocation,
            requestId: currentRequestId,
            isAccepted : false
        });
        emit RideRequested(currentRequestId, msg.sender, fromLocation, toLocation);
        currentRequestId++;
    }

    function viewRideRequests() public view returns (RideRequest[] memory) {
        RideRequest[] memory requests = new RideRequest[](currentRequestId);
        for (uint i = 0; i < currentRequestId; i++) {
            if(rideRequests[i].isAccepted != true){
                requests[i] = rideRequests[i];
            }
        }
        return requests;
    }

    function acceptRideRequest(uint256 requestId, uint256 fare, uint256 xrpID ) public {
        require(userRoles[msg.sender] == UserRole.Driver, "Only drivers can accept requests");
        require(rideRequests[requestId].rider != address(0), "Invalid request ID");
        // Mark the request as accepted

        // Add the accepted ride to the mapping
        acceptedRides[currentAcceptRequestId] = AcceptedRide({
            driver: msg.sender,
            rider: rideRequests[requestId].rider,
            fare: fare,
            xrpID : xrpID,
            requestId: requestId,
            acceptRequestId: currentAcceptRequestId,
            isAccepted : false
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
            if(acceptedRides[requestId].isAccepted != true){
                riderAcceptedRides[i] = acceptedRides[requestId];
            }
        }

        return riderAcceptedRides;
    }

    function bookRide(uint256 acceptRequestId) public {
        require(userRoles[msg.sender] == UserRole.Rider, "Only riders can book rides");
        require(acceptedRides[acceptRequestId].rider != address(0), "Invalid request ID");
        require(rideKoinContract._balanceOf(msg.sender) >= acceptedRides[acceptRequestId].fare, "Insufficient RideKoins");

        // Transfer RideKoins from rider to contract
        rideKoinContract.transferRidekoins(msg.sender, acceptedRides[acceptRequestId].driver, acceptedRides[acceptRequestId].fare);

        // Add the ride to the confirmed list for the driver
        confirmedRides[acceptedRides[acceptRequestId].driver].push(ConfirmedRide({
            rider: msg.sender,
            fare: acceptedRides[acceptRequestId].fare,
            xrpToken: acceptedRides[acceptRequestId].xrpID,
            flag:0
        }));

        for (uint256 i = 0; i < currentAcceptRequestId; i++) {
            uint256 requestId = acceptedRides[i].requestId;
            if(acceptedRides[acceptRequestId].requestId == requestId){
                 acceptedRides[i].isAccepted = true;
            }
        }
        // Remove the request from rideRequests and acceptedRides
         rideRequests[acceptedRides[acceptRequestId].requestId].isAccepted = true;
         acceptedRides[acceptRequestId].isAccepted = true;
    }

    function delConfirmedRidesForDriver(address driver) public {
        delete confirmedRides[driver];
    }

    function getConfirmedRidesForDriver(address driver) public view returns (ConfirmedRide[] memory) {
        return confirmedRides[driver];
    }
}