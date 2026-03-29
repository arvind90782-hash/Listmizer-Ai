import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Truck, ArrowRight, Package, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShippingPredictor() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const canPredict = useMemo(() => Boolean(preview), [preview]);

  const startPrediction = () => {
    if (!preview) return;
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResult(true);
    }, 1200);
  };

  const reset = () => {
    setShowResult(false);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-deep-dark dark:text-white md:text-4xl">
              AI Shipping <span className="text-primary-blue">Cost Predictor</span>
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              Upload a product photo, then let the AI estimate shipping weight impact, route risk, and expected logistics cost.
            </p>

            <div className="space-y-4">
              {[
                'Analyze packaging efficiency',
                'Predict dimensional weight impact',
                'Compare across 15+ logistics partners',
                'Real-time rate optimization',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-blue/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              className="relative z-10 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900/50"
              whileHover={{ y: -5 }}
            >
              {!showResult ? (
                <div className="space-y-5 text-center py-8">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-dashed border-primary-blue/25 bg-primary-blue/5 transition hover:-translate-y-0.5 hover:bg-primary-blue/10"
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full rounded-[1.15rem] object-cover" />
                      ) : (
                        <Upload className="h-7 w-7 text-primary-blue transition group-hover:scale-110" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="mb-1 text-lg font-bold dark:text-white">Upload Product Image</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">AI will scan dimensions and weight</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    <ImageIcon className="h-3.5 w-3.5 text-primary-blue" />
                    {preview ? 'Image attached' : 'Upload enabled'}
                  </div>

                  <button
                    onClick={startPrediction}
                    disabled={isPredicting || !canPredict}
                    className="btn-primary w-full !py-2 text-xs disabled:opacity-50"
                  >
                    {isPredicting ? 'AI Scanning...' : 'Predict Cost'}
                    <ArrowRight className="h-4 w-4" />
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
                      <div className="rounded-lg bg-gray-100 p-1.5 dark:bg-slate-800">
                        <Package className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Product Detected</p>
                        <p className="text-sm font-bold dark:text-white">Premium Leather Bag</p>
                      </div>
                    </div>
                    <button onClick={reset} className="text-[10px] font-bold text-primary-blue hover:underline">
                      Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                      <p className="mb-1 text-[10px] font-bold text-gray-400">Before AI</p>
                      <p className="text-2xl font-extrabold text-gray-400 dark:text-slate-500">₹82</p>
                      <p className="text-[9px] text-gray-400">Standard Packaging</p>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-primary-blue/10 bg-primary-blue/5 p-3 dark:border-primary-blue/20 dark:bg-primary-blue/10">
                      <div className="absolute right-0 top-0 rounded-bl-lg bg-primary-blue px-2 py-0.5 text-[7px] font-bold text-white">
                        AI OPTIMIZED
                      </div>
                      <p className="mb-1 text-[10px] font-bold text-primary-blue">After AI</p>
                      <p className="text-2xl font-extrabold text-primary-blue">₹32</p>
                      <p className="text-[9px] text-primary-blue">Volumetric Optimized</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3 dark:border-green-900/30 dark:bg-green-900/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800 dark:text-green-400">₹50 Saved per order</p>
                      <p className="text-[10px] text-green-600 dark:text-green-500/70">Projected Monthly Savings: ₹15,000</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="absolute -top-10 -right-10 -z-10 h-48 w-48 rounded-full bg-primary-blue/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
