import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faDownload, faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Payment.css';

const CheckPayment = () => {
  const location = useLocation();
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  useEffect(() => {
    // Récupérer les informations de paiement depuis la navigation
    if (location.state && location.state.paymentInfo) {
      setPaymentInfo(location.state.paymentInfo);
    } else {
      // Données de démonstration si la page est chargée directement
      setPaymentInfo({
        recipient: 'ACOS Football Academy',
        address: '123 Avenue Mohammed V, Rabat, Maroc',
        reference: 'REG-EXEMPLE',
      });
    }
  }, [location]);

  const handlePrint = () => {
    window.print();
  };

  if (!paymentInfo) {
    return <div className="container mt-5 text-center">Chargement des informations...</div>;
  }

  return (
    <div className="payment-page check-payment">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0 fs-4">Instructions pour le Paiement par Chèque</h2>
              </div>
              
              <div className="card-body p-4">
                <div className="alert alert-info mb-4">
                  <p className="mb-0">Merci pour votre inscription à l'ACOS Football Academy. Pour finaliser votre inscription, veuillez envoyer un chèque selon les instructions ci-dessous.</p>
                </div>
                
                <div className="check-info">
                  <div className="mb-4">
                    <h5 className="mb-3">1. Établir un chèque</h5>
                    <p>Veuillez établir un chèque à l'ordre de :</p>
                    <div className="recipient-info p-3 border rounded bg-light mb-3">
                      <strong>{paymentInfo.recipient}</strong>
                    </div>
                    <p className="mb-0">Montant: <strong>Le montant correspondant à la catégorie de votre enfant</strong></p>
                    <small className="text-muted">Voir les tarifs dans la brochure ou sur le site</small>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="mb-3">2. Au dos du chèque</h5>
                    <p>Veuillez écrire au verso du chèque :</p>
                    <div className="reference-info p-3 border rounded bg-light">
                      <ul className="mb-0">
                        <li>Nom et prénom de l'enfant</li>
                        <li>Sa catégorie</li>
                        <li>Référence: <strong>{paymentInfo.reference}</strong></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="mb-3">3. Envoyer le chèque par courrier à l'adresse suivante</h5>
                    <div className="address-info p-3 border rounded bg-light">
                      <p className="mb-0">
                        <strong>{paymentInfo.recipient}</strong><br />
                        {paymentInfo.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="alert alert-warning mb-4">
                    <p className="mb-0"><strong>Important:</strong> Veuillez prévoir un délai de traitement de 5 à 7 jours ouvrables. L'inscription sera validée après encaissement du chèque.</p>
                  </div>
                </div>
                
                <div className="actions-buttons d-flex justify-content-between">
                  <Link to="/registration" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Retour
                  </Link>
                  
                  <div className="d-flex">
                    <button className="btn btn-primary me-2" onClick={handlePrint}>
                      <FontAwesomeIcon icon={faPrint} className="me-2" />
                      Imprimer
                    </button>
                    <button className="btn btn-success">
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Télécharger PDF
                    </button>
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

export default CheckPayment; 