import api from './axios';

export const getNewsOnly = async () => {
  try {
    // Utiliser la nouvelle API ou filtrer par type
    const res = await api.get('/api/news?type=news');
    // Vérifier que les URL des images sont bien formatées
    const newsWithFormattedImages = res.data.map(item => {
      console.log(`Image originale pour ${item.id}: ${item.image}`);
      return item;
    });
    return newsWithFormattedImages;
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités:", error);
    return [];
  }
};

export const getEventsOnly = async () => {
  try {
    // Utiliser la nouvelle API ou filtrer par type
    const res = await api.get('/api/news?type=event');
    // Vérifier que les URL des images sont bien formatées
    const eventsWithFormattedImages = res.data.map(item => {
      console.log(`Image originale pour l'événement ${item.id}: ${item.image}`);
      return item;
    });
    return eventsWithFormattedImages;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return [];
  }
};

export const getLatestNews = async (limit = 4) => {
  try {
    const res = await api.get('/api/news?type=news');
    return res.data
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières actualités:", error);
    return [];
  }
}; 