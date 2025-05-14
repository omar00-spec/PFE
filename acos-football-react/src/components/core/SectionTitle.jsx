import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant pour afficher un titre de section standardisé
 * @param {string} title - Titre principal
 * @param {string} subtitle - Sous-titre optionnel
 * @param {string} align - Alignement du texte (left, center, right)
 * @param {string} className - Classes CSS additionnelles
 */
const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'center',
  className = ''
}) => {
  return (
    <div className={`section-header text-${align} mb-5 ${className}`}>
      <h2 className="section-title fw-bold mb-3">{title}</h2>
      
      {subtitle && (
        <>
          <div className={`section-divider mx-${align === 'center' ? 'auto' : '0'} mb-4`}></div>
          <p className="section-subtitle fs-5">{subtitle}</p>
        </>
      )}
    </div>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string
};

export default SectionTitle; 