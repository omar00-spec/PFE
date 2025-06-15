import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCalendarAlt, faUsers, faTrophy, 
  faChalkboardTeacher, faStar, faStarHalfAlt, faEdit, faSave, 
  faTimesCircle, faSquare, faExclamationTriangle, faBan, faPlus,
  faTrashAlt, faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/dashboard.css';
import DashboardLayout from '../layout/DashboardLayout';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const CoachDashboard = () => {
  const navigate = useNavigate();
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [performanceData, setPerformanceData] = useState({
    technique: 0,
    tactique: 0,
    physique: 0,
    mental: 0,
    commentaire: ''
  });
  const [yellowCards, setYellowCards] = useState({});
  const [matches, setMatches] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day: 'Lundi',
    start_time: '16:00',
    end_time: '18:00',
    activity: 'Entraînement',
    category_id: ''
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editScheduleData, setEditScheduleData] = useState({
    day: '',
    start_time: '',
    end_time: '',
    activity: ''
  });
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    date: '',
    time: '',
    opponent: '',
    location: '',
    result: '',
    category_id: ''
  });
  const [editingMatch, setEditingMatch] = useState(null);
  const [editMatchData, setEditMatchData] = useState({
    date: '',
    time: '',
    opponent: '',
    location: '',
    result: ''
  });

  useEffect(() => {
    const fetchCoachData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(`${apiUrl}/coach/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCoachData(response.data);
          
          // Si le coach a une catégorie, charger les joueurs
          if (response.data.category) {
            fetchPlayersByCategory(response.data.category.id, token);
            fetchSchedulesByCategory(response.data.category.id, token);
            fetchMatchesByCategory(response.data.category.id, token);
            
            // Initialiser la catégorie pour le nouveau planning et les nouveaux matchs
            setNewSchedule(prev => ({
              ...prev,
              category_id: response.data.category.id
            }));
            
            setNewMatch(prev => ({
              ...prev,
              category_id: response.data.category.id
            }));
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
          localStorage.removeItem('coach');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachData();
  }, [navigate]);

  // Récupérer les joueurs par catégorie
  const fetchPlayersByCategory = async (categoryId, token) => {
    setLoadingPlayers(true);
    try {
      console.log(`Chargement des joueurs pour la catégorie ${categoryId}...`);
      const response = await axios.get(`${apiUrl}/players/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        const playersData = response.data;
        console.log('Données des joueurs reçues:', playersData);
        setPlayers(playersData);
        
        // Initialiser les cartes jaunes pour les joueurs, particulièrement pour les seniors
        if (coachData?.category?.name.toLowerCase() === 'seniors') {
          const initialYellowCards = {};
          playersData.forEach(player => {
            // S'assurer que yellow_cards est un nombre, ou utiliser 0 comme valeur par défaut
            const cardCount = player.yellow_cards !== null && player.yellow_cards !== undefined 
              ? parseInt(player.yellow_cards, 10) 
              : 0;
            initialYellowCards[player.id] = cardCount;
            console.log(`Joueur ${player.name}: ${cardCount} cartes jaunes`);
          });
          setYellowCards(initialYellowCards);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  // Ajouter un effet pour recharger les données après chaque mise à jour
  useEffect(() => {
    if (coachData?.category?.id) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchPlayersByCategory(coachData.category.id, token);
      }
    }
  }, [coachData]);

  // Récupérer les matchs pour les seniors
  const fetchMatches = async (categoryId, token) => {
    try {
      const response = await axios.get(`${apiUrl}/matches/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setMatches(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
    }
  };

  // Récupérer les matchs pour la catégorie
  const fetchMatchesByCategory = async (categoryId, token) => {
    try {
      const response = await axios.get(`${apiUrl}/matches/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setMatches(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
    }
  };

  // Récupérer les entraînements pour la catégorie
  const fetchSchedulesByCategory = async (categoryId, token) => {
    setLoadingSchedules(true);
    try {
      const response = await axios.get(`${apiUrl}/schedules/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entraînements:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Gérer l'édition des performances d'un joueur
  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setPerformanceData({
      technique: player.performance?.technique || 0,
      tactique: player.performance?.tactique || 0,
      physique: player.performance?.physique || 0,
      mental: player.performance?.mental || 0,
      commentaire: player.performance?.commentaire || ''
    });
  };

  // Gérer les changements dans le formulaire de performance
  const handlePerformanceChange = (field, value) => {
    setPerformanceData({
      ...performanceData,
      [field]: value
    });
  };

  // Sauvegarder les performances d'un joueur
  const handleSavePerformance = async () => {
    if (!editingPlayer) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('Envoi des performances pour le joueur:', editingPlayer.id);
      console.log('Données à envoyer:', performanceData);
      
      const response = await axios.post(`${apiUrl}/players/${editingPlayer.id}/performance`, performanceData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Réponse reçue:', response.data);
      
      if (response.data.success) {
        // Mettre à jour les joueurs avec les nouvelles performances
        setPlayers(players.map(player => 
          player.id === editingPlayer.id 
            ? { ...player, performance: performanceData }
            : player
        ));
        
        setEditingPlayer(null);
        alert('Performance enregistrée avec succès !');
      } else {
        console.error('Erreur dans la réponse:', response.data);
        alert('Erreur lors de l\'enregistrement: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des performances:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      alert('Erreur lors de l\'enregistrement des performances: ' + 
        (error.response?.data?.message || error.message || 'Erreur inconnue'));
    }
  };

  // Annuler l'édition des performances
  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  // Gérer les cartes jaunes pour les seniors
  const handleYellowCardChange = async (playerId, increment = true) => {
    if (coachData?.category?.name.toLowerCase() !== 'seniors') return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Trouver le joueur concerné
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const currentCards = yellowCards[playerId] || 0;
    const newCardCount = increment ? currentCards + 1 : Math.max(0, currentCards - 1);
    
    // Demander confirmation avant de modifier
    const action = increment ? "ajouter" : "retirer";
    const confirmMessage = increment && newCardCount >= 4 
      ? `ATTENTION: ${player.name} aura ${newCardCount} cartes jaunes et sera suspendu pour le prochain match. Confirmer ?`
      : `Voulez-vous ${action} une carte jaune pour ${player.name} ?`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    try {
      console.log(`Mise à jour des cartes jaunes pour ${player.name}: ${currentCards} => ${newCardCount}`);
      
      const response = await axios.post(`${apiUrl}/players/${playerId}/yellow-card`, {
        yellow_cards: newCardCount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Réponse du serveur:', response.data);
        
        // Mettre à jour l'état local
        setYellowCards(prev => ({
          ...prev,
          [playerId]: newCardCount
        }));
        
        // Mettre à jour le joueur dans la liste
        setPlayers(prevPlayers => prevPlayers.map(p => 
          p.id === playerId 
            ? { ...p, yellow_cards: newCardCount }
            : p
        ));
        
        // Afficher un message de confirmation
        const statusMessage = newCardCount >= 4 
          ? `${player.name} a maintenant ${newCardCount} cartes jaunes et est suspendu pour le prochain match.`
          : `${player.name} a maintenant ${newCardCount} carte${newCardCount > 1 ? 's' : ''} jaune${newCardCount > 1 ? 's' : ''}.`;
        
        alert(statusMessage);
        
        // Recharger les données pour s'assurer que tout est synchronisé
        fetchPlayersByCategory(coachData.category.id, token);
      } else {
        console.error('Erreur dans la réponse:', response.data);
        alert('Erreur lors de la mise à jour des cartes jaunes: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des cartes jaunes:', error);
      alert('Erreur lors de la mise à jour des cartes jaunes: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
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

  // Calculer la moyenne des performances
  const calculateAveragePerformance = (performance) => {
    if (!performance) return 0;
    
    const { technique, tactique, physique, mental } = performance;
    return (technique + tactique + physique + mental) / 4;
  };

  // Gérer les changements dans le formulaire d'ajout d'entraînement
  const handleScheduleChange = (field, value) => {
    setNewSchedule({
      ...newSchedule,
      [field]: value
    });
  };

  // Gérer les changements dans le formulaire d'édition d'entraînement
  const handleEditScheduleChange = (field, value) => {
    setEditScheduleData({
      ...editScheduleData,
      [field]: value
    });
  };

  // Ajouter un nouvel entraînement
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.post(`${apiUrl}/coach/schedules`, newSchedule, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Ajouter le nouvel entraînement à la liste
        setSchedules([...schedules, response.data.schedule]);
        
        // Réinitialiser le formulaire
        setNewSchedule({
          ...newSchedule,
          day: 'Lundi',
          start_time: '16:00',
          end_time: '18:00',
          activity: 'Entraînement'
        });
        
        // Fermer le formulaire
        setShowAddScheduleForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entraînement:', error);
      alert('Erreur lors de l\'ajout de l\'entraînement: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Editer un entraînement existant
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setEditScheduleData({
      day: schedule.day,
      start_time: schedule.start_time.substring(0, 5),
      end_time: schedule.end_time.substring(0, 5),
      activity: schedule.activity
    });
  };

  // Sauvegarder les modifications d'un entraînement
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token || !editingSchedule) {
      return;
    }
    
    try {
      const response = await axios.put(`${apiUrl}/coach/schedules/${editingSchedule.id}`, editScheduleData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Mettre à jour l'entraînement dans la liste
        setSchedules(schedules.map(schedule => 
          schedule.id === editingSchedule.id 
            ? { ...schedule, ...editScheduleData }
            : schedule
        ));
        
        // Réinitialiser le formulaire
        setEditingSchedule(null);
        setEditScheduleData({
          day: '',
          start_time: '',
          end_time: '',
          activity: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'entraînement:', error);
      alert('Erreur lors de la modification de l\'entraînement: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Supprimer un entraînement
  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet entraînement ?')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.delete(`${apiUrl}/coach/schedules/${scheduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Supprimer l'entraînement de la liste
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
        alert('Entraînement supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entraînement:', error);
      alert('Erreur lors de la suppression de l\'entraînement: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Annuler l'édition d'un entraînement
  const handleCancelEditSchedule = () => {
    setEditingSchedule(null);
    setEditScheduleData({
      day: '',
      start_time: '',
      end_time: '',
      activity: ''
    });
  };

  // Gérer les changements dans le formulaire d'ajout de match
  const handleMatchChange = (field, value) => {
    setNewMatch({
      ...newMatch,
      [field]: value
    });
  };

  // Gérer les changements dans le formulaire d'édition de match
  const handleEditMatchChange = (field, value) => {
    setEditMatchData({
      ...editMatchData,
      [field]: value
    });
  };

  // Ajouter un nouveau match
  const handleAddMatch = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.post(`${apiUrl}/coach/matches`, newMatch, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Ajouter le nouveau match à la liste
        setMatches([...matches, response.data.match]);
        
        // Réinitialiser le formulaire
        setNewMatch({
          ...newMatch,
          date: '',
          time: '',
          opponent: '',
          location: '',
          result: ''
        });
        
        // Fermer le formulaire
        setShowAddMatchForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du match:', error);
      alert('Erreur lors de l\'ajout du match: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Editer un match existant
  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setEditMatchData({
      date: match.date,
      time: match.time || '',
      opponent: match.opponent,
      location: match.location,
      result: match.result || ''
    });
  };

  // Sauvegarder les modifications d'un match
  const handleSaveMatch = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token || !editingMatch) {
      return;
    }
    
    try {
      const response = await axios.put(`${apiUrl}/coach/matches/${editingMatch.id}`, editMatchData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Mettre à jour le match dans la liste
        setMatches(matches.map(match => 
          match.id === editingMatch.id 
            ? { ...match, ...editMatchData }
            : match
        ));
        
        // Réinitialiser le formulaire
        setEditingMatch(null);
        setEditMatchData({
          date: '',
          time: '',
          opponent: '',
          location: '',
          result: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la modification du match:', error);
      alert('Erreur lors de la modification du match: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Supprimer un match
  const handleDeleteMatch = async (matchId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.delete(`${apiUrl}/coach/matches/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Supprimer le match de la liste
        setMatches(matches.filter(match => match.id !== matchId));
        alert('Match supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du match:', error);
      alert('Erreur lors de la suppression du match: ' + (error.response?.data?.message || 'Erreur de connexion au serveur'));
    }
  };

  // Annuler l'édition d'un match
  const handleCancelEditMatch = () => {
    setEditingMatch(null);
    setEditMatchData({
      date: '',
      time: '',
      opponent: '',
      location: '',
      result: ''
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement de votre espace coach...</p>
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

  const isSeniorCoach = coachData?.category?.name.toLowerCase() === 'seniors';

  return (
    <DashboardLayout>
    <div className="dashboard-container coach-dashboard">
      <div className="dashboard-header">
        <h1>Espace Coach</h1>
        <p>Bienvenue, {coachData?.coach?.name || coachData?.user?.name}</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="profile-card">
            <div className="profile-image">
              <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
            </div>
            <div className="profile-info">
              <h3>{coachData?.coach?.name}</h3>
              <p>{coachData?.category?.name || 'Aucune catégorie assignée'}</p>
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
              className={`dashboard-nav-item ${activeTab === 'players' ? 'active' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>Mes Joueurs</span>
            </button>
            <button 
              className={`dashboard-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>Planning</span>
            </button>
            <button 
              className={`dashboard-nav-item ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <FontAwesomeIcon icon={faTrophy} />
              <span>Matchs</span>
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
                  <div className="profile-info-value">{coachData?.coach?.name}</div>
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Email</div>
                  <div className="profile-info-value">{coachData?.coach?.email || coachData?.user?.email}</div>
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Téléphone</div>
                  <div className="profile-info-value">{coachData?.coach?.phone || 'Non renseigné'}</div>
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Diplôme</div>
                  <div className="profile-info-value">{coachData?.coach?.diploma || 'Non renseigné'}</div>
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Catégorie</div>
                  <div className="profile-info-value">{coachData?.category?.name || 'Non assigné'}</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'players' && (
            <div className="dashboard-section">
              <h2>Mes Joueurs</h2>
              {coachData?.category ? (
                <>
                  {loadingPlayers ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement des joueurs...</span>
                      </div>
                      <p className="mt-2">Chargement des joueurs...</p>
                    </div>
                  ) : players.length > 0 ? (
                    <>
                      {isSeniorCoach && (
                        <div className="mb-4">
                          <h3>Gestion des Cartes Jaunes</h3>
                          <div className="alert alert-warning">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                            <strong>Important:</strong> Les joueurs avec 4 cartes jaunes ou plus sont automatiquement suspendus pour le prochain match.
                          </div>
                        </div>
                      )}
                      
                      <div className="table-responsive">
                        <table className="table table-hover player-table">
                          <thead>
                            <tr>
                              <th>Nom</th>
                              <th>Position</th>
                              <th>Performance</th>
                              {isSeniorCoach && <th>Cartes Jaunes</th>}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.map(player => (
                              <tr key={player.id} className={isSeniorCoach && yellowCards[player.id] >= 4 ? 'suspended-player' : ''}>
                                <td>{player.name}</td>
                                <td>{player.position || 'Non définie'}</td>
                                <td>
                                  {player.performance ? (
                                    <div className="performance-stars">
                                      {renderStars(calculateAveragePerformance(player.performance))}
                                    </div>
                                  ) : (
                                    <span className="text-muted">Non évalué</span>
                                  )}
                                </td>
                                {isSeniorCoach && (
                                  <td>
                                    <div className="yellow-card-controls">
                                      <span className={`yellow-card-count ${yellowCards[player.id] >= 4 ? 'suspended' : ''}`}>
                                        {yellowCards[player.id] || 0}
                                      </span>
                                      <div className="yellow-card-buttons">
                                        <button 
                                          className="btn btn-sm btn-warning"
                                          onClick={() => handleYellowCardChange(player.id)}
                                          title="Ajouter une carte jaune"
                                        >
                                          <FontAwesomeIcon icon={faSquare} /> +
                                        </button>
                                        <button 
                                          className="btn btn-sm btn-outline-secondary"
                                          onClick={() => handleYellowCardChange(player.id, false)}
                                          disabled={!yellowCards[player.id]}
                                          title="Retirer une carte jaune"
                                        >
                                          <FontAwesomeIcon icon={faSquare} /> -
                                        </button>
                                      </div>
                                      {yellowCards[player.id] >= 4 && (
                                        <span className="suspended-badge">
                                          <FontAwesomeIcon icon={faBan} /> Suspendu
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditPlayer(player)}
                                  >
                                    <FontAwesomeIcon icon={faEdit} /> Évaluer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Modal d'édition des performances */}
                      {editingPlayer && (
                        <div className="performance-modal">
                          <div className="performance-modal-content">
                            <div className="performance-modal-header">
                              <h3>Évaluation de {editingPlayer.name}</h3>
                              <button 
                                className="btn-close"
                                onClick={handleCancelEdit}
                                aria-label="Fermer"
                              ></button>
                            </div>
                            <div className="performance-modal-body">
                              <div className="form-group mb-3">
                                <label>Technique (0-5)</label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="5" 
                                  step="0.5" 
                                  className="form-range" 
                                  value={performanceData.technique}
                                  onChange={(e) => handlePerformanceChange('technique', parseFloat(e.target.value))}
                                />
                                <div className="rating-display">
                                  {renderStars(performanceData.technique)}
                                  <span className="rating-value">{performanceData.technique}</span>
                                </div>
                              </div>
                              
                              <div className="form-group mb-3">
                                <label>Tactique (0-5)</label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="5" 
                                  step="0.5" 
                                  className="form-range" 
                                  value={performanceData.tactique}
                                  onChange={(e) => handlePerformanceChange('tactique', parseFloat(e.target.value))}
                                />
                                <div className="rating-display">
                                  {renderStars(performanceData.tactique)}
                                  <span className="rating-value">{performanceData.tactique}</span>
                                </div>
                              </div>
                              
                              <div className="form-group mb-3">
                                <label>Physique (0-5)</label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="5" 
                                  step="0.5" 
                                  className="form-range" 
                                  value={performanceData.physique}
                                  onChange={(e) => handlePerformanceChange('physique', parseFloat(e.target.value))}
                                />
                                <div className="rating-display">
                                  {renderStars(performanceData.physique)}
                                  <span className="rating-value">{performanceData.physique}</span>
                                </div>
                              </div>
                              
                              <div className="form-group mb-3">
                                <label>Mental (0-5)</label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="5" 
                                  step="0.5" 
                                  className="form-range" 
                                  value={performanceData.mental}
                                  onChange={(e) => handlePerformanceChange('mental', parseFloat(e.target.value))}
                                />
                                <div className="rating-display">
                                  {renderStars(performanceData.mental)}
                                  <span className="rating-value">{performanceData.mental}</span>
                                </div>
                              </div>
                              
                              <div className="form-group mb-3">
                                <label>Commentaire</label>
                                <textarea 
                                  className="form-control" 
                                  rows="3"
                                  value={performanceData.commentaire}
                                  onChange={(e) => handlePerformanceChange('commentaire', e.target.value)}
                                  placeholder="Ajoutez vos commentaires sur la performance du joueur..."
                                ></textarea>
                              </div>
                            </div>
                            <div className="performance-modal-footer">
                              <button 
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                              >
                                <FontAwesomeIcon icon={faTimesCircle} /> Annuler
                              </button>
                              <button 
                                className="btn btn-primary"
                                onClick={handleSavePerformance}
                              >
                                <FontAwesomeIcon icon={faSave} /> Enregistrer
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="alert alert-info">
                      Aucun joueur n'est actuellement assigné à votre catégorie.
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-info">
                  Vous n'êtes pas encore assigné à une catégorie. Contactez l'administration pour plus d'informations.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <div className="dashboard-section">
              <h2>Planning des Entraînements</h2>
              {coachData?.category ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Entraînements pour la catégorie {coachData.category.name}</h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
                    >
                      <FontAwesomeIcon icon={showAddScheduleForm ? faTimesCircle : faPlus} className="me-2" />
                      {showAddScheduleForm ? 'Annuler' : 'Ajouter un entraînement'}
                    </button>
                  </div>
                  
                  {showAddScheduleForm && (
                    <div className="card mb-4">
                      <div className="card-header">
                        <h4>Ajouter un nouvel entraînement</h4>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleAddSchedule}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="day" className="form-label">Jour</label>
                              <select 
                                id="day"
                                className="form-select"
                                value={newSchedule.day}
                                onChange={(e) => handleScheduleChange('day', e.target.value)}
                                required
                              >
                                <option value="Lundi">Lundi</option>
                                <option value="Mardi">Mardi</option>
                                <option value="Mercredi">Mercredi</option>
                                <option value="Jeudi">Jeudi</option>
                                <option value="Vendredi">Vendredi</option>
                                <option value="Samedi">Samedi</option>
                                <option value="Dimanche">Dimanche</option>
                              </select>
                            </div>
                            <div className="col-md-3 mb-3">
                              <label htmlFor="start_time" className="form-label">Heure de début</label>
                              <input 
                                type="time"
                                id="start_time"
                                className="form-control"
                                value={newSchedule.start_time}
                                onChange={(e) => handleScheduleChange('start_time', e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label htmlFor="end_time" className="form-label">Heure de fin</label>
                              <input 
                                type="time"
                                id="end_time"
                                className="form-control"
                                value={newSchedule.end_time}
                                onChange={(e) => handleScheduleChange('end_time', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="activity" className="form-label">Activité</label>
                            <input 
                              type="text"
                              id="activity"
                              className="form-control"
                              value={newSchedule.activity}
                              onChange={(e) => handleScheduleChange('activity', e.target.value)}
                              placeholder="Description de l'entraînement"
                              required
                            />
                          </div>
                          <div className="text-end">
                            <button type="submit" className="btn btn-success">
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  {loadingSchedules ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement des entraînements...</span>
                      </div>
                      <p className="mt-2">Chargement des entraînements...</p>
                    </div>
                  ) : schedules.length > 0 ? (
                      <>
                        {editingSchedule ? (
                          <div className="card mb-4">
                            <div className="card-header">
                              <h4>Modifier l'entraînement</h4>
                            </div>
                            <div className="card-body">
                              <form onSubmit={handleSaveSchedule}>
                                <div className="row">
                                  <div className="col-md-6 mb-3">
                                    <label htmlFor="edit-day" className="form-label">Jour</label>
                                    <select 
                                      id="edit-day"
                                      className="form-select"
                                      value={editScheduleData.day}
                                      onChange={(e) => handleEditScheduleChange('day', e.target.value)}
                                      required
                                    >
                                      <option value="Lundi">Lundi</option>
                                      <option value="Mardi">Mardi</option>
                                      <option value="Mercredi">Mercredi</option>
                                      <option value="Jeudi">Jeudi</option>
                                      <option value="Vendredi">Vendredi</option>
                                      <option value="Samedi">Samedi</option>
                                      <option value="Dimanche">Dimanche</option>
                                    </select>
                                  </div>
                                  <div className="col-md-3 mb-3">
                                    <label htmlFor="edit-start-time" className="form-label">Heure de début</label>
                                    <input 
                                      type="time"
                                      id="edit-start-time"
                                      className="form-control"
                                      value={editScheduleData.start_time}
                                      onChange={(e) => handleEditScheduleChange('start_time', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div className="col-md-3 mb-3">
                                    <label htmlFor="edit-end-time" className="form-label">Heure de fin</label>
                                    <input 
                                      type="time"
                                      id="edit-end-time"
                                      className="form-control"
                                      value={editScheduleData.end_time}
                                      onChange={(e) => handleEditScheduleChange('end_time', e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="edit-activity" className="form-label">Activité</label>
                                  <input 
                                    type="text"
                                    id="edit-activity"
                                    className="form-control"
                                    value={editScheduleData.activity}
                                    onChange={(e) => handleEditScheduleChange('activity', e.target.value)}
                                    placeholder="Description de l'entraînement"
                                    required
                                  />
                                </div>
                                <div className="text-end">
                                  <button 
                                    type="button" 
                                    className="btn btn-secondary me-2"
                                    onClick={handleCancelEditSchedule}
                                  >
                                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                                    Annuler
                                  </button>
                                  <button type="submit" className="btn btn-success">
                                    <FontAwesomeIcon icon={faSave} className="me-2" />
                                    Enregistrer
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : null}
                        
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Jour</th>
                            <th>Horaire</th>
                            <th>Activité</th>
                                <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                              {schedules.map((schedule) => (
                                <tr key={schedule.id}>
                              <td>{schedule.day}</td>
                                  <td>{schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}</td>
                              <td>{schedule.activity}</td>
                                  <td>
                                    <button 
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => handleEditSchedule(schedule)}
                                      title="Modifier"
                                    >
                                      <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDeleteSchedule(schedule.id)}
                                      title="Supprimer"
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                  </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                      </>
                  ) : (
                    <div className="alert alert-info">
                      Aucun entraînement n'est programmé pour le moment. Utilisez le bouton "Ajouter un entraînement" pour en créer un.
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-info">
                  Vous n'êtes pas encore assigné à une catégorie. Contactez l'administration pour plus d'informations.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'matches' && (
            <div className="dashboard-section">
                <h2>Matchs</h2>
              {coachData?.category ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3>Matchs pour la catégorie {coachData.category.name}</h3>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowAddMatchForm(!showAddMatchForm)}
                      >
                        <FontAwesomeIcon icon={showAddMatchForm ? faTimesCircle : faPlus} className="me-2" />
                        {showAddMatchForm ? 'Annuler' : 'Ajouter un match'}
                      </button>
                    </div>
                    
                    {/* Afficher la section des cartes jaunes uniquement pour les seniors */}
                    {isSeniorCoach && (
                      <div className="card mb-4">
                        <div className="card-header bg-warning text-dark">
                          <h4><FontAwesomeIcon icon={faSquare} className="me-2" /> Gestion des Cartes Jaunes</h4>
                        </div>
                        <div className="card-body">
                          <p>
                            <strong>Rappel:</strong> Les joueurs avec 4 cartes jaunes ou plus sont automatiquement suspendus pour le prochain match.
                          </p>
                          
                          {/* Afficher les joueurs suspendus */}
                          <div className="mt-3">
                            <h5>Joueurs suspendus pour le prochain match:</h5>
                            {players.filter(player => (yellowCards[player.id] || 0) >= 4).length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                  <thead className="table-danger">
                                    <tr>
                                      <th>Nom</th>
                                      <th>Cartes jaunes</th>
                                      <th>Position</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {players
                                      .filter(player => (yellowCards[player.id] || 0) >= 4)
                                      .map(player => (
                                        <tr key={player.id} className="suspended-player">
                                          <td>{player.name}</td>
                                          <td>
                                            <span className="yellow-card-count suspended">
                                              {yellowCards[player.id] || 0}
                                            </span>
                                          </td>
                                          <td>{player.position || 'Non définie'}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="alert alert-success">
                                <FontAwesomeIcon icon={faUsers} className="me-2" />
                                Aucun joueur n'est actuellement suspendu.
                              </div>
                            )}
                          </div>
                          
                          {/* Afficher les joueurs à risque (3 cartes jaunes) */}
                          <div className="mt-4">
                            <h5>Joueurs à risque (3 cartes jaunes):</h5>
                            {players.filter(player => (yellowCards[player.id] || 0) === 3).length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                  <thead className="table-warning">
                                    <tr>
                                      <th>Nom</th>
                                      <th>Cartes jaunes</th>
                                      <th>Position</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {players
                                      .filter(player => (yellowCards[player.id] || 0) === 3)
                                      .map(player => (
                                        <tr key={player.id}>
                                          <td>{player.name}</td>
                                          <td>
                                            <span className="yellow-card-count">
                                              {yellowCards[player.id] || 0}
                                            </span>
                                          </td>
                                          <td>{player.position || 'Non définie'}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="alert alert-info">
                                <FontAwesomeIcon icon={faUsers} className="me-2" />
                                Aucun joueur n'a actuellement 3 cartes jaunes.
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-muted">
                              <small>Pour gérer les cartes jaunes des joueurs, rendez-vous dans l'onglet "Mes Joueurs".</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showAddMatchForm && (
                      <div className="card mb-4">
                        <div className="card-header">
                          <h4>Ajouter un nouveau match</h4>
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleAddMatch}>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input 
                                  type="date"
                                  id="date"
                                  className="form-control"
                                  value={newMatch.date}
                                  onChange={(e) => handleMatchChange('date', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="time" className="form-label">Heure</label>
                                <input 
                                  type="time"
                                  id="time"
                                  className="form-control"
                                  value={newMatch.time}
                                  onChange={(e) => handleMatchChange('time', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label htmlFor="opponent" className="form-label">Adversaire</label>
                                <input 
                                  type="text"
                                  id="opponent"
                                  className="form-control"
                                  value={newMatch.opponent}
                                  onChange={(e) => handleMatchChange('opponent', e.target.value)}
                                  placeholder="Nom de l'équipe adverse"
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="location" className="form-label">Lieu</label>
                                <input 
                                  type="text"
                                  id="location"
                                  className="form-control"
                                  value={newMatch.location}
                                  onChange={(e) => handleMatchChange('location', e.target.value)}
                                  placeholder="Lieu du match"
                                  required
                                />
                              </div>
                            </div>
                            <div className="text-end">
                              <button type="submit" className="btn btn-success">
                                <FontAwesomeIcon icon={faSave} className="me-2" />
                                Enregistrer
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    
                    {editingMatch && (
                      <div className="card mb-4">
                        <div className="card-header">
                          <h4>Modifier le match</h4>
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleSaveMatch}>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label htmlFor="edit-date" className="form-label">Date</label>
                                <input 
                                  type="date"
                                  id="edit-date"
                                  className="form-control"
                                  value={editMatchData.date}
                                  onChange={(e) => handleEditMatchChange('date', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="edit-time" className="form-label">Heure</label>
                                <input 
                                  type="time"
                                  id="edit-time"
                                  className="form-control"
                                  value={editMatchData.time}
                                  onChange={(e) => handleEditMatchChange('time', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label htmlFor="edit-opponent" className="form-label">Adversaire</label>
                                <input 
                                  type="text"
                                  id="edit-opponent"
                                  className="form-control"
                                  value={editMatchData.opponent}
                                  onChange={(e) => handleEditMatchChange('opponent', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="edit-location" className="form-label">Lieu</label>
                                <input 
                                  type="text"
                                  id="edit-location"
                                  className="form-control"
                                  value={editMatchData.location}
                                  onChange={(e) => handleEditMatchChange('location', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="edit-result" className="form-label">Résultat (laisser vide pour les matchs à venir)</label>
                              <input 
                                type="text"
                                id="edit-result"
                                className="form-control"
                                value={editMatchData.result}
                                onChange={(e) => handleEditMatchChange('result', e.target.value)}
                                placeholder="Ex: 2-1, 0-0, etc."
                              />
                            </div>
                            <div className="text-end">
                              <button 
                                type="button" 
                                className="btn btn-secondary me-2"
                                onClick={handleCancelEditMatch}
                              >
                                <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                                Annuler
                              </button>
                              <button type="submit" className="btn btn-success">
                                <FontAwesomeIcon icon={faSave} className="me-2" />
                                Enregistrer
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4>Matchs à venir</h4>
                      {matches.filter(match => !match.result).length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                                <th>Heure</th>
                            <th>Adversaire</th>
                            <th>Lieu</th>
                                <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                              {matches.filter(match => !match.result).map(match => (
                            <tr key={match.id}>
                              <td>{new Date(match.date).toLocaleDateString()}</td>
                                  <td>{match.time || 'Non définie'}</td>
                              <td>{match.opponent}</td>
                              <td>{match.location}</td>
                                  <td>
                                    <button 
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => handleEditMatch(match)}
                                      title="Modifier"
                                    >
                                      <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDeleteMatch(match.id)}
                                      title="Supprimer"
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                          Aucun match à venir n'est programmé pour le moment.
                    </div>
                  )}
                    </div>
                    
                    <div>
                      <h4>Matchs joués</h4>
                      {matches.filter(match => match.result).length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Adversaire</th>
                                <th>Lieu</th>
                                <th>Résultat</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matches.filter(match => match.result).map(match => (
                                <tr key={match.id}>
                                  <td>{new Date(match.date).toLocaleDateString()}</td>
                                  <td>{match.opponent}</td>
                                  <td>{match.location}</td>
                                  <td><strong>{match.result}</strong></td>
                                  <td>
                                    <button 
                                      className="btn btn-sm btn-primary me-2"
                                      onClick={() => handleEditMatch(match)}
                                      title="Modifier"
                                    >
                                      <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDeleteMatch(match.id)}
                                      title="Supprimer"
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
              ) : (
                <div className="alert alert-info">
                          Aucun match joué n'est enregistré pour le moment.
                </div>
              )}
            </div>
                </>
              ) : (
                <div className="alert alert-info">
                  Vous n'êtes pas encore assigné à une catégorie. Contactez l'administration pour plus d'informations.
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

export default CoachDashboard; 