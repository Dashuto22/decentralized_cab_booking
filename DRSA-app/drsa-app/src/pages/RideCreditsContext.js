import React, { createContext, useState, useContext, useEffect } from 'react';

const RideCreditsContext = createContext();

export const useRideCredit = () => useContext(RideCreditsContext);

export const RideCreditProvider = ({ children }) => {
    const [rideCredits, setRideCredits] = useState(() => {
        // Check for the value in localStorage
        const savedBalance = localStorage.getItem('rideCredits');
        return savedBalance ? JSON.parse(savedBalance) : 0;
    });

    useEffect(() => {
        // Persist the balance to localStorage whenever it changes
        localStorage.setItem('rideCredits', rideCredits.toString());
    }, [rideCredits]);


    return (
        <RideCreditsContext.Provider value={{ rideCredits, setRideCredits }}>
            {children}
        </RideCreditsContext.Provider>
    );
};
