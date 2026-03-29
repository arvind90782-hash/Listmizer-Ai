import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolsPage from './pages/ToolsPage';
import ToolDetail from './pages/ToolDetail';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './pages/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate } from 'react-router-dom';

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:id" element={<ToolDetail />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/privacy" element={<SimpleLegalPage title="Privacy Policy" />} />
              <Route path="/terms" element={<SimpleLegalPage title="Terms of Service" />} />
              <Route path="/admin" element={
                <ErrorBoundary>
                  <AdminPanel />
                </ErrorBoundary>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function SimpleLegalPage({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-soft-bg px-6 pt-32 pb-24 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-4 text-3xl font-black text-deep-dark dark:text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">
          This page is a lightweight placeholder so footer links resolve correctly in the app and on refresh. Replace it with your full legal copy when you are ready.
        </p>
      </div>
    </main>
  );
}
