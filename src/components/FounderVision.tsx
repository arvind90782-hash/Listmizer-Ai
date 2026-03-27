import React from 'react';
import { motion } from 'motion/react';
import { Quote, Sparkles } from 'lucide-react';

export default function FounderVision() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Main Visionary: Arman Ali */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-blue/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deep-dark text-white text-xs font-bold mb-8">
                <Sparkles className="w-3 h-3 text-primary-blue" />
                THE VISIONARY
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black text-deep-dark dark:text-white mb-8 leading-tight">
                Built by <span className="gradient-text">Arman Ali</span>
              </h2>
              
              <div className="relative p-8 glass-card rounded-[2.5rem] border-primary-blue/10">
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary-blue/10" />
                <p className="text-xl text-gray-700 dark:text-slate-300 font-medium leading-relaxed italic mb-8">
                  "Listmizer AI isn't just a tool; it's the future of how ecommerce brands will communicate. We are building the intelligence that bridges the gap between a product and its perfect presentation."
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-primary-blue/20">
                    <img src="https://i.ibb.co/4wtJnjcd/Whats-App-Image-2026-03-26-at-7-58-53-PM.jpg" alt="Arman Ali" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-black text-deep-dark dark:text-white">Arman Ali</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-bold">Founder & Lead Visionary</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Engineering: Editor Nishant */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pt-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/5 dark:bg-primary-blue/10 text-primary-blue text-xs font-bold mb-8">
              ENGINEERING EXCELLENCE
            </div>
            
            <h3 className="text-4xl font-black text-deep-dark dark:text-white mb-8">
              Crafted by <span className="text-accent-purple">Editor Nishant</span>
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed">
              Every pixel, every animation, and every line of code is meticulously engineered by Editor Nishant to ensure a seamless, high-performance experience that feels like magic.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Performance', value: '99.9%' },
                { label: 'Uptime', value: '100%' },
                { label: 'AI Accuracy', value: '98.5%' },
                { label: 'Latency', value: '<50ms' }
              ].map((stat, i) => (
                <div key={i} className="p-6 glass-card rounded-3xl border-gray-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-deep-dark dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
