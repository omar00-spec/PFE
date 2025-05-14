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
        
        // Récupérer les matchs à venir
        const upcomingMatchesData = await getUpcomingMatches(4);
        console.log("Matchs à venir récupérés:", upcomingMatchesData);
        setUpcomingMatches(upcomingMatchesData.map(match => ({
          id: match.id,
          homeTeam: "ACOS " + match.category?.name || "ACOS",
          awayTeam: match.opponent,
          date: formatDate(match.date),
          time: match.time || '15h00',
          location: match.location
        })));
        
        // Récupérer les résultats de matchs
        const pastMatchesData = await getPastMatches(4);
        console.log("Résultats récupérés:", pastMatchesData);
        setResults(pastMatchesData.map(match => {
          const resultParts = match.result ? match.result.split(' ') : [];
          const scores = resultParts.length > 1 ? resultParts[1].split('-') : ['0', '0'];
          
          return {
            id: match.id,
            homeTeam: "ACOS " + match.category?.name || "ACOS",
            awayTeam: match.opponent,
            homeScore: parseInt(scores[0]) || 0,
            awayScore: parseInt(scores[1]) || 0,
            date: formatDate(match.date),
            result: match.result
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
                      <a href="#" className="blog-read-more">Lire la suite</a>
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
                            {match.time}
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

  return (
    <>
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