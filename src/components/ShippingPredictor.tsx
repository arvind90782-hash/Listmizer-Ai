import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Truck, ArrowRight, Package } from 'lucide-react';

export default function ShippingPredictor() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const startPrediction = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-deep-dark dark:text-white mb-4">
              AI Shipping <span className="text-primary-blue">Cost Predictor</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
              Our AI analyzes your product dimensions and packaging to predict the most cost-effective shipping method. Save up to 60% on logistics.
            </p>

            <div className="space-y-4">
              {[
                "Analyze packaging efficiency",
                "Predict dimensional weight impact",
                "Compare across 15+ logistics partners",
                "Real-time rate optimization"
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-primary-blue/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                  </div>
                  <span className="font-semibold text-xs text-gray-700 dark:text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div 
              className="glass-card rounded-[2rem] p-6 shadow-2xl relative z-10 dark:bg-slate-900/50 dark:border-slate-800"
              whileHover={{ y: -5 }}
            >
              {!showResult ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-blue/5 dark:bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-primary-blue/20 dark:border-primary-blue/30">
                    <Upload className="w-6 h-6 text-primary-blue" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 dark:text-white">Upload Product Image</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">AI will scan dimensions and weight</p>
                  
                  <button 
                    onClick={startPrediction}
                    disabled={isPredicting}
                    className="btn-primary w-full flex items-center justify-center gap-2 !py-2 text-xs"
                  >
                    {isPredicting ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        AI Scanning...
                      </>
                    ) : (
                      <>
                        Predict Cost
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg">
                        <Package className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Product Detected</p>
                        <p className="text-sm font-bold dark:text-white">Premium Leather Bag</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowResult(false)}
                      className="text-[10px] font-bold text-primary-blue hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-gray-400 mb-1">Before AI</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-extrabold text-gray-400 dark:text-slate-500"
                      >
                        ₹82
                      </motion.p>
                      <p className="text-[9px] text-gray-400">Standard Packaging</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 dark:border-primary-blue/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-primary-blue text-white text-[7px] font-bold rounded-bl-lg">AI OPTIMIZED</div>
                      <p className="text-[10px] font-bold text-primary-blue mb-1">After AI</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-extrabold text-primary-blue"
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          ₹32
                        </motion.span>
                      </motion.p>
                      <p className="text-[9px] text-primary-blue">Volumetric Optimized</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800 dark:text-green-400">₹50 Saved per order</p>
                      <p className="text-[10px] text-green-600 dark:text-green-500/70">Projected Monthly Savings: ₹15,000</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Background Decorative */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-blue/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
