import React from 'react';
import '../../styles/dashboard.css';

/**
 * Layout spécifique pour les pages avec dashboard
 * Ce layout assure que le contenu est correctement positionné
 * avec la barre latérale lors du défilement
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout; 