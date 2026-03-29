import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import ShippingPredictor from '../components/ShippingPredictor';
import PricingSection from '../components/PricingSection';
import FounderVision from '../components/FounderVision';
import BackgroundEffects from '../components/BackgroundEffects';
import Magnetic from '../components/Magnetic';
import { cn } from '../lib/utils';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative">
      <BackgroundEffects />
      
      {/* Marketplace Promotion Section */}
      <section className="pt-20 pb-4 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-[10px] font-black mb-4 tracking-widest uppercase"
            >
              <Sparkles className="w-3 h-3" />
              Marketplace Domination
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-2xl md:text-4xl font-black text-deep-dark dark:text-white mb-3 tracking-tighter leading-tight"
            >
              Sell Everywhere. <br />
              <span className="gradient-text">Optimize Once.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xs md:text-sm text-gray-500 dark:text-slate-400 max-w-lg mx-auto font-medium leading-relaxed"
            >
              The world's first AI visual engine built specifically for high-volume marketplace sellers.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
            {[
              { name: 'Amazon', img: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg' },
              { name: 'Flipkart', img: 'https://i.ibb.co/9mG0MyH0/ANI-20250422062444.jpg' },
              { name: 'Meesho', img: 'https://i.ibb.co/TBKBj4WX/Meesho-logo.png' },
              { name: 'Myntra', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png' }
            ].map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bubble-glass p-1 flex flex-col items-center justify-center gap-1 group hover:scale-105 transition-all duration-500 w-16 md:w-20"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
                  <img 
                    src={brand.img} 
                    alt={brand.name} 
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110 object-contain"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <span className="text-[8px] md:text-[10px] font-black text-deep-dark dark:text-white uppercase tracking-tighter">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-black text-deep-dark dark:text-white mb-3"
            >
              The <span className="gradient-text">AI Pipeline</span>
            </motion.h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">Three steps to marketplace domination.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Animated Flowing Data Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 z-0 overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-1/2 h-full bg-linear-to-r from-transparent via-primary-blue to-transparent"
              />
            </div>

            {[
              { step: '01', title: 'Upload', desc: 'Drag and drop your raw product photos into our secure AI vault.', icon: Sparkles },
              { step: '02', title: 'Optimize', desc: 'Our neural networks enhance lighting, remove backgrounds, and inject SEO.', icon: Sparkles },
              { step: '03', title: 'Dominate', desc: 'Download marketplace-ready assets and watch your conversion soar.', icon: Sparkles },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-[2rem] relative z-10 text-center group border-primary-blue/5 hover:border-primary-blue/20 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-primary-blue/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <span className="text-xl font-black text-primary-blue">{item.step}</span>
                </div>
                <h3 className="text-lg font-black mb-3 text-deep-dark dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed text-xs md:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <FeaturesGrid />
      
      <ShippingPredictor />
      
      <PricingSection />

      {/* Live Activity Ticker */}
      <div className="bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800 py-4 overflow-hidden whitespace-nowrap relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center gap-12"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-bold text-gray-500 dark:text-slate-400">
                User <span className="text-deep-dark dark:text-white">@seller_{i}</span> just optimized <span className="text-primary-blue">42 images</span>
              </span>
              <span className="text-gray-300 dark:text-slate-700">|</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <section className="py-3 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-deep-dark rounded-[2rem] p-4 md:p-8 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary-blue/20 via-accent-purple/20 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-base md:text-xl font-black mb-3 leading-tight tracking-tighter">
              Ready to <span className="gradient-text">Scale?</span>
            </h2>
            <p className="text-[10px] text-gray-400 mb-4 max-w-xl mx-auto font-medium">
              Join the elite circle of sellers using Listmizer AI to automate their growth.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnetic strength={0.2}>
                <Link to="/tools/image-gen" className="btn-primary !px-8 !py-3 text-sm">
                  Get Started Now
                </Link>
              </Magnetic>
              <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
