import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactDetails = [
    {
      name: 'Editor Nishant',
      role: 'Founder & Visionary',
      email: 'arvind90782@gmail.com',
      phone: '9277072409',
    },
    {
      name: 'Arman Ali',
      role: 'Co-Founder & Design Lead',
      email: 'armanxiom@gmail.com',
      phone: '7705090700',
    }
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
                <img 
                  src="https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png" 
                  alt="Listmizer AI" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-deep-dark dark:text-white">
                Listmizer<span className="text-primary-blue">AI</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
              Empowering ecommerce brands with state-of-the-art visual intelligence.
            </p>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src="https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png" 
                  alt="Editor Nishant" 
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <div>
                <p className="text-xs font-black text-deep-dark dark:text-white">Editor Nishant</p>
                <p className="text-[10px] font-bold text-primary-blue">Lead Visionary</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {contactDetails.map((contact) => (
              <div key={contact.name} className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{contact.name}</h4>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-primary-blue transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary-blue/10">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{contact.email}</span>
                  </a>
                  <a 
                    href={`https://wa.me/91${contact.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-green-500 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-green-500/10">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">+91 {contact.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Features', 'Pricing', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-deep-dark dark:hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400">
            © {currentYear} Listmizer AI. Built by <span className="text-deep-dark dark:text-white">Editor Nishant</span>.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[10px] font-bold text-gray-400 hover:text-primary-blue transition-colors">Status</Link>
            <Link to="#" className="text-[10px] font-bold text-gray-400 hover:text-primary-blue transition-colors">Security</Link>
            <Link to="#" className="text-[10px] font-bold text-gray-400 hover:text-primary-blue transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
