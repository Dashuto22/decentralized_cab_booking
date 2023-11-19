import React, { createContext, useState, useContext } from 'react';

const RideKoinContext = createContext();

export const useRideKoin = () => useContext(RideKoinContext);

export const RideKoinProvider = ({ children }) => {
    const [rideKoins, setRideKoins] = useState(0);

    return (
        <RideKoinContext.Provider value={{ rideKoins, setRideKoins }}>
            {children}
        </RideKoinContext.Provider>
    );
};
