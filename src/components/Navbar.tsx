import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, ArrowUpRight, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import Magnetic from './Magnetic';
import LoginModal from './LoginModal';
import { auth, logout, onAuthStateChanged, User, getUserData } from '../lib/firebase';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Payment', path: '/payment' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl px-6 py-2 rounded-full",
        scrolled 
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.15)]" 
          : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 dark:border-slate-800/30 shadow-lg"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-md transition-all duration-500 overflow-hidden border border-gray-100 dark:border-slate-800">
              <img 
                src="https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png" 
                alt="Listmizer AI" 
                className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-sm md:text-base font-black tracking-tighter text-deep-dark dark:text-white">
              Listmizer<span className="text-primary-blue">AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 group",
                  location.pathname === link.path 
                    ? "bg-white dark:bg-slate-700 text-primary-blue shadow-sm" 
                    : "text-gray-500 dark:text-slate-400 hover:text-deep-dark dark:hover:text-white"
                )}
              >
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-700">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-xs font-bold text-deep-dark dark:text-white max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-deep-dark dark:hover:text-white transition-colors px-4 py-2"
              >
                Login
              </button>
            )}

            <Link to="/tools/image-gen" className="btn-primary !h-9 !px-4 text-xs">
              Get Started
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 text-deep-dark dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-gray-100 dark:border-slate-800 p-8 rounded-3xl flex flex-col gap-6 md:hidden shadow-2xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black text-deep-dark dark:text-white flex items-center justify-between group"
                >
                  {link.name}
                  <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <div className="h-px bg-gray-100 dark:bg-slate-800" />
              <div className="flex flex-col gap-4">
                {user ? (
                  <button onClick={() => logout()} className="btn-secondary w-full text-red-500">Logout</button>
                ) : (
                  <button onClick={() => { setIsOpen(false); setIsLoginOpen(true); }} className="btn-secondary w-full dark:bg-slate-800 dark:text-white dark:border-slate-700">Login</button>
                )}
                <Link to="/tools/image-gen" onClick={() => setIsOpen(false)} className="btn-primary w-full">Open Image Tool</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
