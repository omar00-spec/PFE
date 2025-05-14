import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Payment.css';

const PaymentCancel = () => {
  return (
    <div className="payment-page payment-cancel">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-warning text-dark">
                <h2 className="mb-0 fs-4">Paiement annulé</h2>
              </div>
              
              <div className="card-body p-4 text-center">
                <div className="cancel-content py-5">
                  <FontAwesomeIcon icon={faTimes} size="4x" className="text-warning mb-4" />
                  <h3 className="mb-3">Votre paiement a été annulé</h3>
                  <p className="lead mb-4">
                    Vous avez annulé le processus de paiement. Aucun montant n'a été débité de votre compte.
                  </p>
                  
                  <div className="alert alert-info mb-4">
                    <p className="mb-0">Votre inscription sera conservée mais restera en attente jusqu'à ce que le paiement soit complété.</p>
                  </div>
                  
                  <div className="d-flex justify-content-center">
                    <Link to="/inscription" className="btn btn-outline-secondary me-3">
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Retour à l'inscription
                    </Link>
                    <Link to="/" className="btn btn-primary">
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Accueil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 