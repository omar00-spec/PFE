import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

function MediaGallery({ title, photos, videos }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <section id="medias-categorie" className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">{title || "Galerie Photos & Vidéos"}</h2>
              <div className="section-line mx-auto"></div>
            </div>
            <div className="col-12">
              <div className="row g-4">
                {/* Photos */}
                {photos && photos.map((photo, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="media-card">
                      <img 
                        src={photo.src} 
                        alt={photo.alt || `Photo ${index + 1}`} 
                        className="img-fluid rounded" 
                      />
                      <div className="media-overlay">
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          openModal(photo.src);
                        }}>
                          <FontAwesomeIcon icon={faExpand} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Vidéos */}
                {videos && videos.map((video, index) => (
                  <div className="col-md-6 mt-4" key={index}>
                    <div className="video-container rounded">
                      <iframe 
                        width="100%" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title || `Vidéo ${index + 1}`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link to="/medias" className="btn btn-outline-primary">Voir plus de photos et vidéos</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour les médias */}
      {selectedImage && (
        <div className="modal fade show" style={{ display: 'block' }} id="mediaModal" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-center">
                <img src={selectedImage} alt="Media" className="img-fluid" id="modalImage" />
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal}></div>
        </div>
      )}
    </>
  );
}

export default MediaGallery; 