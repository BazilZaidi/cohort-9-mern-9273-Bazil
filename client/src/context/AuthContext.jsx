// import { createContext, useState, useContext } from 'react';
import { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // return (
  //   <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
  //     {children}
  //   </AuthContext.Provider>
  // );

  const value = useMemo(() => ({ user, loginUser, logoutUser }), [user]);
  return (
    <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);