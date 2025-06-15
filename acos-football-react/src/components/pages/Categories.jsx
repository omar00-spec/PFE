import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faArrowRight, faFutbol, faTrophy } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/axios';
import '../../styles/Categories.css';

function Categories() {
  const navigate = useNavigate();
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

  // Fonction pour gérer la navigation vers une catégorie avec confirmation
  const handleCategoryClick = (e, categoryName) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Utiliser navigate au lieu de window.location
    navigate(`/categorie/${categoryName.toLowerCase()}`);
  };

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
      <div className="categories-header" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/2774679-travailler-dans-le-football-610x370.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto text-center">
              <h1 className="text-white">Nos Catégories</h1>
              <div className="section-divider mx-auto my-4"></div>
              <p className="lead text-white">
                Formation d'excellence pour tous les âges
              </p>
            </div>
          </div>
        </div>
      </div>

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
                  <button 
                    className="btn-view-details"
                    onClick={(e) => handleCategoryClick(e, category.name)}
                  >
                    Voir les détails
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
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