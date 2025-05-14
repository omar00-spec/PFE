import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Composant de carrousel réutilisable avec transitions fluides
 * @param {Array} images - Tableau d'URLs des images
 * @param {Array} slides - Tableau d'objets contenant les titres et sous-titres pour chaque slide
 * @param {Object} buttonProps - Propriétés pour le bouton CTA (texte, lien, etc.)
 * @param {Number} interval - Intervalle en ms pour le défilement automatique
 */
const Carousel = ({ 
  images, 
  slides, 
  buttonProps = { text: 'En savoir plus', link: '#', style: {} },
  interval = 5000 
}) => {
  // État pour suivre l'index de l'image active
  const [activeIndex, setActiveIndex] = useState(0);

  // Effet pour faire avancer le carrousel automatiquement
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Fonctions pour naviguer manuellement
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Styles pour les éléments du carrousel
  const indicatorStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    margin: '0 8px',
    padding: 0,
    position: 'relative',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
  };

  const navButtonStyle = {
    width: '50px', 
    height: '50px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    background: 'rgba(0,0,0,0.5)', 
    borderRadius: '50%', 
    zIndex: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    position: 'absolute',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  };
  
  const subtitleStyle = {
    fontSize: '1.5rem',
    marginTop: '1rem',
    fontWeight: '300'
  };

  // Style par défaut pour le bouton
  const defaultButtonStyle = {
    backgroundColor: '#f7a600', 
    borderColor: '#f7a600', 
    borderRadius: '50px',
    padding: '10px 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };

  return (
    <div className="core-carousel" style={{ position: 'relative', height: '100vh' }}>
      {/* Images du carousel */}
      {images.map((image, index) => (
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
                  <h1 className="text-white animate__animated animate__fadeInDown" style={titleStyle}>
                    {slides[index].title}
                  </h1>
                  <p className="text-white lead animate__animated animate__fadeInUp" style={subtitleStyle}>
                    {slides[index].subtitle}
                  </p>
                  <div className="mt-5 animate__animated animate__fadeInUp" style={{animationDelay: '0.3s'}}>
                    <Link to={buttonProps.link} className="btn btn-primary btn-lg" style={{...defaultButtonStyle, ...buttonProps.style}}>
                      {buttonProps.text}
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
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            style={{
              ...indicatorStyle,
              backgroundColor: index === activeIndex ? '#f7a600' : '#ffffff',
              opacity: index === activeIndex ? 1 : 0.7
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Validation des props
Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired
    })
  ).isRequired,
  buttonProps: PropTypes.shape({
    text: PropTypes.string,
    link: PropTypes.string,
    style: PropTypes.object
  }),
  interval: PropTypes.number
};

export default Carousel; 