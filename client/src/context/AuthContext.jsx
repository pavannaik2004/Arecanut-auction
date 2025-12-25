import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate token with backend here, 
      // for now we decode or just assume existence + stored user data
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        // Setup axios default
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(API_ENDPOINTS.login, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    // Clean up data - only send relevant fields based on role
    const cleanData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    // Add role-specific fields
    if (userData.role === 'farmer' && userData.farmLocation) {
      cleanData.farmLocation = userData.farmLocation;
    }
    if (userData.role === 'trader' && userData.apmcLicense) {
      cleanData.apmcLicense = userData.apmcLicense;
    }
    if (userData.phone) {
      cleanData.phone = userData.phone;
    }
    
    await axios.post(API_ENDPOINTS.register, cleanData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
