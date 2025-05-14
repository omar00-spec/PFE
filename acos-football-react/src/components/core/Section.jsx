import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant Section réutilisable pour standardiser les sections du site
 * @param {string} id - ID unique pour la section
 * @param {string} className - Classes CSS additionnelles
 * @param {string} title - Titre principal de la section
 * @param {string} subtitle - Sous-titre de la section
 * @param {node} children - Contenu de la section
 * @param {string} backgroundColor - Couleur de fond
 * @param {object} style - Styles additionnels
 */
const Section = ({ 
  id,
  className,
  title,
  subtitle,
  children,
  backgroundColor = 'white',
  style = {}
}) => {
  return (
    <section 
      id={id} 
      className={`site-section py-5 ${className || ''}`}
      style={{ 
        backgroundColor, 
        padding: '80px 0',
        ...style 
      }}
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center">
              {title && (
                <h2 className="section-title fw-bold mb-3">{title}</h2>
              )}
              {title && subtitle && (
                <div className="section-divider mx-auto mb-4"></div>
              )}
              {subtitle && (
                <p className="section-subtitle fs-5">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

Section.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  style: PropTypes.object
};

export default Section; 