import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      
      // Vérifier si le token existe
      if (!token) {
        setIsAuthenticated(false);
        setUserType(null);
        setIsChecking(false);
        return;
      }
      
      // Si nous avons un token et un type d'utilisateur, considérer comme authentifié
      if (token && storedUserType) {
        setIsAuthenticated(true);
        setUserType(storedUserType);
      } else {
        // Si on a un token mais pas de type d'utilisateur, situation anormale
        // On nettoie le localStorage pour éviter des problèmes
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
      
      setIsChecking(false);
    };
    
    checkAuth();
    
    // On ajoute un event listener pour détecter les changements de stockage local
    // dans d'autres onglets
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userType') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]); // Re-vérifier l'authentification à chaque changement de route
  
  // Afficher un spinner pendant la vérification
  if (isChecking) {
    return (
      <div className="auth-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Vérifier que l'utilisateur accède au bon dashboard en fonction de son type
  const path = location.pathname;
  
  if (path.includes('player-dashboard') && userType !== 'player') {
    // Rediriger les non-joueurs vers leur dashboard approprié
    if (userType === 'coach') {
      return <Navigate to="/coach-dashboard" replace />;
    } else if (userType === 'parent') {
      return <Navigate to="/parent-dashboard" replace />;
    }
  } else if (path.includes('coach-dashboard') && userType !== 'coach') {
    // Rediriger les non-coachs vers leur dashboard approprié
    if (userType === 'player') {
      return <Navigate to="/player-dashboard" replace />;
    } else if (userType === 'parent') {
      return <Navigate to="/parent-dashboard" replace />;
    }
  } else if (path.includes('parent-dashboard') && userType !== 'parent') {
    // Rediriger les non-parents vers leur dashboard approprié
    if (userType === 'player') {
      return <Navigate to="/player-dashboard" replace />;
    } else if (userType === 'coach') {
      return <Navigate to="/coach-dashboard" replace />;
    }
  }
  
  // Rendre les enfants si authentifié et accès autorisé
  return children;
};

export default ProtectedRoute;
