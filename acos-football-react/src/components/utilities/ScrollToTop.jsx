import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui assure le retour en haut de la page lors de chaque navigation
 * Ce composant ne rend rien visuellement, il exécute uniquement le scrollToTop à chaque changement de route
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll vers le haut de la page lors du changement de route
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Ce composant ne rend rien visuellement
}

export default ScrollToTop; 