import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCalendarAlt, faChartLine, faFileAlt, 
  faSignOutAlt, faSpinner, faExclamationTriangle,
  faFutbol, faTrophy, faMapMarkerAlt, faClock,
  faEdit, faUpload, faTrash, faSave, faTimes, faClose,
  faStar, faStarHalfAlt, faCommentAlt, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/dashboard.css';
import DashboardLayout from '../layout/DashboardLayout';

// Ajout de styles CSS supplémentaires pour les nouvelles fonctionnalités
const additionalStyles = `
  .mt-4 {
    margin-top: 1.5rem;
  }
  
  .schedule-container, .matches-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .schedule-table th, .schedule-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .schedule-table th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
  
  .schedule-table tr:last-child td {
    border-bottom: none;
  }
  
  .documents-section {
    margin-bottom: 2rem;
  }
  
  .documents-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #333;
  }
  
  /* Styles pour le profil amélioré */
  .profile-header-container {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .profile-avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1.5rem;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .default-avatar-large {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
  }
  
  .profile-summary {
    flex: 1;
  }
  
  .profile-name {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .profile-badges {
    display: flex;
    gap: 0.5rem;
  }
  
  .profile-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .category-badge {
    background-color: #e3f2fd;
    color: #0d6efd;
  }
  
  .team-badge {
    background-color: #fff3cd;
    color: #ffc107;
  }
  
  /* Styles pour les performances */
  .performance-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .performance-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .performance-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .performance-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .metric-label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .metric-stars {
    margin-bottom: 0.5rem;
  }
  
  .star-icon {
    color: #ffc107;
    margin: 0 2px;
  }
  
  .star-icon.empty {
    color: #e0e0e0;
  }
  
  .metric-value {
    font-weight: 600;
    color: #0d6efd;
  }
  
  .performance-comment {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #0d6efd;
  }
  
  .performance-comment h4 {
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .performance-date {
    margin-top: 1rem;
    text-align: right;
    color: #6c757d;
  }
  
  .yellow-card-info {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .yellow-card-count {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 1rem 0;
  }
  
  .yellow-card-count span {
    color: #ffc107;
  }
  
  .yellow-card-count span.suspended {
    color: #dc3545;
  }
  
  .suspension-warning {
    text-align: center;
    color: #dc3545;
    font-weight: 600;
    padding: 0.5rem;
    background-color: #f8d7da;
    border-radius: 4px;
  }
  
  /* Styles pour les documents améliorés */
  .documents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .document-card {
    position: relative;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .document-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .document-icon-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .document-icon-large {
    font-size: 2.5rem;
    color: #0d6efd;
  }
  
  .document-image-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    height: 150px;
    overflow: hidden;
    border-radius: 4px;
  }
  
  .document-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .document-card:hover .document-thumbnail {
    transform: scale(1.05);
  }
  
  .document-edit-container {
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .document-upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: #e9ecef;
    border: 2px dashed #ced4da;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;
  }
  
  .upload-label:hover {
    background-color: #dee2e6;
    border-color: #adb5bd;
  }
  
  .upload-icon {
    font-size: 2rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
  }
  
  .file-input {
    display: none;
  }
  
  .selected-file {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #e9ecef;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .edit-actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .document-actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  
  .document-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 120px;
    text-decoration: none;
  }
  
  .document-btn svg {
    margin-right: 0.5rem;
  }
  
  .document-btn-view {
    background-color: #3498db;
    color: white;
  }
  
  .document-btn-view:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: white;
    text-decoration: none;
  }
  
  .document-btn-edit {
    background-color: #f39c12;
    color: white;
  }
  
  .document-btn-edit:hover {
    background-color: #d35400;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: white;
  }
  
  .document-btn-save {
    background-color: #27ae60;
    color: white;
  }
  
  .document-btn-save:hover {
    background-color: #2ecc71;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .document-btn-cancel {
    background-color: #95a5a6;
    color: white;
  }
  
  .document-btn-cancel:hover {
    background-color: #7f8c8d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .document-btn-add {
    background-color: #9b59b6;
    color: white;
    margin-top: 1rem;
  }
  
  .document-btn-add:hover {
    background-color: #8e44ad;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .add-document-form {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .document-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .document-success-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #27ae60;
    color: white;
    padding: 15px 25px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease-out forwards, fadeOut 0.5s ease-out 2.5s forwards;
    font-weight: 600;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  /* Styles pour la fenêtre modale d'image */
  .image-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .image-modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .image-modal-close {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #e74c3c;
    color: white;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    transition: all 0.2s ease;
  }
  
  .image-modal-close:hover {
    background-color: #c0392b;
    transform: scale(1.1);
  }
  
  .image-modal-img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    border-radius: 4px;
    object-fit: contain;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .mt-2 {
    margin-top: 0.5rem;
  }
  
  .document-info {
    flex: 1;
  }
  
  .document-info h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .document-info p {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 1rem;
  }
  
  .document-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: auto;
    margin-bottom: 0.5rem;
  }
  
  .document-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
  
  .document-status {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  
  .status-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  
  .status-valid {
    background-color: #d4edda;
    color: #28a745;
  }
  
  .status-pending {
    background-color: #fff3cd;
    color: #ffc107;
  }
  
  .documents-placeholder {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;
  }
  
  .placeholder-icon {
    margin-bottom: 1rem;
    color: #6c757d;
  }
  
  .document-requirements {
    text-align: left;
    max-width: 300px;
    margin: 1rem auto;
    padding-left: 1.5rem;
  }
  
  .document-requirements li {
    margin-bottom: 0.5rem;
  }

  
  /* Styles pour les matchs */
  .matches-header {
    margin-bottom: 1rem;
  }
  
  .matches-header h3 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .matches-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .match-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .match-past {
    border-left: 4px solid #6c757d;
  }
  
  .match-upcoming {
    border-left: 4px solid #ffc107;
  }
  
  .match-date {
    width: 80px;
    text-align: center;
    padding-right: 1rem;
    border-right: 1px solid #dee2e6;
  }
  
  .match-day {
    font-weight: 600;
    font-size: 1rem;
  }
  
  .match-time {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
  }
  
  .match-details {
    flex: 1;
    padding: 0 1rem;
  }
  
  .match-teams {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .vs {
    margin: 0 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .match-location {
    font-size: 0.85rem;
    color: #6c757d;
    text-align: center;
  }
  
  .match-result {
    width: 100px;
    text-align: center;
    padding-left: 1rem;
    border-left: 1px solid #dee2e6;
  }
  
  .result-score {
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  .result-status {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .match-win {
    color: #28a745;
  }
  
  .match-loss {
    color: #dc3545;
  }
  
  .match-draw {
    color: #6c757d;
  }
  
  .result-pending {
    font-size: 0.8rem;
    color: #6c757d;
    font-style: italic;
  }
  
  .match-upcoming-label {
    color: #ffc107;
    font-weight: 600;
    font-size: 0.9rem;
  }
`;

