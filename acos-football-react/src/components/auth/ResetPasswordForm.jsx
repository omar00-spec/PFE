import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/auth.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });
  
  // Extraire le token et l'email de l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    
    if (token && email) {
      setFormData(prev => ({
        ...prev,
        token,
        email
      }));
    } else {
      setStatus({
        loading: false,
        success: false,
        error: 'Lien de réinitialisation invalide. Veuillez demander un nouveau lien.'
      });
    }
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setStatus({
        ...status,
        error: 'Les mots de passe ne correspondent pas.'
      });
      return;
    }
    
    if (formData.password.length < 8) {
      setStatus({
        ...status,
        error: 'Le mot de passe doit contenir au moins 8 caractères.'
      });
      return;
    }
    
    setStatus({
      loading: true,
      success: false,
      error: ''
    });
    
    try {
      const response = await axios.post(`${apiUrl}/password/reset`, formData);
      
      if (response.data.success) {
        setStatus({
          loading: false,
          success: true,
          error: ''
        });
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
      });
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form-container">
          <h3>Réinitialisation du mot de passe</h3>
          <p className="auth-subtitle">Définissez votre nouveau mot de passe</p>
          
          {status.error && (
            <div className="alert alert-danger">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {status.error}
            </div>
          )}
          
          {status.success ? (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              Votre mot de passe a été réinitialisé avec succès.
              <p className="mt-2 mb-0">Vous allez être redirigé vers la page de connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nouveau mot de passe"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                    placeholder="Confirmer le mot de passe"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
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
                    Réinitialisation en cours...
                  </>
                ) : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}
          
          <p className="mt-3 text-center">
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
