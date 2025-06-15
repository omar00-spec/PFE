import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import RegistrationForm from '../common/RegistrationForm';
import Section from '../core/Section';
import SectionTitle from '../core/SectionTitle';
import '../../styles/Registration.css';

const Registration = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="registration-hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/IMG-20250601-WA0007.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto text-center">
              <h1 className="text-white">Inscription à l'ACOS Football Academy</h1>
              <div className="section-divider mx-auto my-4"></div>
              <p className="text-white lead">
                Rejoignez notre académie et offrez à votre enfant une formation footballistique d'excellence
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <Section id="registration-process" backgroundColor="#f8f9fa">
        <SectionTitle 
          title="Processus d'Inscription" 
          subtitle="Comment inscrire votre enfant à l'ACOS Football Academy"
        />
        
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4><FontAwesomeIcon icon={faFile} className="me-2" />Remplir le formulaire</h4>
                  <p>Complétez le formulaire d'inscription en ligne ci-dessous ou téléchargez-le pour le remplir manuellement.</p>
                </div>
              </div>
             
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4><FontAwesomeIcon icon={faCheck} className="me-2" />Préparer les documents</h4>
                  <p>Rassemblez tous les documents requis: certificat médical, photo d'identité, copie de pièce d'identité et paiement.</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4><FontAwesomeIcon icon={faInfoCircle} className="me-2" />Finaliser l'inscription</h4>
                  <p>Soumettez votre formulaire en ligne ou apportez-le à notre académie avec tous les documents requis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Registration Form Section */}
      <Section id="registration-form" backgroundColor="white">
        <SectionTitle 
          title="Formulaire d'Inscription" 
          subtitle="Saison 2025/2026"
        />
        
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <RegistrationForm />
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="registration-faq" backgroundColor="#f8f9fa">
        <SectionTitle 
          title="Questions Fréquentes" 
          subtitle="À propos du processus d'inscription"
        />
        
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="accordion" id="registrationFaq">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    Quels sont les frais d'inscription?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#registrationFaq">
                  <div className="accordion-body">
                    Les frais d'inscription varient selon la catégorie et le programme choisi. Pour les catégories U5 à U9, les frais s'élèvent à [montant] par an. Pour les catégories U11 à U19, ils sont de [montant]. Ces frais couvrent les entraînements, l'équipement de base et la participation aux rencontres amicales.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    Est-il possible de s'inscrire en cours d'année?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#registrationFaq">
                  <div className="accordion-body">
                    Oui, nous acceptons les inscriptions tout au long de l'année, sous réserve de places disponibles dans la catégorie concernée. Les frais d'inscription peuvent être ajustés au prorata du temps restant pour la saison en cours.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    Le certificat médical est-il obligatoire?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#registrationFaq">
                  <div className="accordion-body">
                    Oui, le certificat médical attestant l'aptitude à la pratique du football est obligatoire pour tous les joueurs. Ce certificat doit être daté de moins de 3 mois au moment de l'inscription. Sans ce document, l'enfant ne pourra pas participer aux entraînements pour des raisons de sécurité.
                  </div>
                </div>
              </div>
              
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                    Puis-je payer en plusieurs fois?
                  </button>
                </h2>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#registrationFaq">
                  <div className="accordion-body">
                    Oui, nous proposons des facilités de paiement. Vous pouvez payer en 2 ou 3 fois (par chèque ou virement). Veuillez contacter notre équipe administrative pour discuter des options de paiement échelonné.
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

export default Registration; 