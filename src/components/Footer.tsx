import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Tools', to: '/tools' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Payment', to: '/payment' },
  ];

  return (
    <footer className="border-t border-gray-100 bg-white pt-12 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <img
                  src="https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png"
                  alt="Listmizer AI"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-deep-dark dark:text-white">
                Listmizer<span className="text-primary-blue">AI</span>
              </span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-gray-500 dark:text-slate-400">
              AI-powered tools for marketplace sellers. Optimized for Amazon, Flipkart, and Meesho.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Support</h4>
            <div className="space-y-3">
              <a
                href="mailto:support@listmizer.ai"
                className="flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-primary-blue dark:text-slate-400"
              >
                <Mail className="h-4 w-4" />
                support@listmizer.ai
              </a>
              <a
                href="https://wa.me/919555742287"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-green-500 dark:text-slate-400"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Support
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Company</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-deep-dark dark:text-slate-400 dark:hover:text-white"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Account</h4>
            <div className="space-y-3">
              <Link to="/payment" className="block text-sm font-bold text-gray-500 hover:text-primary-blue dark:text-slate-400">
                Upgrade Plan
              </Link>
              <Link to="/tools/image-gen" className="block text-sm font-bold text-gray-500 hover:text-primary-blue dark:text-slate-400">
                Open Image Tool
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-center md:flex-row dark:border-slate-800">
          <p className="text-xs font-bold text-gray-400">
            © {currentYear} Listmizer AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-[10px] font-bold text-gray-400 hover:text-primary-blue">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[10px] font-bold text-gray-400 hover:text-primary-blue">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
