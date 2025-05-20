import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import MemberSpace from './components/pages/MemberSpace';

// Import des composants de ru00e9initialisation de mot de passe
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';

// Import Auth Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
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
              <Route path="/espace-membre" element={
                <ProtectedRoute>
                  <MemberSpace />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </SplashScreen>
    </AuthProvider>
  );
}

export default App;