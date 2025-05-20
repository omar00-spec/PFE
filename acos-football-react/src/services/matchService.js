import api from './axios';

export const getMatchesByCategory = async (categoryId) => {
  try {
    console.log(`Récupération des matchs pour la catégorie ID: ${categoryId}`);
    const res = await api.get(`/api/matches?category_id=${categoryId}`);
    console.log(`Matchs récupérés (${res.data.length}):`, res.data);
    
    // Ajouter des logs pour voir quels matchs ont un résultat et lesquels n'en ont pas
    if (res.data && res.data.length > 0) {
      const upcomingMatches = res.data.filter(match => !match.result);
      const pastMatches = res.data.filter(match => !!match.result);
      
      console.log(`Matchs à venir (${upcomingMatches.length}):`, upcomingMatches);
      console.log(`Matchs passés avec résultat (${pastMatches.length}):`, pastMatches);
    }
    
    return res.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des matchs pour la catégorie ${categoryId}:`, error);
    throw error;
  }
};

export const getUpcomingMatches = async (limit = 5) => {
  try {
    const res = await api.get(`/api/matches`);
    
    // Afficher les données brutes reçues de l'API pour vérifier si l'heure est présente
    console.log('Données brutes des matchs reçues de l\'API:', res.data);
    
    // Les matchs à venir sont ceux sans résultat
    const upcomingMatches = res.data
      .filter(match => !match.result)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
    
    // Vérifier si l'heure est présente dans les matchs à venir
    console.log('Matchs à venir avec leurs heures:', upcomingMatches.map(m => ({id: m.id, date: m.date, time: m.time})));
    
    return upcomingMatches;
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs à venir:", error);
    return [];
  }
};

export const getPastMatches = async (limit = 5) => {
  try {
    const res = await api.get(`/api/matches`);
    
    // Les matchs passés sont ceux avec un résultat
    const pastMatches = res.data
      .filter(match => !!match.result)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    
    return pastMatches;
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs passés:", error);
    return [];
  }
}; 