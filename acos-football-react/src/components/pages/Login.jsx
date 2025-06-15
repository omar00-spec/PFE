import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faChalkboardTeacher, faUsers } from '@fortawesome/free-solid-svg-icons';
import PlayerLoginForm from '../auth/PlayerLoginForm';
import CoachLoginForm from '../auth/CoachLoginForm';
import ParentLoginForm from '../auth/ParentLoginForm';
import '../../styles/auth.css';

const Login = () => {
  const location = useLocation();
  const [userType, setUserType] = useState('player');

  // Récupérer le type d'utilisateur du state de navigation ou du localStorage
  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    } else {
      const storedUserType = localStorage.getItem('userType');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    }
  }, [location]);

  // Sauvegarder le type d'utilisateur dans le localStorage
  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // Changer le type d'utilisateur
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // Afficher le formulaire approprié en fonction du type d'utilisateur
  const renderLoginForm = () => {
    switch (userType) {
      case 'coach':
        return <CoachLoginForm />;
      case 'parent':
        return <ParentLoginForm />;
      default:
        return <PlayerLoginForm />;
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Espace Membre</h2>
          <p>Connectez-vous à votre espace personnel</p>
        </div>
        
        <div className="user-type-selector">
          <button 
            className={`user-type-btn ${userType === 'player' ? 'active player' : ''}`}
            onClick={() => handleUserTypeChange('player')}
          >
            <FontAwesomeIcon icon={faUserAlt} className="user-type-icon" />
            <span>Joueur</span>
          </button>
          
          <button 
            className={`user-type-btn ${userType === 'coach' ? 'active coach' : ''}`}
            onClick={() => handleUserTypeChange('coach')}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} className="user-type-icon" />
            <span>Coach</span>
          </button>
          
          <button 
            className={`user-type-btn ${userType === 'parent' ? 'active parent' : ''}`}
            onClick={() => handleUserTypeChange('parent')}
          >
            <FontAwesomeIcon icon={faUsers} className="user-type-icon" />
            <span>Parent</span>
          </button>
        </div>
        
        <div className="login-form-wrapper">
          {renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
