import api from './axios';

/**
 * Services pour la gestion des médias (photos et vidéos)
 */

// Récupérer les médias par type (photo ou vidéo)
export const getMediaByType = async (type) => {
  try {
    const res = await api.get(`/api/media?type=${type}`);
    return res.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des médias de type ${type}:`, error);
    throw error;
  }
}; 