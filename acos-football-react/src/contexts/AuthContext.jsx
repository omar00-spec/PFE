import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer le contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Stocker le type d'utilisateur
      setUserType(storedUserType);
      
      try {
        // Selon le type d'utilisateur, récupérer les informations appropriées
        let endpoint = '/player/profile';
        
        if (storedUserType === 'coach') {
          endpoint = '/coach/profile';
        } else if (storedUserType === 'parent') {
          endpoint = '/parent/profile';
        }
        
        const response = await axios.get(`${apiUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCurrentUser(response.data.user);
          
          if (storedUserType === 'player') {
            setPlayerData({
              player: response.data.player,
              category: response.data.category
            });
          }
        }
      } catch (error) {
        setError('Session expirée ou invalide');
        // Supprimer les données locales si le token est invalide
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
  const login = async (email, password, type = 'player') => {
    try {
      const endpoint = type === 'player' ? '/player/login' : 
                       type === 'coach' ? '/coach/login' : 
                       type === 'parent' ? '/parent/login' : '/login';
      
      const response = await axios.post(`${apiUrl}${endpoint}`, { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', type);
        
        if (type === 'player') {
          localStorage.setItem('player', JSON.stringify(response.data.player));
        } else if (type === 'coach') {
          localStorage.setItem('coach', JSON.stringify(response.data.coach));
        } else if (type === 'parent') {
          localStorage.setItem('parent', JSON.stringify(response.data.parent));
        }
        
        setCurrentUser(response.data.user);
        setUserType(type);
        
        if (type === 'player') {
          setPlayerData({
            player: response.data.player,
            category: response.data.category
          });
        }
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la connexion'
      };
    }
  };
  
  // Fonction de déconnexion
  const logout = async () => {
    const token = localStorage.getItem('token');
    const currentUserType = localStorage.getItem('userType');
    
    if (token) {
      try {
        let endpoint = '/player/logout';
        
        if (currentUserType === 'coach') {
          endpoint = '/coach/logout';
        } else if (currentUserType === 'parent') {
          endpoint = '/parent/logout';
        }
        
        await axios.post(`${apiUrl}${endpoint}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
    
    // Supprimer les données locales
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('player');
    localStorage.removeItem('coach');
    localStorage.removeItem('parent');
    localStorage.removeItem('players');
    localStorage.removeItem('registrations');
    
    // Réinitialiser l'état
    setCurrentUser(null);
    setPlayerData(null);
    setUserType(null);
  };
  
  // Fonction d'inscription/vérification de joueur
  const registerPlayer = async (playerData) => {
    try {
      const response = await axios.post(`${apiUrl}/player/check-and-register`, playerData);
      
      if (response.data.success) {
        return {
          success: true,
          password: response.data.password,
          message: 'Compte créé avec succès'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la création du compte'
      };
    }
  };
  
  // Valeurs à exposer dans le contexte
  const value = {
    currentUser,
    playerData,
    userType,
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
