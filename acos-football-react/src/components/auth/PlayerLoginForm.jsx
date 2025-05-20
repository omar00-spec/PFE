import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/auth.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const PlayerLoginForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // État pour le formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  // État pour le formulaire d'inscription
  const [registerForm, setRegisterForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  
  // État pour les messages de statut
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
    generatedPassword: ''
  });
  
  // Gérer le changement de formulaire de connexion
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Gérer le changement de formulaire d'inscription
  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Soumettre le formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: '', success: '' });
    
    try {
      const response = await axios.post(`${apiUrl}/player/login`, loginForm);
      
      if (response.data.success) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('player', JSON.stringify(response.data.player));
        
        setStatus({
          ...status,
          loading: false,
          success: 'Connexion réussie! Redirection...'
        });
        
        // Rediriger vers l'espace membre
        setTimeout(() => {
          navigate('/espace-membre');
        }, 1500);
      }
    } catch (error) {
      setStatus({
        ...status,
        loading: false,
        error: error.response?.data?.message || 'Erreur lors de la connexion'
      });
    }
  };
  
  // Soumettre le formulaire d'inscription
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: '', success: '' });
    
    try {
      const response = await axios.post(`${apiUrl}/player/check-and-register`, registerForm);
      
      if (response.data.success) {
        setStatus({
          ...status,
          loading: false,
          success: 'Compte créé avec succès! Vous pouvez maintenant vous connecter.',
          generatedPassword: response.data.password
        });
        
        // Passer à l'onglet de connexion après un délai
        setTimeout(() => {
          setActiveTab('login');
          setLoginForm({
            email: registerForm.email,
            password: ''
          });
        }, 5000);
      }
    } catch (error) {
      setStatus({
        ...status,
        loading: false,
        error: error.response?.data?.message || 'Erreur lors de la vérification du joueur'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Connexion
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Première connexion
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <div className="auth-form-container">
            <h3>Connexion Joueur</h3>
            <p className="auth-subtitle">Accédez à votre espace membre</p>
            
            {status.error && (
              <div className="alert alert-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {status.error}
              </div>
            )}
            
            {status.success && (
              <div className="alert alert-success">
                {status.success}
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={status.loading}
              >
                {status.loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Connexion en cours...
                  </>
                ) : 'Se connecter'}
              </button>
              
              <div className="text-center mt-3">
                <a href="/mot-de-passe-oublie" className="text-decoration-none">
                  Mot de passe oublié ?
                </a>
              </div>
            </form>
            
            <p className="mt-3 text-center">
              <a href="#" onClick={() => setActiveTab('register')}>
                Première connexion ? Créez votre compte
              </a>
            </p>
          </div>
        ) : (
          <div className="auth-form-container">
            <h3>Première connexion</h3>
            <p className="auth-subtitle">Créez votre compte joueur</p>
            
            {status.error && (
              <div className="alert alert-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {status.error}
              </div>
            )}
            
            {status.success && (
              <div className="alert alert-success">
                {status.success}
                {status.generatedPassword && (
                  <div className="generated-password mt-2">
                    <p><strong>Votre mot de passe généré:</strong></p>
                    <div className="password-box">
                      {status.generatedPassword}
                    </div>
                    <p className="mt-2 small">
                      <strong>Important:</strong> Notez ce mot de passe, vous en aurez besoin pour vous connecter.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    name="firstname"
                    value={registerForm.firstname}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    name="lastname"
                    value={registerForm.lastname}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-info alert alert-info">
                <p className="mb-0 small">
                  <strong>Note:</strong> Vous devez être déjà inscrit à l'académie pour créer un compte. 
                  Votre prénom et nom doivent correspondre exactement à ceux utilisés lors de votre inscription.
                </p>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={status.loading}
              >
                {status.loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Vérification en cours...
                  </>
                ) : 'Créer mon compte'}
              </button>
            </form>
            
            <p className="mt-3 text-center">
              <a href="#" onClick={() => setActiveTab('login')}>
                Déjà un compte ? Connectez-vous
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerLoginForm;
