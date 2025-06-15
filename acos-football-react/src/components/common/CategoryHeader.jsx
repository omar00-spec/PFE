import React from 'react';
import '../../styles/CategoryHeader.css';

const CategoryHeader = ({ title, subtitle, images = [] }) => {
  return (
    <div className="category-header" style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/2774679-travailler-dans-le-football-610x370.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto text-center">
            <h1 className="text-white">{title}</h1>
            <div className="divider mx-auto"></div>
            {subtitle && <p className="text-white lead">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader; 