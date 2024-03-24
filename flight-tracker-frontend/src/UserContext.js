import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const login = (token) => {
    setUserToken(token);
    // You might want to store the token in localStorage or sessionStorage here
  };

  const logout = () => {
    setUserToken(null);
    // Also, clear the token from storage
  };

  return (
    <UserContext.Provider value={{ userToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
