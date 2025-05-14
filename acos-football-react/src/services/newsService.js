import api from './axios';

export const getNewsOnly = async () => {
  try {
    // Utiliser la nouvelle API ou filtrer par type
    const res = await api.get('/api/news?type=news');
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités:", error);
    return [];
  }
};

export const getEventsOnly = async () => {
  try {
    // Utiliser la nouvelle API ou filtrer par type
    const res = await api.get('/api/news?type=event');
    return res.data;
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