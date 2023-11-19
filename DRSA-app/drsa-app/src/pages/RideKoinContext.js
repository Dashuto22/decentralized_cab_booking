import React, { createContext, useState, useContext, useEffect } from 'react';

const RideKoinContext = createContext();

export const useRideKoin = () => useContext(RideKoinContext);

export const RideKoinProvider = ({ children }) => {
    const [rideKoins, setRideKoins] = useState(() => {
        // Check for the value in localStorage
        const savedBalance = localStorage.getItem('rideKoins');
        return savedBalance ? JSON.parse(savedBalance) : 0;
    });

    useEffect(() => {
        // Persist the balance to localStorage whenever it changes
        localStorage.setItem('rideKoins', rideKoins.toString());
    }, [rideKoins]);


    return (
        <RideKoinContext.Provider value={{ rideKoins, setRideKoins }}>
            {children}
        </RideKoinContext.Provider>
    );
};
