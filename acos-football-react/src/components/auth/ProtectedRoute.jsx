import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  // Afficher un spinner pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="auth-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Rendre les enfants si authentifié
  return children;
};

export default ProtectedRoute;
