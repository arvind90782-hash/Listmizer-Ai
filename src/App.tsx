import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolsPage from './pages/ToolsPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';

const ToolDetail = lazy(() => import('./pages/ToolDetail'));

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-slate-950">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <Suspense fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-sm text-gray-500">Loading experience...</div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/tools/:id" element={<ToolDetail />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/admin" element={
                  <ErrorBoundary>
                    <AdminPanel />
                  </ErrorBoundary>
                } />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
