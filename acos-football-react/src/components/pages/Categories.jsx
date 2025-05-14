import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faArrowRight, faFutbol, faTrophy } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/axios';
import '../../styles/Categories.css';
import CategoryHeader from '../common/CategoryHeader';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des catégories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <CategoryHeader 
        title="Nos Catégories"
        subtitle="Formation d'excellence pour tous les âges"
        images={['/images/488639552_122149547504532835_4187688738517176191_n.jpg']}
      />

      <div className="categories-content">
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-card-inner">
                <div className="category-icon">
                  <FontAwesomeIcon icon={category.name.includes('U') ? faFutbol : faTrophy} />
                </div>
                <div className="category-info">
                  <h2>{category.name}</h2>
                  <span className="age-range">{category.age_min}-{category.age_max} ans</span>
                  <p className="category-description">
                    {category.description || "Développement technique et tactique adapté à l'âge des joueurs."}
                  </p>
                  <div className="category-stats">
                    <div className="stat">
                      <FontAwesomeIcon icon={faUsers} />
                      <span>20-25 joueurs</span>
                    </div>
                  </div>
                  <Link 
                    to={`/categorie/${category.name.toLowerCase()}`} 
                    className="btn-view-details"
                  >
                    Voir les détails
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="categories-info">
          <div className="info-section">
            <h3>Notre approche pédagogique</h3>
            <p>
              Chaque catégorie bénéficie d'un programme adapté et d'un encadrement 
              qualifié pour assurer le meilleur développement possible des joueurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories; 