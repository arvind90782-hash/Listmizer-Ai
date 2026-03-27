import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, Package, Info, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function ShippingPredictorTool() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState<number>(0.5);
  const [dimensions, setDimensions] = useState({ l: 10, w: 10, h: 10 });
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination cities.');
      return;
    }

    setIsPredicting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Predict shipping cost and time for a package from ${origin} to ${destination}. 
        Weight: ${weight}kg, Dimensions: ${dimensions.l}x${dimensions.w}x${dimensions.h}cm.
        Return JSON with:
        - estimatedCost (number in INR)
        - estimatedDays (string range like "2-3 days")
        - riskLevel (Low/Medium/High)
        - recommendedCarrier (string)
        - breakdown (array of objects with label and cost)`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError('Failed to predict shipping. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Origin City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Destination City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="0.5"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={dimensions.l}
                  onChange={(e) => setDimensions({ ...dimensions, l: Number(e.target.value) })}
                  placeholder="L"
                  className="w-full px-2 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs"
                />
                <input
                  type="number"
                  value={dimensions.w}
                  onChange={(e) => setDimensions({ ...dimensions, w: Number(e.target.value) })}
                  placeholder="W"
                  className="w-full px-2 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs"
                />
                <input
                  type="number"
                  value={dimensions.h}
                  onChange={(e) => setDimensions({ ...dimensions, h: Number(e.target.value) })}
                  placeholder="H"
                  className="w-full px-2 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-xs"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isPredicting}
            className="w-full py-4 rounded-2xl bg-primary-blue text-white font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-primary-blue/20 disabled:opacity-50"
          >
            {isPredicting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Routes...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Predict Shipping
              </>
            )}
          </button>

          {error && (
            <p className="text-sm font-bold text-red-500 text-center">{error}</p>
          )}
        </div>

        <div className="space-y-6">
          {prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <p className="text-3xl font-black text-primary-blue">₹{prediction.estimatedCost}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Time</p>
                    <p className="text-xl font-bold dark:text-white">{prediction.estimatedDays}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {prediction.breakdown.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{item.label}</span>
                      <span className="text-sm font-bold dark:text-white">₹{item.cost}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-500">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Risk Level</p>
                      <p className="text-xs font-bold dark:text-white">{prediction.riskLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Carrier</p>
                      <p className="text-xs font-bold dark:text-white">{prediction.recommendedCarrier}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800 text-center space-y-4">
              <div className="p-4 rounded-full bg-gray-50 dark:bg-slate-800/50 text-gray-300">
                <Package className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Awaiting Input</p>
                <p className="text-xs text-gray-500 max-w-[200px]">Enter package details to get AI-powered shipping predictions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { RefreshCw } from 'lucide-react';
