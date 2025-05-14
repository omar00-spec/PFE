import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faHome } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/Payment.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Vérifier l'état du paiement
    const checkPaymentStatus = async () => {
      if (!sessionId) {
        setError("Information de paiement manquante");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.post(`${apiUrl}/payment/check-status`, {
          session_id: sessionId
        });
        
        if (response.data.success && response.data.paid) {
          setPaymentVerified(true);
        } else {
          setError("Le paiement n'a pas pu être vérifié. Veuillez contacter notre service client.");
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du paiement:', err);
        setError(err.response?.data?.message || "Une erreur est survenue lors de la vérification du paiement");
      } finally {
        setLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [sessionId]);
  
  return (
    <div className="payment-page payment-success">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h2 className="mb-0 fs-4">
                  {loading ? "Vérification du paiement" : paymentVerified ? "Paiement réussi" : "État du paiement"}
                </h2>
              </div>
              
              <div className="card-body p-4 text-center">
                {loading ? (
                  <div className="py-5">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
                    <h4 className="mt-3">Vérification de votre paiement...</h4>
                    <p className="text-muted">Merci de patienter pendant que nous confirmons votre transaction.</p>
                  </div>
                ) : error ? (
                  <div className="py-5">
                    <div className="alert alert-danger">
                      <p className="mb-0">{error}</p>
                    </div>
                    <div className="mt-4">
                      <Link to="/contact" className="btn btn-primary">
                        Contacter le support
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="success-content py-5">
                    <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success mb-4" />
                    <h3 className="mb-3">Paiement confirmé !</h3>
                    <p className="lead mb-4">
                      Merci pour votre inscription à l'ACOS Football Academy. Votre paiement a été traité avec succès.
                    </p>
                    <div className="alert alert-info">
                      <p className="mb-0">Vous recevrez sous peu un e-mail de confirmation avec tous les détails de votre inscription.</p>
                    </div>
                    
                    <div className="mt-5">
                      <Link to="/" className="btn btn-primary btn-lg">
                        <FontAwesomeIcon icon={faHome} className="me-2" />
                        Retour à l'accueil
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 