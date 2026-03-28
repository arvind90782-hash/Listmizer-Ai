import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                AI
              </div>
              <span className="text-xl font-black tracking-tighter text-deep-dark dark:text-white">
                Listmizer<span className="text-primary-blue">AI</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-6 leading-relaxed max-w-sm">
              AI-powered tools for marketplace sellers. Optimized for Amazon, Flipkart, Meesho.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black text-deep-dark dark:text-white mb-4 tracking-tight">Support</h4>
            <div className="space-y-3">
              <a href="mailto:support@listmizer.ai" className="flex items-center gap-3 text-gray-500 dark:text-slate-400 hover:text-primary-blue group transition-all">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-sm font-bold group-hover:underline">support@listmizer.ai</span>
              </a>
              <a href="https://wa.me/message/ABC123" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-500 dark:text-slate-400 hover:text-green-500 group transition-all">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-sm font-bold group-hover:underline">WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-black text-deep-dark dark:text-white mb-4 tracking-tight">Company</h4>
            <ul className="space-y-2">
              {['Pricing', 'Privacy', 'Terms'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-primary-blue transition-colors block py-1">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400">
          <p>© {currentYear} Listmizer AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-primary-blue transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-blue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
