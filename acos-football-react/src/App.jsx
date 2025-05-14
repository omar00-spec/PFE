import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/utilities/ScrollToTop';
import SplashScreen from './components/utilities/SplashScreen';

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

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </SplashScreen>
  );
}

export default App;