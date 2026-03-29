import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Chrome, UserRound } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const closeAndReset = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name || email.split('@')[0]);
      }
      closeAndReset();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      closeAndReset();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
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
            onClick={closeAndReset}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8"
          >
            <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-primary-blue/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-accent-purple/15 blur-3xl" />

            <button
              onClick={closeAndReset}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative mb-6 text-center">
              <p className="mb-3 inline-flex rounded-full bg-primary-blue/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">
                {mode === 'login' ? 'Login Required' : 'Create Account'}
              </p>
              <h2 className="text-3xl font-black text-deep-dark dark:text-white">
                {mode === 'login' ? 'Welcome Back' : 'Join Listmizer'}
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-500 dark:text-slate-400">
                {mode === 'login'
                  ? 'Login to unlock full AI tools, downloads, and higher limits.'
                  : 'Create an account to remove guest limits and save your work.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {mode === 'signup' && (
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Full name"
                    className="w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none ring-1 ring-transparent transition focus:ring-primary-blue dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none ring-1 ring-transparent transition focus:ring-primary-blue dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border-0 bg-gray-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none ring-1 ring-transparent transition focus:ring-primary-blue dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleEmailAuth}
              disabled={loading}
              className="btn-primary mt-5 w-full !py-3.5"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="relative my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-deep-dark transition hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Chrome className="h-5 w-5 text-primary-blue" />
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm font-medium text-gray-500 dark:text-slate-400">
              {mode === 'login' ? 'New here? ' : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-bold text-primary-blue hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
