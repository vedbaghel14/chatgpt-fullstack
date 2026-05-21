import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('chatUser');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    const userData = {
      id: data.id,
      firstname: data.firstname,
      secondname: data.secondname,
      email: data.email,
    };
    setUser(userData);
    localStorage.setItem('chatUser', JSON.stringify(userData));
    return userData;
  };

  const register = async (fullname, email, password) => {
    await api.register(fullname, email, password);
    return await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);