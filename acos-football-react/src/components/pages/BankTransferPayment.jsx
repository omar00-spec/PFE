import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/Payment.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const BankTransferPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  
  useEffect(() => {
    // Récupérer l'ID d'inscription depuis la navigation
    if (location.state && location.state.registration_id) {
      setRegistrationId(location.state.registration_id);
    } else {
      setError("Information d'inscription manquante. Veuillez réessayer.");
    }
  }, [location]);

  const handleStripeCheckout = async () => {
    if (!registrationId) {
      setError("Information d'inscription manquante. Veuillez réessayer.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Créer une session de paiement avec Stripe
      const response = await axios.post(`${apiUrl}/payment/bank-transfer/create-session`, {
        registration_id: registrationId
      });
      
      if (response.data.success && response.data.checkout_url) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = response.data.checkout_url;
      } else {
        setError("Impossible de créer la session de paiement. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Erreur lors de la création de la session de paiement:', err);
      setError(err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer ultérieurement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page bank-transfer">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0 fs-4">Paiement par Virement Bancaire</h2>
              </div>
              
              <div className="card-body p-4">
                <div className="alert alert-info mb-4">
                  <p className="mb-0">Vous avez choisi de payer par virement bancaire. Pour finaliser votre inscription, vous allez être redirigé vers une page de paiement sécurisée.</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger mb-4">
                    <p className="mb-0">{error}</p>
                  </div>
                )}
                
                <div className="text-center my-5">
                  <button 
                    className="btn btn-primary btn-lg" 
                    onClick={handleStripeCheckout}
                    disabled={loading || !registrationId}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Préparation du paiement...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                        Procéder au paiement sécurisé
                      </>
                    )}
                  </button>
                  
                  <div className="mt-3 text-muted small">
                    Vous allez être redirigé vers notre prestataire de paiement sécurisé.
                  </div>
                </div>
                
                <div className="alert alert-warning mb-4">
                  <p className="mb-0"><strong>Important:</strong> Après avoir effectué le paiement, vous recevrez une confirmation. Votre inscription sera alors validée automatiquement.</p>
                </div>
                
                <div className="actions-buttons d-flex justify-content-between">
                  <Link to="/inscription" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Retour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferPayment; 