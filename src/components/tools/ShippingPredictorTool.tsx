import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, Package, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { generateShippingEstimate } from '../../lib/gemini';

type ShippingEstimate = {
  estimatedCost: number;
  estimatedDays: string;
  riskLevel: string;
  recommendedCarrier: string;
  breakdown: Array<{ label: string; cost: number }>;
};

export default function ShippingPredictorTool() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState<number>(0.5);
  const [dimensions, setDimensions] = useState({ l: 10, w: 10, h: 10 });
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<ShippingEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination cities.');
      return;
    }

    setIsPredicting(true);
    setError(null);

    try {
      const data = await generateShippingEstimate(origin, destination, weight);
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
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
                Origin City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
                Destination City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={dimensions.l}
                  onChange={(e) => setDimensions({ ...dimensions, l: Number(e.target.value) })}
                  placeholder="L"
                  className="w-full rounded-xl border border-gray-200 bg-white px-2 py-3 text-center text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="number"
                  value={dimensions.w}
                  onChange={(e) => setDimensions({ ...dimensions, w: Number(e.target.value) })}
                  placeholder="W"
                  className="w-full rounded-xl border border-gray-200 bg-white px-2 py-3 text-center text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
                />
                <input
                  type="number"
                  value={dimensions.h}
                  onChange={(e) => setDimensions({ ...dimensions, h: Number(e.target.value) })}
                  placeholder="H"
                  className="w-full rounded-xl border border-gray-200 bg-white px-2 py-3 text-center text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isPredicting}
            className="btn-primary w-full !py-4"
          >
            {isPredicting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Analyzing Routes...
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5" />
                Predict Shipping
              </>
            )}
          </button>

          {error && <p className="text-center text-sm font-bold text-red-500">{error}</p>}
        </div>

        <div className="space-y-6">
          {prediction ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Estimated Cost</p>
                    <p className="text-3xl font-black text-primary-blue">₹{prediction.estimatedCost}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivery Time</p>
                    <p className="text-xl font-bold dark:text-white">{prediction.estimatedDays}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {prediction.breakdown?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{item.label}</span>
                      <span className="text-sm font-bold dark:text-white">₹{item.cost}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 dark:border-slate-700 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-500 dark:bg-green-900/20">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400">Risk Level</p>
                      <p className="text-xs font-bold dark:text-white">{prediction.riskLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-500 dark:bg-blue-900/20">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400">Carrier</p>
                      <p className="text-xs font-bold dark:text-white">{prediction.recommendedCarrier}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center dark:border-slate-800">
              <div className="rounded-full bg-gray-50 p-4 text-gray-300 dark:bg-slate-800/50">
                <Package className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Awaiting Input</p>
                <p className="mx-auto max-w-[200px] text-xs text-gray-500">Enter package details to get AI-powered shipping predictions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
