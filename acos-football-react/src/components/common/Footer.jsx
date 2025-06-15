import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-top py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="footer-logo-section">
                <div className="footer-logos d-flex align-items-center mb-3" style={{ gap: '8px' }}>
                  <img src="/images/image-removebg-preview (1).png" alt="ITTIHAD EL OULFA FOOTBALL CLUB Logo" className="footer-logo" />
                  <img src="/images/image1-removebg-preview.png" alt="ITTIHAD EL OULFA FOOTBALL CLUB Secondary Logo" className="footer-logo" />
                </div>
                <h5 className="text-gold">ITTIHAD EL OULFA FOOTBALL CLUB</h5>
                <p className="mt-3 mb-4">Développer les talents de demain à travers une formation d'excellence et des valeurs fortes.</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title mb-4">Liens rapides</h5>
              <ul className="footer-links">
                <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/">Accueil</Link></li>
                <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/actualites">Actualités</Link></li>
                <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/medias">Médias</Link></li>
                <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/inscription">Inscription</Link></li>
                <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title mb-4">Catégories</h5>
              <div className="row">
                <div className="col-6">
                  <ul className="footer-links">
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u5">U5</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u7">U7</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u9">U9</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u11">U11</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u13">U13</Link></li>
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="footer-links">
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u15">U15</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u17">U17</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/categorie/u19">U19</Link></li>
                    <li><FontAwesomeIcon icon={faChevronRight} className="me-2 text-gold" /><Link to="/seniors">Seniors</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title mb-4">Contact</h5>
              <ul className="footer-contact">
                <li><FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-gold" /> El Oulfa, Casablanca, Maroc</li>
                <li><FontAwesomeIcon icon={faPhone} className="me-3 text-gold" /> +212 6XX XX XX XX</li>
                <li><FontAwesomeIcon icon={faEnvelope} className="me-3 text-gold" /> acos.football@hotmail.com</li>
              </ul>
              
              <h5 className="footer-title mt-4 mb-3">Suivez-nous</h5>
              <div className="social-links">
                <a href="https://www.facebook.com/acosfootballacademy" className="social-icon" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="https://www.instagram.com/acosfootballacademy" className="social-icon" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">&copy; {new Date().getFullYear()} ITTIHAD EL OULFA FOOTBALL CLUB. Tous droits réservés.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0">Conçu avec <span className="text-gold">♥</span> par ITTIHAD EL OULFA Dev Team</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 