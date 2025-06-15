import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faPaperPlane, faUpload, faFile, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/RegistrationForm.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    playerName: '',
    playerFirstName: '',
    birthDate: '',
    category: '',
    address: '',
    city: '',
    playerPhone: '',
    playerEmail: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    documents: {
      medicalCertificate: null,
      idPhoto: null,
      idCopy: null,
      paymentProof: null
    },
    paymentMethod: '',
    acceptTerms: false
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    loading: false,
    message: ''
  });

  // État pour suivre les noms de fichiers téléchargés
  const [fileNames, setFileNames] = useState({
    medicalCertificate: '',
    idPhoto: '',
    idCopy: '',
    paymentProof: ''
  });

  // Effet pour nettoyer les écouteurs d'événements à la fin
  useEffect(() => {
    // Empêcher les redirections accidentelles
    const handleBeforeUnload = (e) => {
      if (formStatus.loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formStatus.loading]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (type === 'file') {
      // Extrait le nom du document à partir de l'ID
      const docType = name.split('-')[1];
      
      if (files.length > 0) {
        // Mettre à jour le nom du fichier
        setFileNames({
          ...fileNames,
          [docType]: files[0].name
        });
        
        // Stocker le fichier dans formData
        setFormData({
          ...formData,
          documents: {
            ...formData.documents,
            [docType]: files[0]
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    // Empêcher le comportement par défaut
    e.preventDefault();
    
    // Validation
    if (!formData.playerName || !formData.playerFirstName || !formData.birthDate || !formData.category) {
      setFormStatus({
        submitted: false,
        error: true,
        loading: false,
        message: 'Veuillez remplir tous les champs obligatoires (*)'
      });
      return;
    }
    
    if (!formData.acceptTerms) {
      setFormStatus({
        submitted: false,
        error: true,
        loading: false,
        message: 'Vous devez accepter les conditions pour finaliser l\'inscription'
      });
      return;
    }
    
    // Indiquer le chargement
    setFormStatus({
      submitted: false,
      error: false,
      loading: true,
      message: 'Envoi en cours...'
    });
    
    // Préparation des données pour l'envoi
    const data = new FormData();
    
    // Ajouter les données du joueur
    Object.keys(formData).forEach(key => {
      if (key !== 'documents') {
        data.append(key, formData[key]);
      }
    });
    
    // Ajouter les fichiers
    Object.keys(formData.documents).forEach(docType => {
      if (formData.documents[docType]) {
        data.append(`documents[${docType}]`, formData.documents[docType]);
      }
    });
    
    try {
      // Envoi de la requête
      const response = await axios.post(`${apiUrl}/registrations`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Traitement de la réponse
      if (response.data.success) {
        // Si redirection nécessaire
        if (response.data.redirect) {
          // Rediriger vers la page correspondante
          switch (formData.paymentMethod) {
            case 'Virement bancaire':
              // Utiliser navigate de react-router au lieu de window.location
              navigate('/payment/bank-transfer', { 
                state: { registration_id: response.data.registration_id } 
              });
              break;
              
            case 'Chèque':
              navigate('/payment/check', { 
                state: { paymentInfo: response.data.payment_info } 
              });
              break;
              
            default:
              // Afficher le succès
              setFormStatus({
                submitted: true,
                error: false,
                loading: false,
                message: 'Votre demande d\'inscription a été envoyée avec succès! Nous vous contacterons bientôt pour confirmer l\'inscription.'
              });
          }
        } else {
          // Afficher le succès sans redirection
          setFormStatus({
            submitted: true,
            error: false,
            loading: false,
            message: 'Votre demande d\'inscription a été envoyée avec succès! Nous vous contacterons bientôt pour confirmer l\'inscription.'
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      
      // Afficher l'erreur
      setFormStatus({
        submitted: false,
        error: true,
        loading: false,
        message: error.response?.data?.errors ? 'Veuillez corriger les erreurs dans le formulaire.' : 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ultérieurement.'
      });
    }
  };

  const resetForm = () => {
    // Réinitialiser le formulaire
    setFormData({
      playerName: '',
      playerFirstName: '',
      birthDate: '',
      category: '',
      address: '',
      city: '',
      playerPhone: '',
      playerEmail: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      documents: {
        medicalCertificate: null,
        idPhoto: null,
        idCopy: null,
        paymentProof: null
      },
      paymentMethod: '',
      acceptTerms: false
    });
    
    // Réinitialiser les noms de fichiers
    setFileNames({
      medicalCertificate: '',
      idPhoto: '',
      idCopy: '',
      paymentProof: ''
    });
    
    // Réinitialiser le statut
    setFormStatus({
      submitted: false,
      error: false,
      loading: false,
      message: ''
    });
  };

  const downloadPdfForm = (e) => {
    // In a real application, this would link to a PDF file
    alert('Téléchargement du formulaire PDF...');
  };

  return (
    <div className="registration-form-container">
      <div className="form-header mb-4">
        <div className="pdf-download">
          <button onClick={downloadPdfForm} className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Télécharger le formulaire PDF
          </button>
        </div>
      </div>
      
      {formStatus.submitted ? (
        <div className="submission-success">
          <h4 className="text-success mb-3"><FontAwesomeIcon icon={faPaperPlane} className="me-2" />Demande Envoyée!</h4>
          <p>{formStatus.message}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={resetForm}
          >
            Nouvelle inscription
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="registration-form">
          {formStatus.error && (
            <div className="alert alert-danger mb-4">{formStatus.message}</div>
          )}
          
          {formStatus.loading && (
            <div className="alert alert-info mb-4">
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              {formStatus.message}
            </div>
          )}
          
          <h4 className="form-section-title">📝 Formulaire d'inscription – Saison 2025/2026</h4>
          
          <div className="form-section">
            <h5>Informations du joueur :</h5>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="playerName" className="form-label">Nom <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="playerName"
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="playerFirstName" className="form-label">Prénom <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="playerFirstName"
                  name="playerFirstName"
                  value={formData.playerFirstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="birthDate" className="form-label">Date de naissance <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">Catégorie <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="1">U5</option>
                  <option value="2">U7</option>
                  <option value="3">U9</option>
                  <option value="4">U11</option>
                  <option value="5">U13</option>
                  <option value="6">U15</option>
                  <option value="7">U17</option>
                  <option value="8">U19</option>
                  <option value="9">SENIOR</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Adresse</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="city" className="form-label">Ville</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="playerPhone" className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="playerPhone"
                  name="playerPhone"
                  value={formData.playerPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="playerEmail" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="playerEmail"
                  name="playerEmail"
                  value={formData.playerEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section mt-4">
            <h5>Parent / Responsable légal :</h5>
            
            <div className="mb-3">
              <label htmlFor="parentName" className="form-label">Nom / Prénom</label>
              <input
                type="text"
                className="form-control"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="parentPhone" className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="parentEmail" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="parentEmail"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section mt-4">
            <h5>Documents requis :</h5>
            <p className="text-muted mb-3">Veuillez fournir les documents suivants (format PDF, JPG ou PNG, max 2MB)</p>
            
            <div className="row">
              <div className="col-md-6">
              <div className="document-upload-item mb-3">
                <label htmlFor="document-medicalCertificate" className="form-label">Certificat médical</label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document-medicalCertificate"
                    name="document-medicalCertificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                  <label className="input-group-text" htmlFor="document-medicalCertificate">
                    <FontAwesomeIcon icon={faUpload} />
                  </label>
                </div>
                {fileNames.medicalCertificate && (
                  <div className="file-info mt-2">
                    <FontAwesomeIcon icon={faFile} className="text-primary me-2" />
                    <span>{fileNames.medicalCertificate}</span>
                    {formData.documents.medicalCertificate && (
                      <span className="text-success ms-2">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                )}
                </div>
              </div>
              
              <div className="col-md-6">
              <div className="document-upload-item mb-3">
                <label htmlFor="document-idPhoto" className="form-label">Photo d'identité</label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document-idPhoto"
                    name="document-idPhoto"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                  <label className="input-group-text" htmlFor="document-idPhoto">
                    <FontAwesomeIcon icon={faUpload} />
                  </label>
                </div>
                {fileNames.idPhoto && (
                  <div className="file-info mt-2">
                    <FontAwesomeIcon icon={faFile} className="text-primary me-2" />
                    <span>{fileNames.idPhoto}</span>
                    {formData.documents.idPhoto && (
                      <span className="text-success ms-2">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                )}
                </div>
              </div>
              </div>
              
            <div className="row">
              <div className="col-md-6">
              <div className="document-upload-item mb-3">
                  <label htmlFor="document-idCopy" className="form-label">Copie pièce d'identité</label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document-idCopy"
                    name="document-idCopy"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                  <label className="input-group-text" htmlFor="document-idCopy">
                    <FontAwesomeIcon icon={faUpload} />
                  </label>
                </div>
                {fileNames.idCopy && (
                  <div className="file-info mt-2">
                    <FontAwesomeIcon icon={faFile} className="text-primary me-2" />
                    <span>{fileNames.idCopy}</span>
                    {formData.documents.idCopy && (
                      <span className="text-success ms-2">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                )}
                </div>
              </div>
              
              <div className="col-md-6">
              <div className="document-upload-item mb-3">
                <label htmlFor="document-paymentProof" className="form-label">Justificatif de paiement</label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document-paymentProof"
                    name="document-paymentProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                  <label className="input-group-text" htmlFor="document-paymentProof">
                    <FontAwesomeIcon icon={faUpload} />
                  </label>
                </div>
                {fileNames.paymentProof && (
                  <div className="file-info mt-2">
                    <FontAwesomeIcon icon={faFile} className="text-primary me-2" />
                    <span>{fileNames.paymentProof}</span>
                    {formData.documents.paymentProof && (
                      <span className="text-success ms-2">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section mt-4">
            <h5>Moyens de paiement :</h5>
            
            <div className="payment-methods">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentCash"
                  value="Espèces"
                  checked={formData.paymentMethod === 'Espèces'}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="paymentCash">Espèces</label>
              </div>
              
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentCheck"
                  value="Chèque"
                  checked={formData.paymentMethod === 'Chèque'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="paymentCheck">Chèque</label>
              </div>
              
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="paymentTransfer"
                  value="Virement bancaire"
                  checked={formData.paymentMethod === 'Virement bancaire'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="paymentTransfer">Virement bancaire</label>
              </div>
            </div>
          </div>
          
          <div className="form-section mt-4">
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                J'accepte les conditions d'inscription et autorise mon enfant à participer aux activités de l'ACOS Football Academy.
              </label>
            </div>
            
            <div className="signature-section">
              <p className="mb-2">Signature du parent / responsable : _____________________________</p>
              <p className="mb-0">Date : ___ / ___ /2024</p>
            </div>
          </div>
          
          <div className="form-actions mt-4 text-center">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={formStatus.loading}
            >
              {formStatus.loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Envoyer ma demande d'inscription
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm; 