import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCalendarAlt, faUserTie, faUsers, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { getCategoryByName } from '../../services/categoryService';
import '../../styles/CategoryDetail.css';
import CategoryHeader from '../common/CategoryHeader';
import ProgramSection from '../common/ProgramSection';
import TrainingSchedule from '../common/TrainingSchedule';
import MediaGallery from '../common/MediaGallery';
import CoachesSection from '../common/CoachesSection';
import MatchesSection from '../common/MatchesSection';
import SquadSection from '../common/SquadSection';

const CategoryTemplate = ({ categoryName }) => {
  const [category, setCategory] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        // Récupérer les informations de la catégorie
        const categoryResult = await getCategoryByName(categoryName);
        
        if (categoryResult && categoryResult.length > 0) {
          const categoryData = categoryResult[0];
          setCategory(categoryData);
          
          // Récupérer les données associées à cette catégorie
          const responses = await Promise.all([
            fetch(`http://localhost:8000/api/coaches?category_id=${categoryData.id}`),
            fetch(`http://localhost:8000/api/schedules?category_id=${categoryData.id}`),
            fetch(`http://localhost:8000/api/matches?category_id=${categoryData.id}`),
            fetch(`http://localhost:8000/api/players?category_id=${categoryData.id}`)
          ]);
          
          const [coachesData, schedulesData, matchesData, playersData] = await Promise.all(
            responses.map(res => res.json())
          );
          
          setCoaches(coachesData);
          setSchedules(schedulesData);
          setMatches(matchesData);
          setPlayers(playersData);
        } else {
          setError(`Catégorie ${categoryName} non trouvée`);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryName]);

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </div>
  );
  
  if (!category) return <div className="container mt-5">Aucune information trouvée</div>;

  // Formater la date pour les matchs
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Trouver le prochain match (futur) et le dernier résultat (passé)
  const now = new Date();
  const upcomingMatches = matches.filter(match => new Date(match.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastMatches = matches.filter(match => new Date(match.date) <= now && match.result)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  const lastResult = pastMatches.length > 0 ? pastMatches[0] : null;

  return (
    <div className="category-detail-container">
      <div className="category-section">
        <h1 className="section-title">
          <FontAwesomeIcon icon={faTrophy} className="icon-left" />
          Catégorie {category.name} {category && `(Moins de ${category.age_max} ans)`}
        </h1>
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          Objectif de la catégorie :
        </h2>
        <p className="category-description">
          {category.description || "Développement technique et tactique adapté à l'âge des joueurs."}
        </p>
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon-left" />
          Planning des entraînements :
        </h2>
        <ul className="training-schedule">
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <li key={index}>
                <strong>{schedule.day} :</strong> {schedule.start_time.substring(0, 5)} – {schedule.end_time.substring(0, 5)}
                {schedule.activity && ` (${schedule.activity})`}
              </li>
            ))
          ) : (
            <li><span className="no-data">Aucun horaire d'entraînement n'est défini pour cette catégorie</span></li>
          )}
        </ul>
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faUserTie} className="icon-left" />
          Entraîneur{coaches.length > 1 ? 's' : ''} :
        </h2>
        {coaches.length > 0 ? (
          <ul className="coach-info">
            {coaches.map((coach, index) => (
              <div key={index}>
                <li><strong>Nom :</strong> {coach.name}</li>
                <li><strong>Diplôme :</strong> {coach.diploma || "Non spécifié"}</li>
                <li><strong>Contact :</strong> {coach.email || "contact@academiefoot.com"}</li>
              </div>
            ))}
          </ul>
        ) : (
          <ul className="coach-info">
            <li><span className="no-data">Aucun entraîneur n'est assigné à cette catégorie pour le moment</span></li>
          </ul>
        )}
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faUsers} className="icon-left" />
          Effectif :
        </h2>
        <ul className="team-info">
          {players.length > 0 ? (
            <>
              <li><strong>{players.length} joueurs inscrits pour la saison 2024/2025</strong></li>
              <li>Répartition en équipes selon le niveau</li>
            </>
          ) : (
            <li><span className="no-data">Aucun joueur n'est inscrit dans cette catégorie pour le moment</span></li>
          )}
        </ul>
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faFutbol} className="icon-left" />
          Matchs et résultats :
        </h2>
        <ul className="matches-info">
          {nextMatch ? (
            <li>
              <strong>Prochain match :</strong> {formatDate(nextMatch.date)} à {nextMatch.date.substring(11, 16)} - vs {nextMatch.opponent}
            </li>
          ) : (
            <li><strong>Prochain match :</strong> <span className="no-data">Aucun match à venir n'est programmé</span></li>
          )}
          
          {lastResult ? (
            <li>
              <strong>Dernier résultat :</strong> {lastResult.result} contre {lastResult.opponent}
            </li>
          ) : (
            <li><strong>Dernier résultat :</strong> <span className="no-data">Aucun résultat disponible</span></li>
          )}
        </ul>
      </div>
      
      <div className="category-section">
        <h2 className="section-title">
          Galerie photo :
        </h2>
        <div className="photo-gallery">
          <p className="gallery-placeholder">
            <span className="no-data">Aucune image n'est disponible pour cette catégorie pour le moment</span>
          </p>
        </div>
      </div>
    </div>
  );
};

CategoryTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired
};

export default CategoryTemplate; 