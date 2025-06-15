import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import ContactForm from '../common/ContactForm';
import SectionTitle from '../core/SectionTitle';
import Section from '../core/Section';
import '../../styles/Contact.css';
import { preventUnwantedRedirects } from '../../utils/navigationFix';

const Contact = () => {
  // Effet pour empêcher les redirections non désirées
  useEffect(() => {
    // Appliquer les protections contre les redirections
    const cleanup = preventUnwantedRedirects();
    
    return () => {
      // Nettoyer les écouteurs d'événements lors du démontage
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="contact-hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/IMG-20250601-WA0015.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto text-center">
              <h1 className="text-white">Contactez-Nous</h1>
              <div className="section-divider mx-auto my-4"></div>
              <p className="text-white lead">
                Nous sommes à votre disposition pour répondre à toutes vos questions 
                concernant l'ACOS Football Academy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <Section id="contact-info" backgroundColor="#f8f9fa">
        <div className="row">
          <div className="col-lg-8 mb-5 mb-lg-0">
            <SectionTitle 
              title="Nous Sommes à Votre Écoute" 
              subtitle="Envoyez-nous un message pour une inscription ou toute information complémentaire"
              align="left"
            />
            <ContactForm />
          </div>
          
          <div className="col-lg-4">
            <div className="contact-info-sidebar">
              <h3>Informations de Contact</h3>
              <div className="divider mb-4"></div>
              
              <div className="contact-info-item">
                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                <div>
                  <h5>Téléphone</h5>
                  <p>+212 6XX XX XX XX</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <div>
                  <h5>Email</h5>
                  <p>acos.football@hotmail.com</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                <div>
                  <h5>Adresse</h5>
                  <p>El Oulfa, Casablanca, Maroc</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <FontAwesomeIcon icon={faClock} className="contact-icon" />
                <div>
                  <h5>Heures d'ouverture</h5>
                  <p>Lundi - Vendredi: 9h - 17h<br />Samedi: 9h - 12h</p>
                </div>
              </div>
              
              <div className="social-links mt-4">
                <h5>Suivez-nous</h5>
                <div className="d-flex gap-3 mt-2">
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
      </Section>

      {/* Map Section */}
      <Section id="map" padding="0" backgroundColor="white">
        <div className="row">
          <div className="col-12">
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26656.340448474312!2d-7.679444399999999!3d33.5731458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2e814a8b78d%3A0xb0b428712bedac83!2sEl%20Oulfa%2C%20Casablanca!5e0!3m2!1sfr!2sma!4v1649251234567!5m2!1sfr!2sma" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="ITTIHAD EL OULFA FOOTBALL CLUB Location"
              ></iframe>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" backgroundColor="#f8f9fa">
        <SectionTitle 
          title="Questions Fréquentes" 
          subtitle="Retrouvez les réponses aux questions les plus courantes"
        />
        
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="accordion" id="contactFaq">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    Comment inscrire mon enfant à l'académie?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#contactFaq">
                  <div className="accordion-body">
                    Pour inscrire votre enfant, vous pouvez utiliser le formulaire de contact sur cette page, nous appeler directement ou venir nous rencontrer à notre siège. Nous vous fournirons tous les documents nécessaires et vous guiderons tout au long du processus d'inscription.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    Quels sont les tarifs d'inscription?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#contactFaq">
                  <div className="accordion-body">
                    Les tarifs varient selon la catégorie d'âge et le programme choisi. Contactez-nous pour obtenir les informations détaillées concernant les frais d'inscription, les mensualités et les options de paiement disponibles.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    Mon enfant peut-il rejoindre l'académie en cours d'année?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#contactFaq">
                  <div className="accordion-body">
                    Oui, selon les places disponibles, votre enfant peut rejoindre l'académie à tout moment de l'année. Nous organisons des sessions d'intégration pour que chaque nouvel arrivant puisse s'adapter facilement au groupe et au programme.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                    Quels équipements mon enfant doit-il avoir?
                  </button>
                </h2>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#contactFaq">
                  <div className="accordion-body">
                    Chaque joueur inscrit reçoit un kit d'équipement complet comprenant maillot, short et chaussettes. Vous devrez fournir les chaussures adaptées, les protège-tibias et une gourde d'eau personnelle pour les entraînements et les matchs.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                    Y a-t-il des tournois ou des compétitions pour toutes les catégories?
                  </button>
                </h2>
                <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#contactFaq">
                  <div className="accordion-body">
                    Nous organisons des rencontres amicales pour toutes les catégories. Pour les U9 et plus, nous participons à des tournois régionaux et nationaux. Les catégories U13 et plus participent également à des championnats officiels selon leur niveau.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Contact; 