// Ajouter les styles au document
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [playerData, setPlayerData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [documentsInfo, setDocumentsInfo] = useState([]);
  const [storagePath, setStoragePath] = useState('');
  const [editingDocument, setEditingDocument] = useState(null);
  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [addingDocument, setAddingDocument] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [performances, setPerformances] = useState(null);
  const [yellowCards, setYellowCards] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Configurer un intercepteur global pour les erreurs
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Session expirée ou problème d'authentification
          setShowSessionExpiredModal(true);
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Supprimer l'intercepteur lors du démontage du composant
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  
  // Vérifier l'authentification et charger les données du joueur
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/player/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          console.log('Données du joueur:', response.data);
          setPlayerData({
            user: response.data.user,
            player: response.data.player,
            category: response.data.category,
            schedules: response.data.schedules || [],
            documents: response.data.documents || [],
            registration_date: response.data.registration_date,
            registration_details: response.data.registration_details
          });
          
          // Récupérer les matchs
          if (response.data.matches) {
            setMatches(response.data.matches);
          }
          
          // Récupérer les informations sur les documents
          if (response.data.documents_info) {
            setDocumentsInfo(response.data.documents_info);
            console.log('Documents info:', response.data.documents_info);
          }
          
          // Récupérer le chemin de stockage
          if (response.data.storage_path) {
            setStoragePath(response.data.storage_path);
          }
          
          // Récupérer les performances du joueur
          fetchPlayerPerformances(token, response.data.player?.id);
          
          // Récupérer les cartes jaunes pour les joueurs seniors
          if (response.data.category?.name.toLowerCase() === 'seniors') {
            fetchYellowCards(token, response.data.player?.id);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        
        // Si l'erreur est due à un token invalide, proposer de se reconnecter
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setShowSessionExpiredModal(true);
          setLoading(false);
        } else if (retryAttempts < 3) {
          // Tentative de récupération des données après une courte pause
          setTimeout(() => {
            setRetryAttempts(prev => prev + 1);
            setLoading(true);
            fetchPlayerData();
          }, 2000);
        } else {
          setError('Impossible de charger vos données. Veuillez vous reconnecter.');
          setLoading(false);
        }
      }
    };
    
    fetchPlayerData();
  }, [navigate, retryAttempts]);
  
  // Commencer à modifier un document
  const startEditDocument = (documentKey) => {
    setEditingDocument(documentKey);
    setNewDocumentFile(null);
    setUploadError('');
  };
  
  // Annuler la modification d'un document
  const cancelEditDocument = () => {
    setEditingDocument(null);
    setNewDocumentFile(null);
    setUploadError('');
  };

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };
  
  // Commencer à ajouter un nouveau document
  const startAddDocument = () => {
    setAddingDocument(true);
    setNewDocumentFile(null);
    setNewDocumentType('');
    setUploadError('');
  };
  
  // Annuler l'ajout d'un nouveau document
  const cancelAddDocument = () => {
    setAddingDocument(false);
    setNewDocumentFile(null);
    setNewDocumentType('');
    setUploadError('');
  };

  // Ajouter un nouveau document
  const handleAddDocument = async () => {
    if (!newDocumentFile || !newDocumentType) {
      setUploadError('Veuillez sélectionner un fichier et un type de document');
      return;
    }
    
    setUploadingDocument(true);
    setUploadError('');
    
    const formData = new FormData();
    formData.append('document', newDocumentFile);
    formData.append('document_key', newDocumentType);
    formData.append('player_id', playerData.player.id);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/player/add-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Document ajouté avec succès:', response.data);
        
        // Créer un nouvel objet URL pour forcer le navigateur à recharger l'image
        const timestamp = new Date().getTime();
        const imageUrl = `${response.data.url}?t=${timestamp}`;
        
        // Créer un nouvel objet document
        const newDoc = {
          key: newDocumentType,
          name: getDocumentName(newDocumentType),
          path: response.data.path,
          url: imageUrl,
          exists: true,
          extension: response.data.extension,
          type: response.data.type
        };
        
        // Ajouter le nouveau document à la liste
        setDocumentsInfo([...documentsInfo, newDoc]);
        
        // Mettre à jour également les documents dans playerData
        const updatedPlayerData = { ...playerData };
        if (!updatedPlayerData.documents) {
          updatedPlayerData.documents = {};
        }
        updatedPlayerData.documents[newDocumentType] = response.data.path;
        setPlayerData(updatedPlayerData);
        
        // Réinitialiser les états
        setAddingDocument(false);
        setNewDocumentFile(null);
        setNewDocumentType('');
        
        // Afficher un message de succès temporaire
        const successMessage = document.createElement('div');
        successMessage.className = 'document-success-message';
        successMessage.textContent = 'Document ajouté avec succès!';
        document.body.appendChild(successMessage);
        
        // Supprimer le message après 3 secondes
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);
      } else {
        setUploadError(response.data.message || 'Erreur lors de l\'ajout du document');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      setUploadError('Erreur lors de l\'ajout du document. Veuillez réessayer.');
    } finally {
      setUploadingDocument(false);
    }
  };
  
  // Mettre à jour un document
  const handleUpdateDocument = async (documentKey) => {
    if (!newDocumentFile) {
      setUploadError('Veuillez sélectionner un fichier');
      return;
    }
    
    setUploadingDocument(true);
    setUploadError('');
    
    const formData = new FormData();
    formData.append('document', newDocumentFile);
    formData.append('document_key', documentKey);
    formData.append('player_id', playerData.player.id);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/player/update-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Document mis à jour avec succès:', response.data);
        
        // Créer un nouvel objet URL pour forcer le navigateur à recharger l'image
        const timestamp = new Date().getTime();
        const imageUrl = `${response.data.url}?t=${timestamp}`;
        
        // Mettre à jour les documents dans l'état local
        const updatedDocumentsInfo = documentsInfo.map(doc => {
          if (doc.key === documentKey) {
            return {
              ...doc,
              path: response.data.path,
              url: imageUrl, // URL avec timestamp pour éviter la mise en cache
              exists: true,
              extension: response.data.extension,
              type: response.data.type
            };
          }
          return doc;
        });
        
        // Mettre à jour également les documents dans playerData
        const updatedPlayerData = { ...playerData };
        if (updatedPlayerData.documents) {
          updatedPlayerData.documents[documentKey] = response.data.path;
          setPlayerData(updatedPlayerData);
        }
        
        setDocumentsInfo(updatedDocumentsInfo);
        setEditingDocument(null);
        setNewDocumentFile(null);
        
        // Afficher un message de succès temporaire
        const successMessage = document.createElement('div');
        successMessage.className = 'document-success-message';
        successMessage.textContent = 'Document mis à jour avec succès!';
        document.body.appendChild(successMessage);
        
        // Supprimer le message après 3 secondes
        setTimeout(() => {
          if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
          }
        }, 3000);
      } else {
        setUploadError(response.data.message || 'Erreur lors de la mise à jour du document');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      setUploadError('Erreur lors de la mise à jour du document. Veuillez réessayer.');
    } finally {
      setUploadingDocument(false);
    }
  };
  
  // Gérer la déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`${apiUrl}/player/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    
    // Supprimer les données locales et rediriger
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('player');
    navigate('/login');
  };

  // Gérer la redirection vers la page de connexion
  const handleReturnToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('player');
    navigate('/login');
  };
  
  // Récupérer les performances du joueur
  const fetchPlayerPerformances = async (token, playerId) => {
    try {
      console.log('Récupération des performances pour le joueur:', playerId);
      const response = await axios.get(`${apiUrl}/players/${playerId}/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Réponse performances:', response.data);
      
      if (response.data) {
        setPerformances(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des performances:', error);
    }
  };

  // Récupérer les cartes jaunes pour les joueurs seniors
  const fetchYellowCards = async (token, playerId) => {
    try {
      const response = await axios.get(`${apiUrl}/players/${playerId}/yellow-cards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setYellowCards(response.data.yellow_cards || 0);
        setIsSuspended(response.data.yellow_cards >= 4);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cartes jaunes:', error);
    }
  };

  // Rendu des étoiles pour les évaluations
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="star-icon" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="star-icon" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star-icon empty" />);
    }
    
    return stars;
  };
  
  // Afficher le modal de session expirée
  if (showSessionExpiredModal) {
    return (
      <div className="expired-session-modal">
        <div className="expired-session-content">
          <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Session expirée</h3>
          <p>Votre session a expiré ou vous n'êtes pas autorisé à accéder à cette page. Veuillez vous reconnecter.</p>
          <button className="return-login-btn" onClick={handleReturnToLogin}>
            Retourner à la page de connexion
          </button>
        </div>
      </div>
    );
  }
  
  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="dashboard-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Chargement de votre espace membre...</p>
      </div>
    );
  }
  
  // Afficher une erreur si nécessaire
  if (error) {
    return (
      <div className="dashboard-error">
        <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
        <p>{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={handleReturnToLogin}
        >
          Retourner à la page de connexion
        </button>
      </div>
    );
  }
  
  const isSeniorPlayer = playerData?.category?.name.toLowerCase() === 'seniors';

  return (
    <DashboardLayout>
      <div className="dashboard-container player-dashboard">
        <div className="dashboard-sidebar">
          <div className="player-info">
            <div className="player-avatar">
              {playerData?.player?.photo ? (
                <img 
                  src={`${apiUrl}/storage/${playerData.player.photo}`} 
                  alt={`${playerData.user.name}`} 
                />
              ) : (
                <div className="default-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
            </div>
            <h4>{playerData?.user?.name}</h4>
            <p className="player-category">{playerData?.category?.name || 'Joueur'}</p>
            
            {isSeniorPlayer && isSuspended && (
              <div className="suspension-warning">
                <FontAwesomeIcon icon={faExclamationCircle} /> Suspendu
              </div>
            )}
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              <span>Mon profil</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
              <span>Planning</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <FontAwesomeIcon icon={faFutbol} className="nav-icon" />
              <span>Matchs</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              <span>Performances</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />
              <span>Documents</span>
            </button>
            
            <button 
              className="nav-item logout"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              <span>Déconnexion</span>
            </button>
          </nav>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'profile' && (
            <div className="dashboard-section">
              <h2>Mon profil</h2>
              

              <div className="profile-card">
                <div className="profile-header">
                  <h3>Informations personnelles</h3>
                </div>
                <div className="profile-body">
                  <div className="profile-info-row">
                    <div className="profile-info-label">Nom complet</div>
                    <div className="profile-info-value">{playerData?.user?.name}</div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Email</div>
                    <div className="profile-info-value">{playerData?.user?.email}</div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Date de naissance</div>
                    <div className="profile-info-value">
                      {playerData?.player?.birth_date ? new Date(playerData.player.birth_date).toLocaleDateString() : 'Non renseigné'}
                    </div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Catégorie</div>
                    <div className="profile-info-value">{playerData?.category?.name || 'Non assigné'}</div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Équipe</div>
                    <div className="profile-info-value">{playerData?.player?.team || 'Non assigné'}</div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Téléphone</div>
                    <div className="profile-info-value">
                      {playerData?.registration_details?.player_phone || 'Non renseigné'}
                    </div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Adresse</div>
                    <div className="profile-info-value">
                      {playerData?.registration_details?.address ? 
                        `${playerData.registration_details.address}, ${playerData.registration_details.postal_code} ${playerData.registration_details.city}` : 
                        'Non renseignée'}
                    </div>
                  </div>
                </div>
              </div>

              {playerData?.registration_details && (
                <div className="profile-card mt-4">
                  <div className="profile-header">
                    <h3>Informations d'inscription</h3>
                  </div>
                  <div className="profile-body">
                    <div className="profile-info-row">
                      <div className="profile-info-label">Date d'inscription</div>
                      <div className="profile-info-value">
                        {playerData.registration_date ? new Date(playerData.registration_date).toLocaleString() : 
                         playerData.registration_details?.created_at ? new Date(playerData.registration_details.created_at).toLocaleString() : 
                         'Non disponible'}
                      </div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Nom du parent</div>
                      <div className="profile-info-value">{playerData.registration_details.parent_name || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Email du parent</div>
                      <div className="profile-info-value">{playerData.registration_details.parent_email || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Téléphone du parent</div>
                      <div className="profile-info-value">{playerData.registration_details.parent_phone || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Adresse</div>
                      <div className="profile-info-value">{playerData.registration_details.address || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Ville</div>
                      <div className="profile-info-value">{playerData.registration_details.city || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Code postal</div>
                      <div className="profile-info-value">{playerData.registration_details.postal_code || 'Non renseigné'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Statut de l'inscription</div>
                      <div className="profile-info-value">{playerData.registration_details.status || 'En attente'}</div>
                    </div>
                    <div className="profile-info-row">
                      <div className="profile-info-label">Statut du paiement</div>
                      <div className="profile-info-value">{playerData.registration_details.payment_status || 'En attente'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <div className="dashboard-section">
              <h2>Mon planning</h2>
              {playerData?.schedules && playerData.schedules.length > 0 ? (
                <div className="schedule-container">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Jour</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Activité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerData.schedules.map((schedule, index) => (
                        <tr key={index}>
                          <td>{schedule.day}</td>
                          <td>{schedule.start_time}</td>
                          <td>{schedule.end_time}</td>
                          <td>{schedule.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="placeholder-content">
                  <p>Aucun planning n'est disponible pour votre catégorie pour le moment.</p>
                  <p>Veuillez consulter régulièrement cette page pour les mises à jour.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'matches' && (
            <div className="dashboard-section">
              <h2>Mes matchs</h2>
              {matches && matches.length > 0 ? (
                <div className="matches-container">
                  <div className="matches-header">
                    <h3>Matchs de ma catégorie ({playerData?.category?.name})</h3>
                  </div>
                  <div className="matches-list">
                    {matches.map((match, index) => {
                      // Déterminer le statut du match (passé, à venir)
                      const matchDate = new Date(match.date + ' ' + match.time);
                      const isPast = matchDate < new Date();
                      const hasResult = match.result && match.result.trim() !== '';
                      
                      // Déterminer le résultat (victoire, défaite, nul)
                      let resultStatus = '';
                      let resultClass = '';
                      
                      if (hasResult) {
                        const resultParts = match.result.split('-').map(part => parseInt(part.trim()));
                        if (resultParts.length === 2) {
                          if (resultParts[0] > resultParts[1]) {
                            resultStatus = 'Victoire';
                            resultClass = 'match-win';
                          } else if (resultParts[0] < resultParts[1]) {
                            resultStatus = 'Défaite';
                            resultClass = 'match-loss';
                          } else {
                            resultStatus = 'Match nul';
                            resultClass = 'match-draw';
                          }
                        }
                      }
                      
                      return (
                        <div className={`match-item ${isPast ? 'match-past' : 'match-upcoming'}`} key={index}>
                          <div className="match-date">
                            <div className="match-day">{new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                            <div className="match-time"><FontAwesomeIcon icon={faClock} /> {match.time}</div>
                          </div>
                          
                          <div className="match-details">
                            <div className="match-teams">
                              <span className="team-home">ACOS</span>
                              <span className="vs">VS</span>
                              <span className="team-away">{match.opponent}</span>
                            </div>
                            
                            <div className="match-location">
                              <FontAwesomeIcon icon={faMapMarkerAlt} /> {match.location}
                            </div>
                          </div>
                          
                          <div className="match-result">
                            {hasResult ? (
                              <>
                                <div className={`result-score ${resultClass}`}>
                                  {match.result}
                                </div>
                                <div className="result-status">{resultStatus}</div>
                              </>
                            ) : isPast ? (
                              <div className="result-pending">Résultat à venir</div>
                            ) : (
                              <div className="match-upcoming-label">
                                <FontAwesomeIcon icon={faFutbol} /> À venir
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="placeholder-content">
                  <p>Aucun match n'est programmé pour votre catégorie pour le moment.</p>
                  <p>Consultez régulièrement cette page pour voir les matchs à venir.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div className="dashboard-section">
              <h2>Mes performances</h2>
              
              {performances ? (
                <div className="performance-container">
                  <div className="performance-card">
                    <h3>Évaluation du coach</h3>
                    
                    <div className="performance-metrics">
                      <div className="performance-metric">
                        <div className="metric-label">Technique</div>
                        <div className="metric-stars">
                          {renderStars(performances.technique || 0)}
                        </div>
                        <div className="metric-value">{performances.technique || 0}/5</div>
                      </div>
                      
                      <div className="performance-metric">
                        <div className="metric-label">Tactique</div>
                        <div className="metric-stars">
                          {renderStars(performances.tactique || 0)}
                        </div>
                        <div className="metric-value">{performances.tactique || 0}/5</div>
                      </div>
                      
                      <div className="performance-metric">
                        <div className="metric-label">Physique</div>
                        <div className="metric-stars">
                          {renderStars(performances.physique || 0)}
                        </div>
                        <div className="metric-value">{performances.physique || 0}/5</div>
                      </div>
                      
                      <div className="performance-metric">
                        <div className="metric-label">Mental</div>
                        <div className="metric-stars">
                          {renderStars(performances.mental || 0)}
                        </div>
                        <div className="metric-value">{performances.mental || 0}/5</div>
                      </div>
                    </div>
                    
                    {performances.commentaire && (
                      <div className="performance-comment">
                        <h4><FontAwesomeIcon icon={faCommentAlt} /> Commentaire du coach</h4>
                        <p>{performances.commentaire}</p>
                      </div>
                    )}
                    
                    <div className="performance-date">
                      <small>Dernière mise à jour: {performances.updated_at ? new Date(performances.updated_at).toLocaleDateString() : 'N/A'}</small>
                    </div>
                  </div>
                  
                  {isSeniorPlayer && (
                    <div className="yellow-card-info">
                      <h3>Cartes jaunes</h3>
                      <div className="yellow-card-count">
                        <span className={yellowCards >= 4 ? 'suspended' : ''}>
                          {yellowCards} / 4
                        </span>
                      </div>
                      {yellowCards >= 4 && (
                        <div className="suspension-warning">
                          <FontAwesomeIcon icon={faExclamationCircle} /> 
                          Vous êtes suspendu pour le prochain match.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-content">
                  <p>Aucune évaluation n'a encore été enregistrée par votre coach.</p>
                  <p>Les performances seront mises à jour régulièrement au cours de la saison.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className="dashboard-section">
              <h2>Mes documents</h2>
              
              {/* Documents fournis par le joueur */}
              <div className="documents-section">
                <h3>Documents fournis lors de l'inscription</h3>
                {documentsInfo && documentsInfo.length > 0 ? (
                  <div className="documents-grid">
                    {/* Afficher les documents avec les informations détaillées */}
                    {documentsInfo.map((doc, index) => {
                       // Formater le nom du document
                       let documentName = doc.key;
                       switch(doc.key) {
                         case 'identityCard':
                           documentName = 'Carte d\'identité';
                           break;
                         case 'medicalCertificate':
                           documentName = 'Certificat médical';
                           break;
                         case 'photo':
                           documentName = 'Photo d\'identité';
                           break;
                         case 'parentAuthorization':
                           documentName = 'Autorisation parentale';
                           break;
                         case 'insuranceForm':
                           documentName = 'Formulaire d\'assurance';
                           break;
                         default:
                           documentName = doc.key.charAt(0).toUpperCase() + doc.key.slice(1).replace(/([A-Z])/g, ' $1');
                       }
                       
                       const isImage = doc.type === 'image';
                       const isPdf = doc.type === 'pdf';
                       const isEditing = editingDocument === doc.key;
                       
                       return (
                        <div className="document-card" key={`reg-doc-${index}`}>
                          {isEditing ? (
                            <div className="document-edit-container">
                              <div className="document-upload-area">
                                <label htmlFor={`file-upload-${doc.key}`} className="upload-label">
                                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                                  <span>Sélectionner un fichier</span>
                                </label>
                                <input 
                                  type="file" 
                                  id={`file-upload-${doc.key}`} 
                                  className="file-input" 
                                  onChange={(e) => setNewDocumentFile(e.target.files[0])}
                                  accept="image/*,.pdf"
                                />
                                {newDocumentFile && (
                                  <div className="selected-file">
                                    <span>{newDocumentFile.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className="edit-actions">
                                <button 
                                  className="document-btn document-btn-save"
                                  onClick={() => handleUpdateDocument(doc.key)}
                                  disabled={uploadingDocument || !newDocumentFile}
                                >
                                  <FontAwesomeIcon icon={faSave} /> Enregistrer
                                </button>
                                <button 
                                  className="document-btn document-btn-cancel"
                                  onClick={() => cancelEditDocument()}
                                  disabled={uploadingDocument}
                                >
                                  <FontAwesomeIcon icon={faTimes} /> Annuler
                                </button>
                              </div>
                              {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
                            </div>
                          ) : (
                            <>
                              {isImage && doc.exists ? (
                                <div className="document-image-container">
                                  <img 
                                    src={doc.url} 
                                    alt={documentName}
                                    className="document-thumbnail"
                                    onError={(e) => {
                                      console.error('Erreur de chargement de l\'image:', doc.url);
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/150?text=Image+non+disponible';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="document-icon-container">
                                  <FontAwesomeIcon 
                                    icon={faFileAlt} 
                                    className="document-icon-large"
                                    style={{color: isPdf ? '#e74c3c' : '#3498db'}}
                                  />
                                </div>
                              )}
                            </>
                          )}
                          <div className="document-info">
                            <h4>{documentName}</h4>
                            <p>Document fourni lors de l'inscription</p>
                            <div className="document-meta">
                              <span className="document-type">{doc.extension.toUpperCase()}</span>
                              <span className="document-date">{playerData.registration_date ? new Date(playerData.registration_date).toLocaleDateString() : 'Date inconnue'}</span>
                            </div>
                            {!doc.exists && !isEditing && (
                              <div className="document-warning">
                                <span className="text-warning">Fichier non disponible sur le serveur</span>
                              </div>
                            )}
                          </div>
                          {!isEditing && (
                            <div className="document-actions">
                              {doc.exists && (
                                isImage ? (
                                  <button 
                                    className="document-btn document-btn-view" 
                                    onClick={() => openImageModal(doc.url)}
                                  >
                                    <FontAwesomeIcon icon={faFileAlt} /> Voir
                                  </button>
                                ) : (
                                  <a href={doc.url} className="document-btn document-btn-view" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faFileAlt} /> Télécharger
                                  </a>
                                )
                              )}
                              <button 
                                className="document-btn document-btn-edit"
                                onClick={() => startEditDocument(doc.key)}
                              >
                                <FontAwesomeIcon icon={faEdit} /> Modifier
                              </button>
                            </div>
                          )}
                          <div className="document-status">
                            <span className={`status-badge ${doc.exists ? 'status-valid' : 'status-warning'}`}>
                              {doc.exists ? 'Validé' : 'Non disponible'}
                            </span>
                          </div>
                        </div>
                       );
                     })}
                  </div>
                ) : (
                  <div className="documents-placeholder">
                    <div className="placeholder-icon">
                      <FontAwesomeIcon icon={faFileAlt} size="3x" />
                    </div>
                    <p>Vous n'avez pas encore fourni de documents lors de votre inscription.</p>
                    <p>Les documents requis peuvent inclure :</p>
                    <ul className="document-requirements">
                      <li>Certificat médical</li>
                      <li>Copie de la carte d'identité</li>
                      <li>Photo d'identité</li>
                      <li>Autorisation parentale (pour les mineurs)</li>
                    </ul>
                  </div>
                )}
              </div>
              

            </div>
          )}
        </div>
        {/* Modal pour afficher les images */}
        {modalImage && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="image-modal-close" onClick={closeImageModal}>
                <FontAwesomeIcon icon={faClose} />
              </button>
              <img src={modalImage} alt="Document" className="image-modal-img" />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlayerDashboard;
