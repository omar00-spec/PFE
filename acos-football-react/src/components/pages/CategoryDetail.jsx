import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faUserTie, faUsers, faImages,
  faPhone, faEnvelope, faFutbol,
  faChartLine, faCheckCircle, faGraduationCap, faMapMarkerAlt,
  faVideo, faClock, faHistory, faInfoCircle, faQuoteLeft,
  faTimes, faExpand
} from '@fortawesome/free-solid-svg-icons';
import CategoryHeader from '../common/CategoryHeader';
import '../../styles/CategoryDetail.css';
import '../../styles/Media.css'; // Styles pour la modal

// Import des services
import { getMatchesByCategory } from '../../services/matchService';
import { getSchedulesByCategory } from '../../services/scheduleService';
import api from '../../services/axios';

function CategoryDetail() {
  const { name } = useParams();
  const [category, setCategory] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [media, setMedia] = useState({ photos: [], videos: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  // États pour la modal plein écran
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        // Vérifier si le nom de la catégorie est valide
        if (!name) {
          throw new Error('Nom de catégorie invalide');
        }

        const categoryResponse = await api.get(`/api/categories?name=${encodeURIComponent(name)}`);
        if (!categoryResponse.data || categoryResponse.data.length === 0) {
          throw new Error('Catégorie non trouvée');
        }

        const categoryData = categoryResponse.data[0];
        setCategory(categoryData);
        
        // Fetch all related data in parallel with error handling
        try {
          const [coachesRes, schedulesData, matchesData, playersRes, mediaRes] = await Promise.all([
            api.get(`/api/coaches?category_id=${categoryData.id}`),
            getSchedulesByCategory(categoryData.id),
            getMatchesByCategory(categoryData.id),
            api.get(`/api/players?category_id=${categoryData.id}`),
            api.get(`/api/media/category/${categoryData.id}`).catch(() => ({ data: [] }))
          ]);

          setCoaches(coachesRes.data);
          setSchedules(schedulesData);
          setMatches(matchesData);
          setPlayers(playersRes.data);
          
          const photos = mediaRes.data
            .filter(item => item.type === 'photo')
            .map(photo => ({
              id: photo.id,
              src: photo.file_path,
              alt: photo.title,
              title: photo.title,
              category: categoryData.name
            }));
          
          const videos = mediaRes.data
            .filter(item => item.type === 'video')
            .map(video => ({
              id: video.id,
              src: video.file_path,
              title: video.title,
              category: categoryData.name,
              thumbnail: video.thumbnail || null
            }));
          
          setMedia({ photos, videos });
        } catch (err) {
          console.error("Erreur lors du chargement des données associées:", err);
          // Ne pas bloquer l'affichage si les données associées échouent
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [name]);

  // Ouvrir la modal pour afficher l'image ou la vidéo en plein écran
  const openMediaModal = (mediaItem, type) => {
    setSelectedMedia({ ...mediaItem, type });
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Fermer la modal
  const closeMediaModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    document.body.style.overflow = 'auto';
  };

  // Fonction pour déterminer la classe de colonne en fonction du nombre d'éléments
  const getColumnClass = (itemCount) => {
    if (itemCount === 1) return 'col-12';
    if (itemCount === 2) return 'col-md-6';
    if (itemCount <= 3) return 'col-md-4';
    if (itemCount <= 6) return 'col-md-4 col-lg-4';
    if (itemCount <= 8) return 'col-md-4 col-lg-3';
    return 'col-md-6 col-lg-4 col-xl-3'; // Pour un grand nombre d'éléments
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des informations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Erreur</h2>
          <p>{error}</p>
          <Link to="/categories" className="btn-return">
            Retour aux catégories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <CategoryHeader 
        title={`Catégorie ${name.toUpperCase()}`}
        subtitle={`${category.age_min}-${category.age_max} ans`}
      />

      <div className="category-content">
        <div className="category-title">
          <h1>Catégorie {name.toUpperCase()}</h1>
          <span className="age-range">{category.age_min}-{category.age_max} ans</span>
        </div>

        <div className="category-nav">
          <button 
            className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>Informations</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => setActiveTab('planning')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Planning</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <FontAwesomeIcon icon={faUserTie} />
            <span>Staff</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <FontAwesomeIcon icon={faImages} />
            <span>Média</span>
          </button>
        </div>

        {activeTab === 'info' && (
          <div className="category-tab-content fade-in">
            {/* Objectifs et Description */}
            <div className="category-section objective-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faChartLine} />
                <h2>Objectif de la catégorie</h2>
              </div>
              <div className="objective-content">
                <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
                <p>{category.description || "Développement technique et tactique de base. Travail sur la coordination, la motricité et l'intelligence de jeu. Initiation à l'esprit d'équipe et à la compétition dans un cadre éducatif et ludique."}</p>
              </div>
            </div>

            {/* Effectif */}
            <div className="category-section team-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faUsers} />
                <h2>Effectif</h2>
              </div>
              {players.length > 0 ? (
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="stat-value">{players.length}</span>
                    <span className="stat-label">Joueurs</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-value">2</span>
                    <span className="stat-label">Équipes</span>
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  <p>Aucun joueur inscrit dans cette catégorie pour le moment</p>
                </div>
              )}
              {players.length > 0 && (
                <p className="team-note">
                  <FontAwesomeIcon icon={faInfoCircle} className="note-icon" />
                  Répartition en deux équipes (A et B) selon le niveau
                </p>
              )}
            </div>

            {/* Matchs et Résultats */}
            <div className="category-section matches-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faFutbol} />
                <h2>Matchs et résultats</h2>
              </div>
              {matches.length > 0 ? (
                <ul className="match-list">
                  {matches.map((match, index) => {
                    const isUpcoming = !match.result;
                    
                    return (
                      <li key={index} className={isUpcoming ? "upcoming" : ""}>
                        <div className="match-header">
                          <span className="match-date">
                            <FontAwesomeIcon icon={isUpcoming ? faClock : faHistory} /> 
                            {formatDate(match.date)}
                          </span>
                          {isUpcoming && <span className="match-badge">À venir</span>}
                          {!isUpcoming && <span className="match-badge" style={{ background: 'linear-gradient(45deg, #2ecc71, #27ae60)' }}>Terminé</span>}
                        </div>
                        <span className="match-teams" style={{ color: '#000000', fontWeight: '700', fontSize: '1.3rem', display: 'block', marginBottom: '10px' }}>
                          {category.name} <span style={{ color: '#f7a600' }}>vs</span> {match.opponent}
                          {match.result && <span className="match-result">{match.result}</span>}
                        </span>
                        {match.location && (
                          <span className="match-location">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {match.location}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="no-data">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  Aucun match programmé
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="category-tab-content fade-in">
            {/* Planning des entraînements */}
            <div className="category-section schedule-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <h2>Planning des entraînements</h2>
              </div>
              {schedules.length > 0 ? (
                <ul className="training-schedule">
                  {schedules.map((schedule, index) => (
                    <li key={index}>
                      <span className="training-day">{schedule.day}</span>
                      <span className="training-time">
                        <FontAwesomeIcon icon={faClock} className="time-icon" />
                        {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  Planning en cours de définition
                </p>
              )}
            </div>
            
            <div className="category-section schedule-info-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faInfoCircle} />
                <h2>Informations complémentaires</h2>
              </div>
              <div className="schedule-info-content">
                <ul className="info-list">
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Présence obligatoire 15 minutes avant le début de l'entraînement</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Tenue complète exigée (maillot, short, chaussettes, protège-tibias)</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Prévoir une bouteille d'eau personnelle</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>En cas d'absence, prévenir l'entraîneur 24h à l'avance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="category-tab-content fade-in">
            {/* Staff technique */}
            <div className="category-section coach-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faUserTie} />
                <h2>Staff technique</h2>
              </div>
              {coaches.length > 0 ? (
                <div className="coaches-grid">
                  {coaches.map((coach, index) => (
                    <div key={index} className="coach-info">
                      <div className="coach-avatar">
                        <FontAwesomeIcon icon={faUserTie} className="avatar-icon" />
                      </div>
                      <h3 className="coach-name">{coach.name}</h3>
                      <ul className="coach-details">
                        <li>
                          <FontAwesomeIcon icon={faGraduationCap} />
                          <span>Diplôme : {coach.qualification || "Brevet d'État 1er degré"}</span>
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faEnvelope} />
                          <span>Contact : {coach.email || "coach@academiefoot.com"}</span>
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faPhone} />
                          <span>Téléphone : {coach.phone || "+33 6 xx xx xx xx"}</span>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  Staff en cours de constitution
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="category-tab-content fade-in">
            
            {/* Onglets pour photos/vidéos */}
            <div className="media-tabs mb-4">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${media.photos.length > 0 ? 'active' : 'disabled'}`}
                    onClick={() => document.getElementById('photos-section').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <FontAwesomeIcon icon={faImages} className="me-2" />
                    Galerie photos
                  </button>
                </li>
                <li className="nav-item ms-3">
                  <button 
                    className={`nav-link ${media.videos.length > 0 ? '' : 'disabled'}`}
                    onClick={() => document.getElementById('videos-section').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <FontAwesomeIcon icon={faVideo} className="me-2" />
                    Galerie vidéos
                  </button>
                </li>
              </ul>
            </div>

            {/* Galerie Photos */}
            <div id="photos-section" className="category-section gallery-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faImages} />
                <h2>Galerie photo</h2>
              </div>
              {media.photos.length > 0 ? (
                <div className="photo-gallery">
                  <div className="row g-4">
                    {media.photos.map((photo, index) => (
                      <div key={index} className={`gallery-column ${getColumnClass(media.photos.length)}`}>
                        <div className="gallery-item">
                          <img src={photo.src} alt={photo.alt} className="img-fluid" loading="lazy" />
                          <div className="gallery-overlay">
                            <div className="gallery-caption">
                              <h5>{photo.title}</h5>
                              <p>{photo.category}</p>
                            </div>
                            <div className="gallery-icon" onClick={() => openMediaModal(photo, 'photo')}>
                              <FontAwesomeIcon icon={faExpand} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="gallery-placeholder">
                  <FontAwesomeIcon icon={faImages} className="placeholder-icon" />
                  <p>Les photos des entraînements et matchs seront bientôt disponibles</p>
                </div>
              )}
            </div>

            {/* Galerie Vidéos */}
            <div id="videos-section" className="category-section video-section mt-5">
              <div className="section-header">
                <FontAwesomeIcon icon={faVideo} />
                <h2>Vidéos</h2>
              </div>
              {media.videos.length > 0 ? (
                <div className="video-gallery">
                  <div className="row g-4">
                    {media.videos.map((video, index) => (
                      <div key={index} className={`gallery-column ${getColumnClass(media.videos.length)}`}>
                        <div className="video-item">
                          <div className="video-thumbnail">
                            {video.src.includes('youtube') ? (
                              <div className="youtube-container">
                                <iframe 
                                  src={`https://www.youtube-nocookie.com/embed/${video.src.split('v=')[1]?.split('&')[0] || video.src.split('/').pop()}`}
                                  title={video.title}
                                  className="img-fluid video-iframe"
                                  frameBorder="0"
                                  loading="lazy"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <video 
                                src={video.src} 
                                controls 
                                preload="metadata"
                                className="img-fluid"
                                poster={video.thumbnail || ''}
                              >
                                <source src={video.src} type="video/mp4" />
                                Votre navigateur ne supporte pas la lecture de vidéos.
                              </video>
                            )}
                          </div>
                          <div className="video-title">
                            <h5>{video.title}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <p>Les vidéos des matchs et entraînements seront bientôt disponibles</p>
                  <div className="video-placeholder-icon">
                    <FontAwesomeIcon icon={faVideo} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal pour afficher les médias en plein écran */}
      {isModalOpen && selectedMedia && (
        <div className="media-modal">
          <div className="media-modal-content">
            <div className="media-modal-header">
              <h3>{selectedMedia.title}</h3>
              <button className="close-button" onClick={closeMediaModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="media-modal-body">
              {selectedMedia.type === 'photo' ? (
                <img 
                  src={selectedMedia.src} 
                  alt={selectedMedia.alt} 
                  className="media-modal-image" 
                  loading="lazy"
                />
              ) : (
                <div className="media-modal-video">
                  {selectedMedia.src.includes('youtube') ? (
                    <iframe 
                      src={`https://www.youtube-nocookie.com/embed/${selectedMedia.src.split('v=')[1]?.split('&')[0] || selectedMedia.src.split('/').pop()}`}
                      title={selectedMedia.title}
                      frameBorder="0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={selectedMedia.src} 
                      controls 
                      autoPlay
                      className="media-modal-video-player"
                    >
                      <source src={selectedMedia.src} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  )}
                </div>
              )}
            </div>
            <div className="media-modal-footer">
              <p>Catégorie: {selectedMedia.category}</p>
            </div>
          </div>
          <div className="media-modal-backdrop" onClick={closeMediaModal}></div>
        </div>
      )}
    </div>
  );
}

export default CategoryDetail; 