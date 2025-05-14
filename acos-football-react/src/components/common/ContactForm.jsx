import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ContactForm.css';
import api from '../../services/axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
    loading: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Veuillez remplir tous les champs obligatoires (*).',
        loading: false
      });
      return;
    }

    try {
      setFormStatus({
        ...formStatus,
        loading: true
      });
      
      // Send data to the backend API
      await api.post('/api/contacts', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        childAge: formData.childAge || null,
        message: formData.message
      });
      
      // Handle successful submission
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Votre message a été envoyé avec succès! Nous vous contacterons bientôt.',
        loading: false
      });

      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        childAge: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.',
        loading: false
      });
    }
  };

  return (
    <div className="contact-form-container">
      {formStatus.submitted ? (
        <div className="form-success-message">
          <h4><FontAwesomeIcon icon={faPaperPlane} /> Message Envoyé!</h4>
          <p>{formStatus.message}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setFormStatus({ submitted: false, error: false, message: '', loading: false })}
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {formStatus.error && (
            <div className="alert alert-danger" role="alert">
              {formStatus.message}
            </div>
          )}
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Nom et Prénom *</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="childAge" className="form-label">Âge de l'enfant</label>
              <select
                className="form-select"
                id="childAge"
                name="childAge"
                value={formData.childAge}
                onChange={handleChange}
              >
                <option value="">Sélectionner un âge</option>
                <option value="4-5">4-5 ans (U5)</option>
                <option value="6-7">6-7 ans (U7)</option>
                <option value="8-9">8-9 ans (U9)</option>
                <option value="10-11">10-11 ans (U11)</option>
                <option value="12-13">12-13 ans (U13)</option>
                <option value="14-15">14-15 ans (U15)</option>
                <option value="16-17">16-17 ans (U17)</option>
                <option value="18-19">18-19 ans (U19)</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary btn-lg">
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Envoyer le message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm; 