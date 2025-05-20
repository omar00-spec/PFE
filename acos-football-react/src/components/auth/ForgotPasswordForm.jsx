import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/auth.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: '',
    resetUrl: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        ...status,
        error: 'Veuillez saisir votre adresse email.'
      });
      return;
    }
    
    setStatus({
      loading: true,
      success: false,
      error: ''
    });
    
    try {
      const response = await axios.post(`${apiUrl}/password/email`, { email });
      
      if (response.data.success) {
        setStatus({
          loading: false,
          success: true,
          error: '',
          resetUrl: response.data.reset_url // Stocker l'URL de réinitialisation dans l'état
        });
        
        // En développement, afficher l'URL de réinitialisation dans la console aussi
        console.log('URL de réinitialisation:', response.data.reset_url);
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi de l\'email.'
      });
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form-container">
          <h3>Mot de passe oublié</h3>
          <p className="auth-subtitle">Saisissez votre adresse email pour réinitialiser votre mot de passe</p>
          
          {status.error && (
            <div className="alert alert-danger">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {status.error}
            </div>
          )}
          
          {status.success ? (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
              Un email contenant les instructions pour réinitialiser votre mot de passe a été envoyé à {email}.
              <p className="mt-2 mb-0">Vérifiez votre boîte de réception et suivez les instructions.</p>
              
              {/* Afficher l'URL de réinitialisation en mode développement */}
              {status.resetUrl && (
                <div className="mt-3 p-3 bg-light border rounded">
                  <p className="mb-1"><strong>URL de réinitialisation (mode développement) :</strong></p>
                  <a href={status.resetUrl} className="d-block text-break">
                    {status.resetUrl}
                  </a>
                  <p className="mt-2 mb-0 small text-muted">Cliquez sur le lien ci-dessus pour réinitialiser votre mot de passe.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Envoi en cours...
                  </>
                ) : 'Envoyer les instructions'}
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

export default ForgotPasswordForm;
