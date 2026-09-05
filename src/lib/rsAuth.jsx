import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUsers, findUserByEmail, saveUser, ensureSeed } from '@/lib/store';

const AuthContext = createContext(null);

export function RSAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureSeed();
    const id = localStorage.getItem('rapidshield-session');
    if (id) {
      const u = getUsers().find((x) => x.id === id);
      if (u) setUser(u);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const u = findUserByEmail(email);
    if (!u || u.password !== password) throw new Error('Invalid email or password.');
    localStorage.setItem('rapidshield-session', u.id);
    setUser(u);
    return u;
  };

  const register = ({ name, email, password }) => {
    if (findUserByEmail(email)) throw new Error('An account with this email already exists.');
    const u = saveUser({ name, email, password, role: 'user' });
    localStorage.setItem('rapidshield-session', u.id);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('rapidshield-session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);