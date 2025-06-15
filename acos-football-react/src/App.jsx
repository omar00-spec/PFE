import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Import components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/utilities/ScrollToTop';
import SplashScreen from './components/utilities/SplashScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import pages
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Registration from './components/pages/Registration';
import News from './components/pages/News';
import Media from './components/pages/Media';
import Categories from './components/pages/Categories';
import CategoryDetail from './components/pages/CategoryDetail';
import BankTransferPayment from './components/pages/BankTransferPayment';
import CheckPayment from './components/pages/CheckPayment';
import PaymentSuccess from './components/pages/PaymentSuccess';
import PaymentCancel from './components/pages/PaymentCancel';
import Login from './components/pages/Login';
import PlayerDashboard from './components/pages/PlayerDashboard';
import CoachDashboard from './components/pages/CoachDashboard';
import ParentDashboard from './components/pages/ParentDashboard';

// Import des composants de réinitialisation de mot de passe
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';

// Import Auth Context
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';

// Composant pour rediriger en fonction du type d'utilisateur
const UserRedirect = () => {
  const userType = localStorage.getItem('userType');
  
  if (userType === 'player') {
    return <Navigate to="/player-dashboard" replace />;
  } else if (userType === 'coach') {
    return <Navigate to="/coach-dashboard" replace />;
  } else if (userType === 'parent') {
    return <Navigate to="/parent-dashboard" replace />;
  } else {
    // Par défaut, rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const location = useLocation();

  // Protection contre les redirections non désirées
  useEffect(() => {
    // Fonction pour empêcher les redirections non désirées
    const handleBeforeUnload = (e) => {
      // Si nous sommes sur la page d'inscription, empêcher les redirections non désirées
      if (location.pathname.includes('inscription')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  // Configurer l'intercepteur global d'Axios pour gérer les erreurs d'authentification
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Ne pas rediriger si l'erreur vient des routes d'authentification (login, etc.)
        const isAuthRoute = location.pathname.includes('login') || 
                            location.pathname.includes('mot-de-passe');
        
        if (error.response && 
            (error.response.status === 401 || error.response.status === 403) &&
            !isAuthRoute) {
          // On garde le token et les infos utilisateur pour éviter la déconnexion
          // en cas d'erreur réseau temporaire ou de problème de backend
          console.log('Erreur d\'authentification interceptée mais maintien de la session');
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Supprimer l'intercepteur lors du démontage du composant
      axios.interceptors.response.eject(interceptor);
    };
  }, [location]);

  return (
    <AuthProvider>
      <SplashScreen>
        <div className="app-container">
          <ScrollToTop />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categorie/:name" element={<CategoryDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/inscription" element={<Registration />} />
              <Route path="/actualites" element={<News />} />
              <Route path="/medias" element={<Media />} />
              <Route path="/payment/bank-transfer" element={<BankTransferPayment />} />
              <Route path="/payment/check" element={<CheckPayment />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              
              {/* Routes d'authentification et d'espace membre */}
              <Route path="/login" element={<Login />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              
              {/* Routes spécifiques aux différents types d'utilisateurs */}
              <Route path="/player-dashboard" element={
                <ProtectedRoute>
                  <PlayerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/coach-dashboard" element={
                <ProtectedRoute>
                  <CoachDashboard />
                </ProtectedRoute>
              } />
              <Route path="/parent-dashboard" element={
                <ProtectedRoute>
                  <ParentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Routes pour la compatibilité avec les anciens liens */}
              <Route path="/espace-membre" element={<UserRedirect />} />
              <Route path="/espace-coach" element={<Navigate to="/coach-dashboard" replace />} />
              <Route path="/espace-parent" element={<Navigate to="/parent-dashboard" replace />} />
              
              {/* Route par défaut pour les utilisateurs connectés */}
              <Route path="/dashboard" element={<UserRedirect />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SplashScreen>
    </AuthProvider>
  );
}

export default App;