import React, { createContext, useState, useContext, useEffect } from 'react';

const NftTokenContext = createContext();

export const useNftToken = () => useContext(NftTokenContext);

export const NftTokenProvider = ({ children }) => {
    const [NftTokens, setNftTokens] = useState(() => {
        // Check for the value in localStorage
        const savedBalance = localStorage.getItem('NftTokens');
        return savedBalance ? JSON.parse(savedBalance) : 0;
    });

    useEffect(() => {
        // Persist the balance to localStorage whenever it changes
        localStorage.setItem('NftTokens', NftTokens.toString());
    }, [NftTokens]);


    return (
        <NftTokenContext.Provider value={{ NftTokens, setNftTokens }}>
            {children}
        </NftTokenContext.Provider>
    );
};
