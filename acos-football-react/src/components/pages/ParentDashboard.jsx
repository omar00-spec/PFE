import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCalendarAlt, faFileAlt, faCreditCard, faChild, faUsers, 
  faChartLine, faStar, faStarHalfAlt, faCommentAlt, faExclamationCircle,
  faSquare, faTrophy
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/dashboard.css';
import DashboardLayout from '../layout/DashboardLayout';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedChild, setSelectedChild] = useState(null);
  const [childPerformance, setChildPerformance] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [yellowCards, setYellowCards] = useState({});

  useEffect(() => {
    const fetchParentData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(`${apiUrl}/parent/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setParentData(response.data);
          if (response.data.players && response.data.players.length > 0) {
            const firstChild = response.data.players[0];
            setSelectedChild(firstChild);
            
            // Extraire les performances des données de l'enfant si disponibles
            if (firstChild.performance) {
              setChildPerformance(firstChild.performance);
            } else {
              setChildPerformance(null);
            }
            
            // Extraire les cartes jaunes des données des enfants
            const yellowCardsData = {};
            response.data.players.forEach(player => {
              yellowCardsData[player.id] = player.yellow_cards || 0;
            });
            setYellowCards(yellowCardsData);
          }
        } else {
          setError('Erreur lors du chargement des données');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.response?.data?.message || 'Erreur de connexion au serveur');
        
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('players');
          localStorage.removeItem('registrations');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchParentData();
  }, [navigate]);

  const fetchChildPerformance = async (token, childId) => {
    setLoadingPerformance(true);
    try {
      const response = await axios.get(`${apiUrl}/players/${childId}/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setChildPerformance(response.data);
      } else {
        setChildPerformance(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des performances:', error);
      setChildPerformance(null);
    } finally {
      setLoadingPerformance(false);
    }
  };

  const fetchYellowCards = async (token, playerId) => {
    try {
      const response = await axios.get(`${apiUrl}/players/${playerId}/yellow-cards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        return response.data.yellow_cards || 0;
      }
      return 0;
    } catch (error) {
      console.error('Erreur lors du chargement des cartes jaunes:', error);
      return 0;
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    
    // Extraire les performances des données de l'enfant si disponibles
    if (child.performance) {
      setChildPerformance(child.performance);
    } else {
      setChildPerformance(null);
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement de votre espace parent...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="alert alert-danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login')}
          >
            Retour à la page de connexion
          </button>
        </div>
      </div>
    );
  }

  const isChildSenior = selectedChild?.category?.name.toLowerCase() === 'seniors';
  const childYellowCards = yellowCards[selectedChild?.id] || 0;
  const isChildSuspended = isChildSenior && childYellowCards >= 4;

  return (
    <DashboardLayout>
      <div className="dashboard-container parent-dashboard">
        <div className="dashboard-header">
          <h1>Espace Parent</h1>
          <p>Bienvenue, {parentData?.user?.name}</p>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <div className="profile-card">
              <div className="profile-image">
                <FontAwesomeIcon icon={faUsers} size="3x" />
              </div>
              <div className="profile-info">
                <h3>{parentData?.user?.name}</h3>
                <p>{parentData?.players?.length || 0} enfant(s) inscrit(s)</p>
              </div>
            </div>
            
            <div className="dashboard-nav">
              <button 
                className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Mon Profil</span>
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'children' ? 'active' : ''}`}
                onClick={() => setActiveTab('children')}
              >
                <FontAwesomeIcon icon={faChild} />
                <span>Mes Enfants</span>
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'performance' ? 'active' : ''}`}
                onClick={() => setActiveTab('performance')}
              >
                <FontAwesomeIcon icon={faChartLine} />
                <span>Performances</span>
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Planning</span>
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <FontAwesomeIcon icon={faFileAlt} />
                <span>Documents</span>
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Paiements</span>
              </button>
            </div>
          </div>
          
          <div className="dashboard-main">
            {activeTab === 'profile' && (
              <div className="dashboard-section">
                <h2>Mon Profil</h2>
                <div className="profile-details">
                  <div className="profile-info-row">
                    <div className="profile-info-label">Nom</div>
                    <div className="profile-info-value">{parentData?.user?.name}</div>
                  </div>
                  <div className="profile-info-row">
                    <div className="profile-info-label">Email</div>
                    <div className="profile-info-value">{parentData?.user?.email}</div>
                  </div>
                  {parentData?.registrations && parentData.registrations.length > 0 && (
                    <div className="profile-info-row">
                      <div className="profile-info-label">Téléphone</div>
                      <div className="profile-info-value">{parentData.registrations[0].parent_phone || 'Non renseigné'}</div>
                    </div>
                  )}
                  <div className="profile-info-row">
                    <div className="profile-info-label">Enfants inscrits</div>
                    <div className="profile-info-value">
                      {parentData?.players?.length > 0 ? (
                        <ul className="list-unstyled">
                          {parentData.players.map(player => (
                            <li key={player.id}>
                              {player.name} - {player.category?.name || 'Catégorie non assignée'}
                              {player.category?.name.toLowerCase() === 'seniors' && yellowCards[player.id] >= 4 && (
                                <span className="suspended-badge ms-2">
                                  <FontAwesomeIcon icon={faExclamationCircle} /> Suspendu
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Aucun enfant inscrit'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'children' && (
              <div className="dashboard-section">
                <h2>Mes Enfants</h2>
                {parentData?.players && parentData.players.length > 0 ? (
                  <div className="children-container">
                    <div className="children-list">
                      {parentData.players.map(player => (
                        <div 
                          key={player.id} 
                          className={`child-item ${selectedChild?.id === player.id ? 'active' : ''}`}
                          onClick={() => handleChildSelect(player)}
                        >
                          <div className="child-avatar">
                            <FontAwesomeIcon icon={faChild} />
                          </div>
                          <div className="child-info">
                            <h4>{player.name}</h4>
                            <p>{player.category?.name || 'Catégorie non assignée'}</p>
                            {player.category?.name.toLowerCase() === 'seniors' && yellowCards[player.id] >= 4 && (
                              <span className="suspended-badge">
                                <FontAwesomeIcon icon={faExclamationCircle} /> Suspendu
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedChild && (
                      <div className="child-details">
                        <h3>{selectedChild.name}</h3>
                        <div className="profile-details">
                          <div className="profile-info-row">
                            <div className="profile-info-label">Nom</div>
                            <div className="profile-info-value">{selectedChild.name}</div>
                          </div>
                          <div className="profile-info-row">
                            <div className="profile-info-label">Date de naissance</div>
                            <div className="profile-info-value">
                              {selectedChild.birth_date ? new Date(selectedChild.birth_date).toLocaleDateString() : 'Non renseignée'}
                            </div>
                          </div>
                          <div className="profile-info-row">
                            <div className="profile-info-label">Catégorie</div>
                            <div className="profile-info-value">{selectedChild.category?.name || 'Non assignée'}</div>
                          </div>
                          <div className="profile-info-row">
                            <div className="profile-info-label">Licence</div>
                            <div className="profile-info-value">{selectedChild.license_number || 'Non renseignée'}</div>
                          </div>
                          <div className="profile-info-row">
                            <div className="profile-info-label">Équipe/Position</div>
                            <div className="profile-info-value">{selectedChild.team || 'Non renseignée'}</div>
                          </div>
                          {isChildSenior && (
                            <div className="profile-info-row">
                              <div className="profile-info-label">Cartes jaunes</div>
                              <div className="profile-info-value">
                                <div className="yellow-cards-display">
                                  <span className={`yellow-card-count ${isChildSuspended ? 'suspended' : ''}`}>
                                    {childYellowCards}
                                  </span>
                                  {isChildSuspended && (
                                    <span className="suspended-badge">
                                      <FontAwesomeIcon icon={faExclamationCircle} /> Suspendu pour le prochain match
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    Aucun enfant inscrit à l'académie n'est associé à votre compte.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'performance' && (
              <div className="dashboard-section">
                <h2>Performances</h2>
                {parentData?.players && parentData.players.length > 0 ? (
                  <div className="children-performance-container">
                    <div className="children-list">
                      {parentData.players.map(player => (
                        <div 
                          key={player.id} 
                          className={`child-item ${selectedChild?.id === player.id ? 'active' : ''}`}
                          onClick={() => handleChildSelect(player)}
                        >
                          <div className="child-avatar">
                            <FontAwesomeIcon icon={faChild} />
                          </div>
                          <div className="child-info">
                            <h4>{player.name}</h4>
                            <p>{player.category?.name || 'Catégorie non assignée'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="performance-view">
                      {selectedChild ? (
                        <>
                          <h3>Performance de {selectedChild.name}</h3>
                          
                          {loadingPerformance ? (
                            <div className="text-center my-4">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement des performances...</span>
                              </div>
                              <p className="mt-2">Chargement des performances...</p>
                            </div>
                          ) : childPerformance ? (
                            <div className="performance-container">
                              <div className="performance-overview">
                                <div className="performance-card">
                                  <h3>Évaluation Globale</h3>
                                  <div className="performance-rating">
                                    <div className="performance-stars large">
                                      {renderStars((childPerformance.technique + childPerformance.tactique + childPerformance.physique + childPerformance.mental) / 4)}
                                    </div>
                                    <span className="performance-value">
                                      {((childPerformance.technique + childPerformance.tactique + childPerformance.physique + childPerformance.mental) / 4).toFixed(1)}/5
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="performance-details">
                                <div className="performance-metrics">
                                  <div className="performance-metric-card">
                                    <h4>Technique</h4>
                                    <div className="performance-stars">
                                      {renderStars(childPerformance.technique)}
                                    </div>
                                    <span className="performance-value">{childPerformance.technique}/5</span>
                                  </div>
                                  
                                  <div className="performance-metric-card">
                                    <h4>Tactique</h4>
                                    <div className="performance-stars">
                                      {renderStars(childPerformance.tactique)}
                                    </div>
                                    <span className="performance-value">{childPerformance.tactique}/5</span>
                                  </div>
                                  
                                  <div className="performance-metric-card">
                                    <h4>Physique</h4>
                                    <div className="performance-stars">
                                      {renderStars(childPerformance.physique)}
                                    </div>
                                    <span className="performance-value">{childPerformance.physique}/5</span>
                                  </div>
                                  
                                  <div className="performance-metric-card">
                                    <h4>Mental</h4>
                                    <div className="performance-stars">
                                      {renderStars(childPerformance.mental)}
                                    </div>
                                    <span className="performance-value">{childPerformance.mental}/5</span>
                                  </div>
                                </div>
                                
                                {childPerformance.commentaire && (
                                  <div className="performance-comments">
                                    <h4>
                                      <FontAwesomeIcon icon={faCommentAlt} className="me-2" />
                                      Commentaires du coach
                                    </h4>
                                    <div className="comment-box">
                                      <p>{childPerformance.commentaire}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="alert alert-info">
                              Aucune évaluation de performance n'a encore été enregistrée pour {selectedChild.name}.
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="alert alert-info">
                          Veuillez sélectionner un enfant pour voir ses performances.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    Aucun enfant inscrit à l'académie n'est associé à votre compte.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'schedule' && (
              <div className="dashboard-section">
                <h2>Planning</h2>
                {parentData?.players && parentData.players.length > 0 ? (
                  <div className="schedule-container">
                    <div className="children-list">
                      {parentData.players.map(player => (
                        <div 
                          key={player.id} 
                          className={`child-item ${selectedChild?.id === player.id ? 'active' : ''}`}
                          onClick={() => handleChildSelect(player)}
                        >
                          <div className="child-avatar">
                            <FontAwesomeIcon icon={faChild} />
                          </div>
                          <div className="child-info">
                            <h4>{player.name}</h4>
                            <p>{player.category?.name || 'Catégorie non assignée'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="schedule-details">
                      {selectedChild ? (
                        <>
                          <h3>Planning de {selectedChild.name}</h3>
                          
                          {selectedChild.category ? (
                            <>
                              <div className="schedule-section mb-4">
                                <h4>
                                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                  Entraînements
                                </h4>
                                
                                {parentData.schedules && parentData.schedules.filter(s => s.category_id === selectedChild.category_id).length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-hover">
                                      <thead>
                                        <tr>
                                          <th>Jour</th>
                                          <th>Horaire</th>
                                          <th>Activité</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {parentData.schedules
                                          .filter(s => s.category_id === selectedChild.category_id)
                                          .map((schedule, index) => (
                                            <tr key={index}>
                                              <td>{schedule.day}</td>
                                              <td>{schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}</td>
                                              <td>{schedule.activity}</td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="alert alert-info">
                                    Aucun entraînement programmé pour la catégorie {selectedChild.category.name}.
                                  </div>
                                )}
                              </div>
                              
                              <div className="schedule-section">
                                <h4>
                                  <FontAwesomeIcon icon={faTrophy} className="me-2" />
                                  Matchs à venir
                                </h4>
                                
                                {parentData.matches && parentData.matches.filter(m => m.category_id === selectedChild.category_id && !m.result).length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-hover">
                                      <thead>
                                        <tr>
                                          <th>Date</th>
                                          <th>Heure</th>
                                          <th>Adversaire</th>
                                          <th>Lieu</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {parentData.matches
                                          .filter(m => m.category_id === selectedChild.category_id && !m.result)
                                          .map((match, index) => (
                                            <tr key={index}>
                                              <td>{new Date(match.date).toLocaleDateString()}</td>
                                              <td>{match.time || 'Non définie'}</td>
                                              <td>{match.opponent}</td>
                                              <td>{match.location}</td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="alert alert-info">
                                    Aucun match à venir pour la catégorie {selectedChild.category.name}.
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="alert alert-warning">
                              {selectedChild.name} n'est pas encore assigné à une catégorie.
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="alert alert-info">
                          Veuillez sélectionner un enfant pour voir son planning.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    Aucun enfant inscrit à l'académie n'est associé à votre compte.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="dashboard-section">
                <h2>Documents</h2>
                {parentData?.players && parentData.players.length > 0 ? (
                  <div className="documents-container">
                    <div className="children-list">
                      {parentData.players.map(player => (
                        <div 
                          key={player.id} 
                          className={`child-item ${selectedChild?.id === player.id ? 'active' : ''}`}
                          onClick={() => handleChildSelect(player)}
                        >
                          <div className="child-avatar">
                            <FontAwesomeIcon icon={faChild} />
                          </div>
                          <div className="child-info">
                            <h4>{player.name}</h4>
                            <p>{player.category?.name || 'Catégorie non assignée'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="documents-details">
                      {selectedChild ? (
                        <>
                          <h3>Documents de {selectedChild.name}</h3>
                          
                          {parentData.documents && parentData.documents.filter(d => d.player_id === selectedChild.id).length > 0 ? (
                            <div className="documents-grid">
                              {parentData.documents
                                .filter(d => d.player_id === selectedChild.id)
                                .map((document, index) => (
                                  <div key={index} className="document-card">
                                    <div className="document-icon">
                                      <FontAwesomeIcon icon={faFileAlt} size="2x" />
                                    </div>
                                    <div className="document-info">
                                      <h5>{document.name}</h5>
                                      <a 
                                        href={`${apiUrl}/storage/${document.path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-primary mt-2"
                                      >
                                        Voir le document
                                      </a>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="alert alert-info">
                              Aucun document n'est disponible pour {selectedChild.name}.
                            </div>
                          )}
                          
                          <div className="documents-checklist mt-4">
                            <h4>Documents requis</h4>
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Document</th>
                                    <th>Statut</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {['Carte d\'identité', 'Certificat médical', 'Photo d\'identité', 'Licence sportive', 'Formulaire d\'inscription'].map((docName, index) => {
                                    const docType = docName.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '_');
                                    const docExists = parentData.documents?.some(d => 
                                      d.player_id === selectedChild.id && 
                                      (d.type === docType || d.name === docName)
                                    );
                                    
                                    return (
                                      <tr key={index}>
                                        <td>{docName}</td>
                                        <td>
                                          {docExists ? (
                                            <span className="badge bg-success">Fourni</span>
                                          ) : (
                                            <span className="badge bg-warning">À fournir</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="alert alert-info">
                          Veuillez sélectionner un enfant pour voir ses documents.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    Aucun enfant inscrit à l'académie n'est associé à votre compte.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div className="dashboard-section">
                <h2>Paiements</h2>
                {parentData?.players && parentData.players.length > 0 ? (
                  <p>Historique et statut des paiements à venir...</p>
                ) : (
                  <div className="alert alert-info">
                    Aucun enfant inscrit à l'académie n'est associé à votre compte.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;