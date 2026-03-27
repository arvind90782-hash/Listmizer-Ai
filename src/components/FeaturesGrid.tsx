import React from 'react';
import { motion } from 'motion/react';
import { TOOLS } from '../constants';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Magnetic from './Magnetic';

export default function FeaturesGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-6 md:mb-8 gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-blue/5 text-primary-blue text-[9px] font-black mb-3 tracking-widest uppercase"
            >
              <Sparkles className="w-2.5 h-2.5" />
              THE TOOLKIT
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-xl md:text-3xl font-black text-deep-dark dark:text-white leading-tight tracking-tighter"
            >
              Everything you need to <span className="gradient-text">Dominate.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium max-w-xs"
          >
            A unified ecosystem of AI tools designed for high-performance ecommerce brands.
          </motion.p>
        </div>

        {/* Mobile Optimized Grid: 4 columns on small screens, Bento on large */}
        <div className="grid grid-cols-4 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-4 h-auto md:h-[500px]">
          {/* Featured Large Card - 4 columns on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="col-span-4 md:col-span-2 md:row-span-2 bento-card p-6 md:p-10 bg-deep-dark dark:bg-slate-900 text-white group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-primary-blue/20 rounded-full blur-[60px] md:blur-[120px] -z-10 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary-blue rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-2xl shadow-primary-blue/40">
                  {React.createElement(TOOLS[0].icon, { className: "w-5 h-5 md:w-7 md:h-7" })}
                </div>
                <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 leading-tight">{TOOLS[0].title}</h3>
                <p className="text-xs md:text-lg text-gray-400 font-medium leading-relaxed">
                  {TOOLS[0].description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-6 md:mt-12">
                <div className="hidden md:flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-deep-dark dark:border-slate-900 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <Magnetic strength={0.2}>
                  <Link to={`/tools/${TOOLS[0].id}`} className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-deep-dark flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </motion.div>

          {/* Medium Card - 4 columns on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-4 md:col-span-2 bento-card p-6 md:p-8 bg-linear-to-br from-primary-blue to-accent-purple text-white group cursor-pointer"
            onClick={() => navigate(`/tools/${TOOLS[1].id}`)}
          >
            <div className="flex items-start justify-between h-full">
              <div className="max-w-[200px] md:max-w-xs">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  {React.createElement(TOOLS[1].icon, { className: "w-4 h-4 md:w-6 md:h-6" })}
                </div>
                <h3 className="text-sm md:text-2xl font-black mb-2 md:mb-3">{TOOLS[1].title}</h3>
                <p className="text-xs md:text-sm text-white/70 font-medium leading-relaxed">{TOOLS[1].description}</p>
              </div>
              <div className="w-16 h-16 md:w-32 md:h-32 bg-white/10 rounded-xl md:rounded-3xl rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/ai-img/400/400" alt="AI" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              </div>
            </div>
          </motion.div>

          {/* Small Grid Cards - 2x2 on mobile (total 4 cards in view) */}
          {TOOLS.slice(2, 4).map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="col-span-2 md:col-span-1 bento-card p-4 md:p-6 group dark:bg-slate-900 dark:border-slate-800 cursor-pointer"
                onClick={() => navigate(`/tools/${tool.id}`)}
              >
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-50 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all duration-500">
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <h3 className="text-sm md:text-lg font-black mb-1 text-deep-dark dark:text-white line-clamp-1">{tool.title}</h3>
                <p className="text-xs md:text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{tool.description}</p>
                
                <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-primary-blue" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Ticker/Grid Toggle */}
        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.2}>
            <Link to="/tools" className="btn-secondary group px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700">
              Explore All 13 Tools
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
