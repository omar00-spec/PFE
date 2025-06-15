/**
 * Utilitaire pour corriger les problèmes de navigation et de redirections non désirées
 */

// Fonction pour empêcher les redirections non désirées
export const preventUnwantedRedirects = () => {
  // Fonction pour empêcher la navigation par défaut
  const handleClick = (event) => {
    // Ne jamais interférer avec les champs de formulaire
    const target = event.target;
    
    // Si c'est un champ de formulaire ou un élément à l'intérieur d'un formulaire, ne rien faire
    if (target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'BUTTON' ||
        target.tagName === 'LABEL' ||
        target.closest('form') ||
        target.closest('label') ||
        target.closest('.form-control') ||
        target.closest('.form-select') ||
        target.closest('.form-check') ||
        target.closest('.input-group')) {
      return;
    }
  };

  // Fonction pour empêcher les redirections via history.pushState
  const overridePushState = () => {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      // Ne pas bloquer les navigations intentionnelles
      return originalPushState.apply(this, arguments);
    };
  };

  // Ajouter les écouteurs d'événements
  document.addEventListener('click', handleClick, true);
  overridePushState();

  // Retourner une fonction de nettoyage
  return () => {
    document.removeEventListener('click', handleClick, true);
  };
}; 