// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);


    export const AuthProvider = ({ children }) => {
      const [authState, setAuthState] = useState({
          token: null,
          isAuthenticated: false,
          user: null,
      });
  
      console.log(authState); // Temporarily log the auth state to debug
  
      // rest of your AuthProvider...
  
    const setAuthInfo = ({ token, user }) => {
        setAuthState({
            token,
            isAuthenticated: !!token,
            user
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, setAuthInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
