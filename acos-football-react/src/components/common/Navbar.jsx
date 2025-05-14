import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.css'; // On va créer ce fichier de styles

function Navbar() {
  // État pour gérer l'ouverture du menu déroulant
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Fonction pour basculer l'état du menu déroulant
  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fermer le menu déroulant quand on clique sur un élément
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  
  // Gérer l'état du menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Détecter le défilement pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark navbar-black fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/images/logo-ACOS.png" alt="ACOS Football Academy" className={`logo-no-circle ${scrolled ? 'logo-small' : ''}`} />
        </Link>
        <button 
          className={`navbar-toggler navbar-dark ${mobileMenuOpen ? 'active' : ''}`} 
          type="button" 
          onClick={toggleMobileMenu}
          aria-controls="navbarNav" 
          aria-expanded={mobileMenuOpen} 
          aria-label="Toggle navigation"
        >
          <span className="toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto nav-fill">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-link-text">Accueil</span>
              </Link>
            </li>
            <li className={`nav-item dropdown ${isDropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
              <a 
                className="nav-link dropdown-toggle custom-dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                <span className="nav-link-text">Catégories</span>
              </a>
              <ul 
                className={`dropdown-menu custom-dropdown-menu ${isDropdownOpen ? 'show' : ''}`} 
                aria-labelledby="navbarDropdown"
              >
                <div className="dropdown-grid">
                  <div className="dropdown-column">
                    <li className="dropdown-header">Catégories</li>
                    <li><Link className="dropdown-item" to="/categories" onClick={closeDropdown}>Toutes les catégories</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li className="dropdown-header">Jeunes Sections</li>
                    <li><Link className="dropdown-item" to="/categorie/u5" onClick={closeDropdown}>U5</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/u7" onClick={closeDropdown}>U7</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/u9" onClick={closeDropdown}>U9</Link></li>
                  </div>
                  <div className="dropdown-column">
                    <li className="dropdown-header">Développement</li>
                    <li><Link className="dropdown-item" to="/categorie/u11" onClick={closeDropdown}>U11</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/u13" onClick={closeDropdown}>U13</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/u15" onClick={closeDropdown}>U15</Link></li>
                  </div>
                  <div className="dropdown-column">
                    <li className="dropdown-header">Élite</li>
                    <li><Link className="dropdown-item" to="/categorie/u17" onClick={closeDropdown}>U17</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/u19" onClick={closeDropdown}>U19</Link></li>
                    <li><Link className="dropdown-item" to="/categorie/seniors" onClick={closeDropdown}>Seniors</Link></li>
                  </div>
                </div>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/actualites" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-link-text">Actualités</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/medias" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-link-text">Médias</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inscription" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-link-text">Inscription</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-link-text">Contact</span>
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <a className="btn btn-primary nav-btn" href="#espace-membre">
                <span>Espace Membre</span>
              </a>
            </li>
            <li className="nav-item">
              <div id="language-toggle" className="language-toggle">
                <span className="flag flag-fr"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 