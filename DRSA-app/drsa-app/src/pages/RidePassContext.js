import React, { createContext, useState, useContext, useEffect } from 'react';

const RidePassContext = createContext();

export const useRidePass = () => useContext(RidePassContext);

export const RidePassProvider = ({ children }) => {
    const [ridePass, setRidePass] = useState(() => {
        // Check for the value in localStorage
        const savedBalance = localStorage.getItem('ridepass');
        return savedBalance ? JSON.parse(savedBalance) : 0;
    });

    useEffect(() => {
        // Persist the balance to localStorage whenever it changes
        localStorage.setItem('ridepass', ridePass.toString());
    }, [ridePass]);


    return (
        <RidePassContext.Provider value={{ ridePass, setRidePass }}>
            {children}
        </RidePassContext.Provider>
    );
};
