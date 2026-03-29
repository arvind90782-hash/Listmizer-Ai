import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Hero() {
  return (
    <section className="relative pt-8 pb-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 text-[10px] md:text-xs font-black mb-6 tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>The Future of Ecommerce AI</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-[0.95] mb-6 tracking-tighter text-deep-dark dark:text-white">
            Sell <span className="gradient-text">Faster</span> with Neural Design.
          </h1>
          
          <p className="text-base md:text-lg text-gray-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg font-medium">
            Upload any product image and instantly generate marketplace optimized catalog images. Built for the next generation of sellers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <Link to="/tools/image-gen" className="btn-primary w-full sm:w-auto">
                Open Image Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.1} className="w-full sm:w-auto">
              <button className="btn-secondary w-full sm:w-auto">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </Magnetic>
          </div>

          <div className="mt-8 flex items-center gap-6">
            {[
              { icon: Zap, label: 'Instant' },
              { icon: Shield, label: 'Secure' },
              { icon: Globe, label: 'Global' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400 dark:text-slate-500 font-bold text-xs">
                <item.icon className="w-4 h-4 text-primary-blue" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Content - Interactive Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Main Card */}
          <div className="relative z-10 glass-card rounded-[1.5rem] p-3 shadow-[0_24px_48px_rgba(0,0,0,0.1)] border-white/40 dark:border-slate-800/50 group">
            <div className="aspect-square bg-gray-50 dark:bg-slate-900 rounded-[1.25rem] relative overflow-hidden">
              {/* Scanning Line Animation */}
              <motion.div 
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-16 bg-linear-to-b from-transparent via-primary-blue/30 to-transparent z-20 pointer-events-none"
              />

              <img 
                src="https://picsum.photos/seed/premium-product/1000/1000" 
                alt="Product Preview" 
                className="w-full h-full object-cover rounded-[1.25rem] transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Floating UI Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 glass-card px-2 py-1 rounded-xl text-[8px] font-black flex items-center gap-1.5 shadow-xl border-white/50 dark:border-slate-700/50 dark:text-white"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                AI ENHANCED
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-4 glass-card px-2 py-1 rounded-xl text-[8px] font-black flex items-center gap-1.5 shadow-xl border-white/50 dark:border-slate-700/50 dark:text-white"
              >
                <Sparkles className="w-3 h-3 text-primary-blue" />
                98% OPTIMIZED
              </motion.div>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent-purple/10 rounded-full blur-[80px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
