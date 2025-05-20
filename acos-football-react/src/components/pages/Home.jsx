import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, faChalkboardTeacher, faChild, faFutbol,
  faCalendarAlt, faUserFriends, faMapMarkedAlt, faCheckCircle,
  faChevronLeft, faChevronRight, faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Home.css';
import '../../styles/News.css'; // Importer les styles de News pour la vue détaillée

// Import services for dynamic data
import { getUpcomingMatches } from '../../services/matchService';
import { getLatestNews } from '../../services/newsService';

function Home() {
  // État pour suivre l'index de l'image active
  const [activeIndex, setActiveIndex] = useState(0);
  // State for upcoming matches
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  // State for news
  const [latestNews, setLatestNews] = useState([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // État pour la vue détaillée d'une actualité
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Images du carrousel
  const carouselImages = [
    '/images/488404680_122149546250532835_3416029371251276575_n.jpg',
    '/images/488291644_122149546832532835_1462830048450472584_n.jpg',
    '/images/488639552_122149547504532835_4187688738517176191_n.jpg',
    '/images/488646908_122149546508532835_8677967410864736082_n.jpg',
  ];

  // Contenu des slides
  const slideContent = [
    {
      title: "PASSION ET ENGAGEMENT",
      subtitle: "Un environnement qui favorise l'esprit d'équipe et le dépassement de soi"
    },
    {
      title: "EXCELLENCE SPORTIVE",
      subtitle: "Une formation de qualité dispensée par des entraîneurs qualifiés"
    },
    {
      title: "DÉVELOPPEMENT COMPLET",
      subtitle: "Technique, tactique, physique et mental pour former des footballeurs accomplis"
    },
    {
      title: "PLAISIR ET APPRENTISSAGE",
      subtitle: "Apprendre tout en s'amusant dans un cadre bienveillant et dynamique"
    }
  ];

  // Fetch upcoming matches and latest news from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const matchesData = await getUpcomingMatches(3);
        const newsData = await getLatestNews(4);
        
        setUpcomingMatches(matchesData);
        setLatestNews(newsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Effet pour faire avancer le carrousel toutes les 8 secondes (plus lent)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fonctions pour naviguer manuellement
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Format date to French locale
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Définir les styles communs en dehors du JSX pour éviter la duplication
  const carouselIndicatorStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    margin: '0 8px',
    padding: 0,
    position: 'relative',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
  };
  
  const carouselItemBgStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100%',
    width: '100%',
    transition: 'all 1.2s ease-in-out'
  };
  
  const heroTitleStyle = {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  };
  
  const heroSubtitleStyle = {
    fontSize: '1.5rem',
    marginTop: '1rem',
    fontWeight: '300'
  };
  
  const actionsButtonStyle = {
    backgroundColor: '#f7a600', 
    borderColor: '#f7a600', 
    borderRadius: '50px',
    padding: '10px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };
  
  const navButtonStyle = {
    width: '50px', 
    height: '50px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    background: 'rgba(0,0,0,0.5)', 
    borderRadius: '50%', 
    zIndex: 20
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
      
      {/* Hero Section - Carousel personnalisé avec défilement automatique */}
      <div className="hero-carousel" style={{ position: 'relative', height: '100vh' }}>
        {/* Images du carousel */}
        {carouselImages.map((image, index) => (
          <div 
            key={index} 
            className={`carousel-item-custom ${index === activeIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image})`,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === activeIndex ? 1 : 0
            }}
          >
            <div className="carousel-content d-flex flex-column justify-content-center align-items-center h-100">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 mx-auto text-center">
                    <h1 className={`text-white ${index === activeIndex ? 'animate-title' : 'hidden-content'}`} style={heroTitleStyle}>
                      {slideContent[index].title}
                    </h1>
                    <p className={`text-white lead ${index === activeIndex ? 'animate-subtitle' : 'hidden-content'}`} style={heroSubtitleStyle}>
                      {slideContent[index].subtitle}
                    </p>
                    <div className={`mt-5 ${index === activeIndex ? 'animate-button' : 'hidden-content'}`}>
                      <Link to="#actualites" className="btn btn-primary btn-lg" style={actionsButtonStyle}>
                        ACTUALITÉS
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button 
          className="carousel-control-prev" 
          onClick={goToPrevious}
          style={{...navButtonStyle, left: '30px'}}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button 
          className="carousel-control-next" 
          onClick={goToNext}
          style={{...navButtonStyle, right: '30px'}}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators-custom" style={{
          position: 'absolute',
          bottom: '30px',
          left: 0,
          right: 0,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          width: 'fit-content'
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              style={{
                ...carouselIndicatorStyle,
                backgroundColor: index === activeIndex ? '#f7a600' : '#ffffff',
                opacity: index === activeIndex ? 1 : 0.7
              }}
            />
          ))}
        </div>
      </div>

      {/* Présentation Section */}
      <section className="py-5" id="presentation">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="presentation-image">
                <img src="/images/488643870_122149547516532835_5027201394524829662_n.jpg" alt="ACOS Football Academy" className="img-fluid rounded shadow" />
                <div className="presentation-experience">
                  <span className="number">5</span>
                  <span className="text">Années d'Excellence</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header text-start">
                <h2>Bienvenue à ACOS Football Academy</h2>
              </div>
              <p className="lead mb-4">Une académie d'excellence dédiée à la formation des jeunes footballeurs de tous niveaux</p>
              <p>ACOS Football Academy est bien plus qu'une simple école de football.
                Nous offrons un environnement professionnel où chaque joueur peut développer son potentiel technique,
                tactique et mental.</p>
              <div className="row mt-4">
                <div className="col-md-6 mb-3">
                  <div className="feature-box">
                    <FontAwesomeIcon icon={faTrophy} />
                    <h5>Excellence Sportive</h5>
                    <p>Des entraîneurs certifiés pour un développement optimal</p>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-box">
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                    <h5>Approche Éducative</h5>
                    <p>Un suivi personnalisé pour chaque joueur</p>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-box">
                    <FontAwesomeIcon icon={faChild} />
                    <h5>Développement Personnel</h5>
                    <p>Des valeurs fortes transmises par le sport</p>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-box">
                    <FontAwesomeIcon icon={faFutbol} />
                    <h5>Passion du Football</h5>
                    <p>Le plaisir de jouer au cœur de notre philosophie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Section */}
      <section className="section-padding bg-light" id="categories">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">Nos Catégories</h2>
              <div className="section-line mx-auto"></div>
              <p className="lead">Une formation adaptée à chaque âge et niveau</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U5</h3>
                  <span className="age-range">4-5 ans</span>
                </div>
                <div className="category-card-body">
                  <p>Découverte ludique du football pour les tout-petits, axée sur la motricité et la socialisation.</p>
                  <Link to="/categorie/u5" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U7</h3>
                  <span className="age-range">6-7 ans</span>
                </div>
                <div className="category-card-body">
                  <p>Initiation aux bases techniques dans un cadre ludique et développement des habiletés motrices.</p>
                  <Link to="/categorie/u7" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U9</h3>
                  <span className="age-range">8-9 ans</span>
                </div>
                <div className="category-card-body">
                  <p>Apprentissage technique plus approfondi et introduction aux principes collectifs de base.</p>
                  <Link to="/categorie/u9" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U11</h3>
                  <span className="age-range">10-11 ans</span>
                </div>
                <div className="category-card-body">
                  <p>Perfectionnement technique et tactique avec des situations de jeu plus complexes.</p>
                  <Link to="/categorie/u11" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U13</h3>
                  <span className="age-range">12-13 ans</span>
                </div>
                <div className="category-card-body">
                  <p>Développement tactique avancé et travail des phases de transition offensive et défensive.</p>
                  <Link to="/categorie/u13" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="category-card">
                <div className="category-card-header">
                  <h3>U15+</h3>
                  <span className="age-range">14 ans et +</span>
                </div>
                <div className="category-card-body">
                  <p>Formation complète et spécialisation par poste pour les joueurs plus âgés et confirmés.</p>
                  <Link to="/categorie/u15" className="btn btn-outline-primary btn-sm">En savoir plus</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Inscription */}
      <section className="cta-section py-5" id="inscription">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="text-white">Rejoignez l'ACOS Football Academy</h2>
              <p className="text-white mb-4">Inscrivez votre enfant dès aujourd'hui et offrez-lui une formation footballistique d'excellence</p>
              <Link to="/inscription" className="btn btn-light">Inscription en ligne</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section - NEW SECTION */}
      <section className="py-5 bg-light" id="matches">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">Prochains Matchs</h2>
              <div className="section-line mx-auto"></div>
              <p className="lead">Suivez les prochaines rencontres de nos équipes</p>
            </div>
          </div>
          
          <div className="row">
            {isLoading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : upcomingMatches.length > 0 ? (
              upcomingMatches.map((match, index) => (
                <div key={match.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="match-card">
                    <div className="match-card-header">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      <span>{formatDate(match.date)}</span>
                    </div>
                    <div className="match-card-body">
                      <h3>
                        <span className="team">ACOS {match.category?.name || ''}</span>
                        <span className="vs">VS</span>
                        <span className="opponent">{match.opponent}</span>
                      </h3>
                      <div className="match-details">
                        <div>
                          <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
                          <span>{match.location}</span>
                        </div>
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
          
          <div className="row mt-4">
            <div className="col-12 text-center">
              <Link to="/matches" className="btn btn-outline-primary">Voir tous les matchs</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités et Médias */}
      <section className="py-5" id="actualites">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">Actualités et Médias</h2>
              <div className="section-line mx-auto"></div>
              <p className="lead">Découvrez les dernières actualités et médias liées à ACOS Football Academy</p>
            </div>
          </div>
          
          <div className="row">
            {isLoading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : latestNews.length > 0 ? (
              latestNews.map((news) => (
                <div key={news.id} className="col-md-6 col-lg-3 mb-4">
                  <div className="news-card">
                    <img 
                      src={news.image || "/images/default-news.jpg"} 
                      alt={news.title} 
                      className="img-fluid rounded shadow"
                    />
                    <div className="news-card-body">
                      <h3>{news.title}</h3>
                      <p>{news.content.substring(0, 80)}...</p>
                      <button 
                        onClick={() => {
                          setSelectedPost({
                            id: news.id,
                            title: news.title,
                            date: formatDate(news.date),
                            content: news.content,
                            image: news.image || '/images/news-default.jpg',
                            category: 'News'
                          });
                          setShowDetailView(true);
                        }} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        Lire la suite
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Aucune actualité pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home; 