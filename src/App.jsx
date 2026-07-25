import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CompareTray from './components/CompareTray';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import ProductPage from './components/ProductPage';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Estimator from './pages/Estimator';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <CompareProvider>
          <div className="page-shell">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <Header />
            <div id="main-content">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/estimator" element={<Estimator />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
            <CompareTray />
            <FloatingWhatsApp />
            <Footer />
          </div>
        </CompareProvider>
      </CartProvider>
    </BrowserRouter>
  );
}