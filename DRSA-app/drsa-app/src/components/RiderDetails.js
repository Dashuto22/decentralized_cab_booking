import React from 'react';
import { FaStar } from 'react-icons/fa';

const RiderDetail = ({ rider }) => {
    const { name, dropLocation, stars, distance, profilePic } = rider;

    return (
        <div className="rider-detail">
            <div className="rider-profile">
                <img src={profilePic} alt={name} className="profile-photo" />
                <div>{name}</div>
            </div>
            <div className="rider-info">
                <div>Drop Location: {dropLocation}</div>
                <div className="rider-stars">
                    {[...Array(5)].map((_, index) => (
                        <FaStar key={index} color={index < stars ? "#ffc107" : "#e4e5e9"} />
                    ))}
                </div>
                <div>{distance} away</div>
                <input type="number" placeholder="Enter Fare" className="fare-input" />
                <div>
                    Transfer XRP: <input type="checkbox" />
                </div>
                <button className="accept-button">Accept</button>
            </div>
        </div>
    );
};

export default RiderDetail;
