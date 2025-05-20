import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faNewspaper, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Section from '../core/Section';
import SectionTitle from '../core/SectionTitle';
import '../../styles/News.css';

// Import des services
import { getNewsOnly, getEventsOnly } from '../../services/newsService';
import { getUpcomingMatches, getPastMatches } from '../../services/matchService';

const News = () => {
  // État pour gérer les onglets actifs
  const [activeTab, setActiveTab] = useState('blog');
  
  // États pour stocker les données
  const [blogPosts, setBlogPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour la vue détaillée d'une actualité
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les news (type=news) 
        const newsData = await getNewsOnly();
        console.log("Actualités récupérées:", newsData);
        
        // Formater les actualités
        setBlogPosts(newsData.map(news => ({
          id: news.id,
          title: news.title,
          date: formatDate(news.date),
          excerpt: news.content.length > 150 ? news.content.substring(0, 150) + '...' : news.content,
          content: news.content,
          image: news.image || '/images/news-default.jpg',
          category: 'News'
        })));
        
        // Récupérer les événements (type=event)
        const eventsData = await getEventsOnly();
        console.log("Événements récupérés:", eventsData);
        
        // Formater les événements
        setEvents(eventsData.map(event => {
          return {
            id: event.id,
            title: event.title,
            date: formatDate(event.date),
            // Utiliser le champ dédié s'il existe, sinon valeur par défaut
            time: event.event_time || 'Horaire à confirmer',
            location: event.location || 'Lieu à confirmer',
            description: event.content,
            image: event.image
          };
        }));
        
        // Récupérer les matchs à venir (sans limite)
        const upcomingMatchesData = await getUpcomingMatches(100); // Augmenter la limite pour récupérer tous les matchs
        console.log("Matchs à venir récupérés (BRUT):", upcomingMatchesData);
        // Afficher les heures des matchs pour débogage
        upcomingMatchesData.forEach(match => {
          console.log(`Match ID ${match.id} - Date: ${match.date} - Heure: ${match.time || 'Non définie'}`);
        });
        setUpcomingMatches(upcomingMatchesData.map(match => ({
          id: match.id,
          homeTeam: "ACOS " + (match.category?.name || ""),
          awayTeam: match.opponent || "Équipe adverse",
          date: formatDate(match.date),
          // Utiliser directement l'heure du match depuis la base de données
          time: match.time || '15h00',
          location: match.location || "Lieu à confirmer"
        })));
        
        // Récupérer les résultats de matchs (sans limite)
        const pastMatchesData = await getPastMatches(100); // Augmenter la limite pour récupérer tous les résultats
        console.log("Résultats récupérés:", pastMatchesData);
        setResults(pastMatchesData.map(match => {
          // Gérer différents formats de résultats possibles
          let homeScore = 0;
          let awayScore = 0;
          let resultText = 'Terminé';
          
          if (match.result) {
            // Essayer de parser le format standard "Victoire 3-1" ou "Défaite 1-2"
            const resultParts = match.result.split(' ');
            if (resultParts.length > 1) {
              resultText = resultParts[0]; // "Victoire", "Défaite", "Nul"
              
              // Essayer de parser le score
              const scorePart = resultParts[1];
              if (scorePart && scorePart.includes('-')) {
                const scores = scorePart.split('-');
                homeScore = parseInt(scores[0]) || 0;
                awayScore = parseInt(scores[1]) || 0;
              }
            } else if (match.result.includes('-')) {
              // Format alternatif: juste le score "3-1"
              const scores = match.result.split('-');
              homeScore = parseInt(scores[0]) || 0;
              awayScore = parseInt(scores[1]) || 0;
              
              // Déterminer le résultat en fonction du score
              if (homeScore > awayScore) {
                resultText = 'Victoire';
              } else if (homeScore < awayScore) {
                resultText = 'Défaite';
              } else {
                resultText = 'Nul';
              }
            }
          }
          
          return {
            id: match.id,
            homeTeam: "ACOS " + (match.category?.name || ""),
            awayTeam: match.opponent || "Équipe adverse",
            homeScore: homeScore,
            awayScore: awayScore,
            date: formatDate(match.date),
            result: match.result || `${resultText} ${homeScore}-${awayScore}`
          };
        }));
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fonction pour afficher le contenu en fonction de l'onglet actif
  const renderNewsContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'blog':
        return (
          <div className="blog-posts row">
            {blogPosts.length > 0 ? (
              blogPosts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="blog-card">
                    <div className="blog-card-img">
                      <img src={post.image} alt={post.title} className="img-fluid" />
                      <span className="blog-category">{post.category}</span>
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-date">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        {post.date}
                      </div>
                      <h3 className="blog-title">{post.title}</h3>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <button 
                        onClick={() => {
                          setSelectedPost(post);
                          setShowDetailView(true);
                        }} 
                        className="blog-read-more"
                      >
                        Lire la suite
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Aucune actualité disponible pour le moment.</p>
              </div>
            )}
          </div>
        );
      case 'events':
        return (
          <div className="events">
            {events.length > 0 ? (
              events.map(event => (
                <div key={event.id} className="event-card mb-4">
                  <div className="event-date">
                    {event.date.split(' ').length > 1 ? (
                      <>
                        <span className="event-day">{event.date.split(' ')[0]}</span>
                        <span className="event-month">{event.date.split(' ')[1]}</span>
                      </>
                    ) : (
                      <span className="event-day">{event.date}</span>
                    )}
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-details mb-2">
                      <span className="event-time">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        {event.time}
                      </span>
                      <span className="event-location ms-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {event.location}
                      </span>
                    </div>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>Aucun événement disponible pour le moment.</p>
              </div>
            )}
          </div>
        );
      case 'matches':
        return (
          <div className="matches-container">
            <div className="matches-section mb-5">
              <h3 className="matches-section-title">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Matchs à venir
              </h3>
              <div className="row">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map(match => (
                    <div key={match.id} className="col-md-6 mb-4">
                      <div className="match-card upcoming">
                        <div className="match-date">{match.date}</div>
                        <div className="match-teams">
                          <div className="team home">{match.homeTeam}</div>
                          <div className="match-vs">VS</div>
                          <div className="team away">{match.awayTeam}</div>
                        </div>
                        <div className="match-info">
                          <div className="match-time">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                            {match.time} {/* Afficher l'heure du match */}
                          </div>
                          <div className="match-location">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {match.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>Aucun match à venir pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="matches-section">
              <h3 className="matches-section-title">
                <FontAwesomeIcon icon={faTrophy} className="me-2" />
                Résultats récents
              </h3>
              <div className="row">
                {results.length > 0 ? (
                  results.map(result => (
                    <div key={result.id} className="col-md-6 mb-4">
                      <div className="match-card result">
                        <div className="match-date">{result.date}</div>
                        <div className="match-teams">
                          <div className="team home">{result.homeTeam}</div>
                          <div className="match-score">
                            <span className="home-score">{result.homeScore}</span>
                            <span className="score-separator">-</span>
                            <span className="away-score">{result.awayScore}</span>
                          </div>
                          <div className="team away">{result.awayTeam}</div>
                        </div>
                        <div className="match-status">
                          {result.result ? result.result.split(' ')[0] : 'Terminé'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>Aucun résultat disponible pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Fonction pour fermer la vue détaillée
  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedPost(null);
  };

  // Composant pour la vue détaillée d'une actualité
  const NewsDetailView = ({ post, onClose }) => {
    if (!post) return null;
    
    // Fermer la vue détaillée quand on clique sur l'overlay (en dehors du contenu)
    const handleOverlayClick = (e) => {
      if (e.target.className === 'news-detail-overlay') {
        onClose();
      }
    };
    
    // Empêcher le défilement du corps de la page quand la vue détaillée est ouverte
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
    
    return (
      <div className="news-detail-overlay" onClick={handleOverlayClick}>
        <div className="news-detail-container">
          <button className="news-detail-close" onClick={onClose} aria-label="Fermer">
            <span>&times;</span>
          </button>
          
          <div className="news-detail-content">
            <div className="news-detail-header">
              <div className="news-detail-image-container">
                <img src={post.image} alt={post.title} className="news-detail-image" />
              </div>
              <div className="news-detail-meta">
                <span className="news-detail-category">{post.category}</span>
                <span className="news-detail-date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  {post.date}
                </span>
              </div>
              <h1 className="news-detail-title">{post.title}</h1>
            </div>
            
            <div className="news-detail-body">
              <div className="news-detail-text">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Vue détaillée d'une actualité */}
      {showDetailView && selectedPost && (
        <NewsDetailView post={selectedPost} onClose={closeDetailView} />
      )}
      
      {/* Hero Section */}
      <div className="news-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto text-center">
              <h1 className="text-white">Actualités</h1>
              <div className="section-divider mx-auto my-4"></div>
              <p className="text-white lead">
                Suivez toute l'actualité de l'ACOS Football Academy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actualités Section */}
      <Section id="actualites" backgroundColor="#f8f9fa">
        <SectionTitle 
          title="Actualités" 
          subtitle="Restez informé des dernières nouvelles de l'académie"
        />
        
        <div className="news-tabs mb-5">
          <ul className="nav nav-pills justify-content-center">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'blog' ? 'active' : ''}`}
                onClick={() => setActiveTab('blog')}
              >
                <FontAwesomeIcon icon={faNewspaper} className="me-2" />
                Blog / News
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Événements
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => setActiveTab('matches')}
              >
                <FontAwesomeIcon icon={faTrophy} className="me-2" />
                Matchs à venir / Résultats
              </button>
            </li>
          </ul>
        </div>
        
        <div className="tab-content">
          {renderNewsContent()}
        </div>
      </Section>
    </>
  );
};

export default News; 