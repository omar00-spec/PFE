import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCamera, faSpinner, faTimes, faExpand } from '@fortawesome/free-solid-svg-icons';
import Section from '../core/Section';
import SectionTitle from '../core/SectionTitle';
import '../../styles/Media.css';

// Import des services
import { getMediaByType } from '../../services/mediaService';

const Media = () => {
  // État pour gérer les onglets actifs
  const [activeMediaTab, setActiveMediaTab] = useState('photos');
  
  // États pour stocker les données
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la modal plein écran
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les photos
        const photosData = await getMediaByType('photo');
        console.log("Photos récupérées:", photosData);
        setPhotos(photosData);
        
        // Récupérer les vidéos
        const videosData = await getMediaByType('video');
        console.log("Vidéos récupérées:", videosData);
        setVideos(videosData);
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des médias.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Ouvrir la modal pour afficher l'image ou la vidéo en plein écran
  const openMediaModal = (media, type) => {
    setSelectedMedia({ ...media, type });
    setIsModalOpen(true);
    // Désactiver le scroll du body quand la modal est ouverte
    document.body.style.overflow = 'hidden';
  };

  // Fermer la modal
  const closeMediaModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    // Réactiver le scroll du body
    document.body.style.overflow = 'auto';
  };

  // Fonction pour afficher le contenu média en fonction de l'onglet actif
  const renderMediaContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      );
    }

    switch (activeMediaTab) {
      case 'photos':
        return (
          <div className="photo-gallery">
            <div className="row g-4">
              {photos.length > 0 ? (
                photos.map(photo => (
                  <div key={photo.id} className={`gallery-column ${getColumnClass(photos.length)}`}>
                    <div className="gallery-item">
                      <img src={photo.file_path} alt={photo.title} className="img-fluid" />
                      <div className="gallery-overlay">
                        <div className="gallery-caption">
                          <h5>{photo.title}</h5>
                          <p>{photo.category?.name || 'Non catégorisé'}</p>
                        </div>
                        <div className="gallery-icon" onClick={() => openMediaModal(photo, 'photo')}>
                          <FontAwesomeIcon icon={faExpand} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>Aucune photo disponible pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'videos':
        return (
          <div className="video-gallery">
            <div className="row g-4">
              {videos.length > 0 ? (
                videos.map(video => (
                  <div key={video.id} className={`gallery-column ${getColumnClass(videos.length)}`}>
                    <div className="video-item">
                      <div className="video-thumbnail">
                        {/* Pour les vidéos embed, utilisez un iframe */}
                        {video.file_path.includes('youtube') || video.file_path.includes('embed') ? (
                          <iframe 
                            src={video.file_path.includes('youtube') && !video.file_path.includes('embed') ? 
                                 `https://www.youtube.com/embed/${video.file_path.split('v=')[1] || video.file_path.split('/').pop()}` : 
                                 video.file_path}
                            title={video.title}
                            className="img-fluid video-iframe"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video 
                            src={video.file_path.startsWith('http') ? video.file_path : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${video.file_path}`} 
                            controls 
                            className="img-fluid"
                            poster={video.thumbnail || ''}
                          />
                        )}
                        <div className="video-play-button" onClick={() => openMediaModal(video, 'video')}>
                          <FontAwesomeIcon icon={faExpand} />
                        </div>
                      </div>
                      <div className="video-title">
                        <h5>{video.title}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>Aucune vidéo disponible pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Fonction pour déterminer la classe de colonne en fonction du nombre d'éléments
  const getColumnClass = (itemCount) => {
    if (itemCount === 1) return 'col-12';
    if (itemCount === 2) return 'col-md-6';
    if (itemCount <= 3) return 'col-md-4';
    if (itemCount <= 6) return 'col-md-4 col-lg-4';
    if (itemCount <= 8) return 'col-md-4 col-lg-3';
    return 'col-md-6 col-lg-4 col-xl-3'; // Pour un grand nombre d'éléments
  };

  return (
    <>
      {/* Hero Section */}
      <div className="media-hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/IMG-20250601-WA0020.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto text-center">
              <h1 className="text-white">Médias</h1>
              <div className="section-divider mx-auto my-4"></div>
              <p className="text-white lead">
                Découvrez nos galeries photos et vidéos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Médias Section */}
      <Section id="medias" backgroundColor="#f8f9fa">
        <SectionTitle 
          title="Galerie Média" 
          subtitle="Plongez dans l'univers visuel de l'ACOS Football Academy"
        />
        
        <div className="media-tabs mb-5">
          <ul className="nav nav-pills justify-content-center">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeMediaTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('photos')}
              >
                <FontAwesomeIcon icon={faCamera} className="me-2" />
                Galerie photos
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeMediaTab === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('videos')}
              >
                <FontAwesomeIcon icon={faVideo} className="me-2" />
                Galerie vidéos
              </button>
            </li>
          </ul>
        </div>
        
        <div className="media-content">
          {renderMediaContent()}
        </div>

        {activeMediaTab === 'photos' && photos.length > 0 && (
          <div className="text-center mt-5">
            <button className="btn btn-outline-primary">
              Voir plus de photos <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        )}

        {activeMediaTab === 'videos' && videos.length > 0 && (
          <div className="text-center mt-5">
            <a href="https://www.youtube.com/channel/ACOS-Football-Academy" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
              Voir notre chaîne YouTube <i className="fab fa-youtube ms-2"></i>
            </a>
          </div>
        )}
      </Section>

      {/* Modal pour afficher les médias en plein écran */}
      {isModalOpen && selectedMedia && (
        <div className="media-modal">
          <div className="media-modal-content">
            <div className="media-modal-header">
              <h3>{selectedMedia.title}</h3>
              <button className="close-button" onClick={closeMediaModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="media-modal-body">
              {selectedMedia.type === 'photo' ? (
                <img 
                  src={selectedMedia.file_path} 
                  alt={selectedMedia.title} 
                  className="media-modal-image" 
                />
              ) : (
                <div className="media-modal-video">
                  <iframe 
                    src={selectedMedia.file_path.includes('youtube') && !selectedMedia.file_path.includes('embed') ? 
                         `https://www.youtube.com/embed/${selectedMedia.file_path.split('v=')[1] || selectedMedia.file_path.split('/').pop()}` : 
                         selectedMedia.file_path} 
                    title={selectedMedia.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
            <div className="media-modal-footer">
              <p>{selectedMedia.category?.name || 'Non catégorisé'}</p>
            </div>
          </div>
          <div className="media-modal-backdrop" onClick={closeMediaModal}></div>
        </div>
      )}
    </>
  );
};

export default Media; 