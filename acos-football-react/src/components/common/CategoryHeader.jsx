import React from 'react';
import '../../styles/CategoryHeader.css';

function CategoryHeader({ title, subtitle, images }) {
  // Utilise la première image du tableau ou une image par défaut
  const headerImage = Array.isArray(images) && images.length > 0 
    ? images[0] 
    : '/images/488639552_122149547504532835_4187688738517176191_n.jpg';

  return (
    <div className="category-header-container">
      {/* Image de fond unique */}
      <div 
        className="category-header-image" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${headerImage})`,
          opacity: 1,
        }}
      />
      
      {/* Contenu (titre et ligne) */}
      <div className="container text-center h-100 d-flex flex-column justify-content-center align-items-center position-relative" style={{ zIndex: 2 }}>
        <h1 className="hero-title">{title}</h1>
        <div className="category-line"></div>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default CategoryHeader; 