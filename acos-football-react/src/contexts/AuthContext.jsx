import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Cru00e9er le contexte
const AuthContext = createContext();

// Hook personnalisu00e9 pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Vu00e9rifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Ru00e9cupu00e9rer les informations du joueur
        const response = await axios.get(`${apiUrl}/player/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCurrentUser(response.data.user);
          setPlayerData({
            player: response.data.player,
            category: response.data.category
          });
        }
      } catch (error) {
        setError('Session expiru00e9e ou invalide');
        // Supprimer les donnu00e9es locales si le token est invalide
        if (error.response && error.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/player/login`, { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('player', JSON.stringify(response.data.player));
        
        setCurrentUser(response.data.user);
        setPlayerData({
          player: response.data.player,
          category: response.data.category
        });
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la connexion'
      };
    }
  };
  
  // Fonction de du00e9connexion
  const logout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await axios.post(`${apiUrl}/player/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Erreur lors de la du00e9connexion:', error);
      }
    }
    
    // Supprimer les donnu00e9es locales
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('player');
    
    // Ru00e9initialiser l'u00e9tat
    setCurrentUser(null);
    setPlayerData(null);
  };
  
  // Fonction d'inscription/vu00e9rification de joueur
  const registerPlayer = async (playerData) => {
    try {
      const response = await axios.post(`${apiUrl}/player/check-and-register`, playerData);
      
      if (response.data.success) {
        return {
          success: true,
          password: response.data.password,
          message: 'Compte cru00e9u00e9 avec succu00e8s'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la cru00e9ation du compte'
      };
    }
  };
  
  // Valeurs u00e0 exposer dans le contexte
  const value = {
    currentUser,
    playerData,
    loading,
    error,
    login,
    logout,
    registerPlayer,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
