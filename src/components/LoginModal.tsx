import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Github, Chrome } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-blue/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2 dark:text-white">
                {isLogin ? 'Welcome Back' : 'Join Listmizer'}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 font-medium">
                {isLogin ? 'Sign in to your account' : 'Start your AI journey today'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                <Chrome className="w-5 h-5 text-primary-blue" />
                {loading ? 'Connecting...' : 'Continue with Google'}
              </button>
              
              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-grow h-px bg-gray-100 dark:bg-slate-800" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-grow h-px bg-gray-100 dark:bg-slate-800" />
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Email address"
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-primary-blue transition-all dark:text-white"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="Password"
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-primary-blue transition-all dark:text-white"
                  />
                </div>
              </div>

              <button className="btn-primary w-full !py-4">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <p className="text-center text-sm font-medium text-gray-500 dark:text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-blue font-bold hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
