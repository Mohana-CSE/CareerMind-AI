import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, rolesAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('careermind_token');
    const savedUser = localStorage.getItem('careermind_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('careermind_token');
        localStorage.removeItem('careermind_user');
      }
    } else {
      // Default guest state for zero-friction hackathon exploration
      setUser({
        id: 'guest-user',
        name: 'Alex Johnson (Student)',
        email: 'alex.student@careermind.ai',
        target_role: 'java-fullstack'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, targetRole) => {
    const data = await authAPI.register({ name, email, password, target_role: targetRole });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser({
      id: 'guest-user',
      name: 'Alex Johnson (Student)',
      email: 'alex.student@careermind.ai',
      target_role: 'java-fullstack'
    });
  };

  const updateTargetRole = async (roleId) => {
    try {
      await rolesAPI.selectRole(roleId);
      const updated = { ...user, target_role: roleId };
      setUser(updated);
      localStorage.setItem('careermind_user', JSON.stringify(updated));
    } catch (e) {
      const updated = { ...user, target_role: roleId };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateTargetRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
