import React, { useState, useEffect } from 'react';
import '../../styles/SplashScreen.css';

function SplashScreen({ children }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Commencer à faire disparaître l'écran de chargement après 2 secondes
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complètement retirer l'écran de chargement après la transition de fondu
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2000ms + 500ms pour l'animation

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  if (!loading) {
    // Si le chargement est terminé, afficher le contenu de l'application
    return children;
  }

  // Afficher l'écran de chargement avec le logo
  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img 
          src="/images/logo-ACOS.png" 
          alt="ACOS Football Academy" 
          className="splash-logo" 
        />
        <div className="splash-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen; 