import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCalendarAlt, faChartLine, faFileAlt, 
  faSignOutAlt, faSpinner, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/dashboard.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
          setPlayerData({
            user: response.data.user,
            player: response.data.player,
            category: response.data.category
          });
        }
        setLoading(false);
      } catch (error) {
        setError('Impossible de charger vos données. Veuillez vous reconnecter.');
        setLoading(false);
        
        // Si l'erreur est due à un token invalide, déconnecter l'utilisateur
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };
    
    fetchPlayerData();
  }, [navigate]);
  
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
          onClick={() => navigate('/login')}
        >
          Retourner à la page de connexion
        </button>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
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
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div className="dashboard-section">
            <h2>Mon planning</h2>
            <div className="placeholder-content">
              <p>Votre planning personnalisé sera bientôt disponible.</p>
              <p>Vous pourrez consulter vos entraînements et matchs à venir.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="dashboard-section">
            <h2>Mes performances</h2>
            <div className="placeholder-content">
              <p>Le suivi de vos performances sera bientôt disponible.</p>
              <p>Vous pourrez suivre votre progression et vos statistiques.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="dashboard-section">
            <h2>Mes documents</h2>
            <div className="documents-list">
              <div className="document-item">
                <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                <div className="document-info">
                  <h4>Règlement intérieur</h4>
                  <p>Règlement de l'académie à respecter par tous les joueurs</p>
                </div>
                <a href="#" className="btn btn-sm btn-primary">Télécharger</a>
              </div>
              
              <div className="document-item">
                <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                <div className="document-info">
                  <h4>Planning général</h4>
                  <p>Planning des entraînements pour toutes les catégories</p>
                </div>
                <a href="#" className="btn btn-sm btn-primary">Télécharger</a>
              </div>
              
              <div className="document-item">
                <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                <div className="document-info">
                  <h4>Autorisation parentale</h4>
                  <p>Document à faire signer par les parents pour les mineurs</p>
                </div>
                <a href="#" className="btn btn-sm btn-primary">Télécharger</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
