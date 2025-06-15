import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBars, faTimes, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAuthenticated, userType } = useAuth();
  
  // État pour gérer l'ouverture du menu déroulant
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const [mobileMemberMenuOpen, setMobileMemberMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const memberMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const mobileMemberMenuRef = useRef(null);
  
  // Fonction pour basculer l'état du menu déroulant
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation aux éléments parents
    setIsDropdownOpen(!isDropdownOpen);
    
    // Si on ouvre le menu, s'assurer que le menu est visible
    if (!isDropdownOpen) {
      const categoriesMenu = document.querySelector('.categories-menu');
      if (categoriesMenu) {
        categoriesMenu.style.display = 'flex';
        setTimeout(() => {
          categoriesMenu.classList.add('show');
        }, 10);
      }
    }
  };

  // Fonction pour fermer le menu déroulant
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    const categoriesMenu = document.querySelector('.categories-menu');
    if (categoriesMenu) {
      categoriesMenu.classList.remove('show');
      setTimeout(() => {
        if (!isDropdownOpen) {
          categoriesMenu.style.display = 'none';
        }
      }, 300);
    }
  };

  // Fonction pour gérer la navigation vers une catégorie
  const handleCategoryClick = (e) => {
    // Fermer le menu déroulant immédiatement
    setIsDropdownOpen(false);
    
    // Fermer le menu mobile et autres menus
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMemberMenuOpen(false);
    setMobileUserMenuOpen(false);
    setMobileMemberMenuOpen(false);
    setLanguageMenuOpen(false);
    
    // Supprimer la classe menu-open du body
    document.body.classList.remove('menu-open');
    
    // Ajouter un petit délai pour permettre à l'animation de se terminer
    setTimeout(() => {
      const categoriesMenu = document.querySelector('.categories-menu');
      if (categoriesMenu) {
        categoriesMenu.style.display = 'none';
      }
    }, 300);
  };
  
  // Gérer l'état du menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Fermer les autres menus ouverts
    if (!mobileMenuOpen) {
      setIsDropdownOpen(false);
      setUserMenuOpen(false);
      setMemberMenuOpen(false);
      setMobileUserMenuOpen(false);
      setMobileMemberMenuOpen(false);
      setLanguageMenuOpen(false);
    }
    
    // Ajouter/supprimer une classe au body pour éviter le défilement quand le menu est ouvert
    document.body.classList.toggle('menu-open', !mobileMenuOpen);
  };

  // Fonction pour basculer le menu utilisateur
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Fonction pour basculer le menu utilisateur mobile
  const toggleMobileUserMenu = () => {
    setMobileUserMenuOpen(!mobileUserMenuOpen);
  };
  
  // Gérer la déconnexion
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileUserMenuOpen(false);
    navigate('/');
  };
  
  // Fonction pour basculer le menu espace membre
  const toggleMemberMenu = () => {
    setMemberMenuOpen(!memberMenuOpen);
  };
  
  // Fonction pour basculer le menu espace membre mobile
  const toggleMobileMemberMenu = () => {
    setMobileMemberMenuOpen(!mobileMemberMenuOpen);
  };
  
  // Fermer le menu mobile quand on clique sur un lien
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setUserMenuOpen(false);
    setMemberMenuOpen(false);
    setMobileUserMenuOpen(false);
    setMobileMemberMenuOpen(false);
    setLanguageMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  // Fonction pour basculer le menu langue
  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };
  
  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      // Vérifier si le clic est en dehors du menu déroulant des catégories
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (memberMenuRef.current && !memberMenuRef.current.contains(event.target)) {
        setMemberMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false);
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target)) {
        setMobileUserMenuOpen(false);
      }
      if (mobileMemberMenuRef.current && !mobileMemberMenuRef.current.contains(event.target)) {
        setMobileMemberMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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

  // Ajouter un effet pour gérer les clics sur le document entier
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Si le menu des catégories est ouvert et que le clic est en dehors du menu
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    // Ajouter l'écouteur d'événements au document
    document.addEventListener('click', handleDocumentClick);

    // Nettoyer l'écouteur d'événements lors du démontage
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isDropdownOpen]);

  // Empêcher le défilement lorsque le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  // Nouveau hook pour gérer le calcul de la hauteur du menu
  useEffect(() => {
    // Fonction pour ajuster la hauteur du menu des catégories en mobile
    const adjustCategoriesMenuHeight = () => {
      const isMobile = window.innerWidth < 992;
      if (isMobile) {
        const categoriesMenu = document.querySelector('.categories-menu');
        if (categoriesMenu) {
          if (isDropdownOpen) {
            categoriesMenu.style.height = 'auto';
            categoriesMenu.style.opacity = '1';
            categoriesMenu.style.display = 'flex';
          } else {
            categoriesMenu.style.height = '0';
            categoriesMenu.style.opacity = '0';
          }
        }
      } else {
        // En mode desktop
        const categoriesMenu = document.querySelector('.categories-menu');
        if (categoriesMenu) {
          if (isDropdownOpen) {
            categoriesMenu.style.display = 'flex';
            categoriesMenu.style.opacity = '1';
            categoriesMenu.style.visibility = 'visible';
          } else {
            categoriesMenu.style.opacity = '0';
            categoriesMenu.style.visibility = 'hidden';
            setTimeout(() => {
              if (!isDropdownOpen) {
                categoriesMenu.style.display = 'none';
              }
            }, 300);
          }
        }
      }
    };
    
    adjustCategoriesMenuHeight();
    
    // Ajouter un écouteur de redimensionnement
    window.addEventListener('resize', adjustCategoriesMenuHeight);
    
    return () => {
      window.removeEventListener('resize', adjustCategoriesMenuHeight);
    };
  }, [isDropdownOpen]);

  // Fermer tous les menus lors d'un changement de route
  useEffect(() => {
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMemberMenuOpen(false);
    setMobileUserMenuOpen(false);
    setMobileMemberMenuOpen(false);
    setLanguageMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  // Fermer tous les menus lors du montage et démontage du composant
  useEffect(() => {
    // Fonction pour fermer tous les menus
    const closeAllMenus = () => {
      setIsDropdownOpen(false);
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setMemberMenuOpen(false);
      setMobileUserMenuOpen(false);
      setMobileMemberMenuOpen(false);
      setLanguageMenuOpen(false);
      document.body.classList.remove('menu-open');
    };

    // Fermer les menus au montage du composant
    closeAllMenus();

    // Ajouter un gestionnaire pour les clics sur les liens
    const handleLinkClicks = () => {
      closeAllMenus();
    };

    // Ajouter des écouteurs d'événements pour les liens
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClicks);
    });

    // Nettoyer les écouteurs d'événements lors du démontage
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClicks);
      });
      closeAllMenus();
    };
  }, []);

  // Déterminer le lien du dashboard en fonction du type d'utilisateur
  const getDashboardLink = () => {
    if (!userType) return '/login';
    
    if (userType === 'player') {
      return '/player-dashboard';
    } else if (userType === 'coach') {
      return '/coach-dashboard';
    } else if (userType === 'parent') {
      return '/parent-dashboard';
    } else if (userType === 'admin') {
      return '/admin-dashboard';
    }
    
    return '/dashboard';
  };

  // Obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = () => {
    if (!currentUser) {
      return 'Utilisateur';
    }
    
    return currentUser.name || currentUser.firstname || currentUser.email;
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark navbar-black fixed-top ${scrolled ? 'navbar-scrolled' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleLinkClick}>
          <div className="navbar-logos d-flex align-items-center" style={{ gap: '6px' }}>
            <img src="/images/image-removebg-preview (1).png" alt="ITTIHAD EL OULFA FOOTBALL CLUB Logo" className={`logo-no-circle ${scrolled ? 'logo-small' : ''}`} />
            <img src="/images/image1-removebg-preview.png" alt="ITTIHAD EL OULFA FOOTBALL CLUB Secondary Logo" className={`logo-no-circle ${scrolled ? 'logo-small' : ''}`} />
          </div>
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
        
        {/* Desktop language switcher and member area */}
        <div className="desktop-nav-buttons d-none d-lg-flex">
          <div className="language-selector me-2" ref={languageMenuRef}>
            <button className="btn btn-link language-btn" onClick={toggleLanguageMenu}>
              <FontAwesomeIcon icon={faGlobe} className="me-1" />
              <span className="flag flag-fr"></span>
            </button>
            {languageMenuOpen && (
              <div className="language-dropdown-menu">
                <button className="language-dropdown-item active">
                  <span className="flag flag-fr me-2"></span>
                  Français
                </button>
                <button className="language-dropdown-item">
                  <span className="flag flag-en me-2"></span>
                  English
                </button>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="btn btn-primary nav-btn" 
                onClick={toggleUserMenu}
              >
                <FontAwesomeIcon icon={faUser} className="me-1" />
                <span>{getUserDisplayName()}</span>
              </button>
              
              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link 
                    to={getDashboardLink()} 
                    className="user-dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLinkClick();
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Mon espace
                  </Link>
                  <button 
                    className="user-dropdown-item logout-btn" 
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="member-menu-container" ref={memberMenuRef}>
              <button 
                className="btn btn-primary nav-btn" 
                onClick={toggleMemberMenu}
              >
                <span>Espace Membre</span>
              </button>
              
              {memberMenuOpen && (
                <div className="member-dropdown-menu">
                  <Link 
                    to="/login" 
                    className="member-dropdown-item"
                    onClick={() => {
                      setMemberMenuOpen(false);
                      handleLinkClick();
                      localStorage.setItem('userType', 'player');
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Joueur
                  </Link>
                  <Link 
                    to="/login" 
                    className="member-dropdown-item"
                    onClick={() => {
                      setMemberMenuOpen(false);
                      handleLinkClick();
                      localStorage.setItem('userType', 'coach');
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Coach
                  </Link>
                  <Link 
                    to="/login" 
                    className="member-dropdown-item"
                    onClick={() => {
                      setMemberMenuOpen(false);
                      handleLinkClick();
                      localStorage.setItem('userType', 'parent');
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Parent
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto nav-fill">
            <div className="mobile-top-section">
              {isAuthenticated ? (
                <li className="nav-item ms-lg-3 mobile-top-item" ref={mobileUserMenuRef}>
                  <div className="user-menu-container">
                    <button 
                      className="btn btn-primary nav-btn" 
                      onClick={toggleMobileUserMenu}
                    >
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      <span>{getUserDisplayName()}</span>
                    </button>
                    
                    {mobileUserMenuOpen && (
                      <div className="user-dropdown-menu">
                        <Link 
                          to={getDashboardLink()} 
                          className="user-dropdown-item"
                          onClick={() => {
                            setMobileUserMenuOpen(false);
                            handleLinkClick();
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Mon espace
                        </Link>
                        <button 
                          className="user-dropdown-item logout-btn" 
                          onClick={handleLogout}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <li className="nav-item ms-lg-3 mobile-top-item" ref={mobileMemberMenuRef}>
                  <div className="member-menu-container">
                    <button 
                      className="btn btn-primary nav-btn" 
                      onClick={toggleMobileMemberMenu}
                    >
                      <span>Espace Membre</span>
                    </button>
                    
                    {mobileMemberMenuOpen && (
                      <div className="member-dropdown-menu">
                        <Link 
                          to="/login" 
                          className="member-dropdown-item"
                          onClick={() => {
                            setMobileMemberMenuOpen(false);
                            handleLinkClick();
                            localStorage.setItem('userType', 'player');
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Joueur
                        </Link>
                        <Link 
                          to="/login" 
                          className="member-dropdown-item"
                          onClick={() => {
                            setMobileMemberMenuOpen(false);
                            handleLinkClick();
                            localStorage.setItem('userType', 'coach');
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Coach
                        </Link>
                        <Link 
                          to="/login" 
                          className="member-dropdown-item"
                          onClick={() => {
                            setMobileMemberMenuOpen(false);
                            handleLinkClick();
                            localStorage.setItem('userType', 'parent');
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Parent
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              )}
              <li className="nav-item mobile-top-item">
                <div id="language-toggle" className="language-toggle">
                  <span className="flag flag-fr"></span>
                </div>
              </li>
            </div>
            
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleLinkClick}>
                <span className="nav-link-text">Accueil</span>
              </Link>
            </li>
            <li className={`nav-item categories-item dropdown ${isDropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
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
              <div 
                className={`dropdown-menu custom-dropdown-menu categories-menu ${isDropdownOpen ? 'show' : ''}`} 
                aria-labelledby="navbarDropdown"
                style={{ display: isDropdownOpen ? 'flex' : 'none' }}
              >
                <div className="dropdown-grid">
                  <div className="dropdown-column jeunes-sections">
                    <Link className="dropdown-item" to="/categorie/u5" onClick={handleCategoryClick}>U5</Link>
                    <Link className="dropdown-item" to="/categorie/u7" onClick={handleCategoryClick}>U7</Link>
                    <Link className="dropdown-item" to="/categorie/u9" onClick={handleCategoryClick}>U9</Link>
                    <Link className="dropdown-item" to="/categorie/u11" onClick={handleCategoryClick}>U11</Link>
                    <Link className="dropdown-item" to="/categorie/u13" onClick={handleCategoryClick}>U13</Link>
                  </div>
                  <div className="dropdown-column developpement">
                    <Link className="dropdown-item" to="/categorie/u15" onClick={handleCategoryClick}>U15</Link>
                    <Link className="dropdown-item" to="/categorie/u17" onClick={handleCategoryClick}>U17</Link>
                    <Link className="dropdown-item" to="/categorie/u19" onClick={handleCategoryClick}>U19</Link>
                    <Link className="dropdown-item" to="/categorie/seniors" onClick={handleCategoryClick}>Seniors</Link>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item actualites-item">
              <Link className="nav-link" to="/actualites" onClick={handleLinkClick}>
                <span className="nav-link-text">Actualités</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/medias" onClick={handleLinkClick}>
                <span className="nav-link-text">Médias</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inscription" onClick={handleLinkClick}>
                <span className="nav-link-text">Inscription</span>
              </Link>
            </li>
            <li className="nav-item contact-item">
              <Link className="nav-link" to="/contact" onClick={handleLinkClick}>
                <span className="nav-link-text">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 