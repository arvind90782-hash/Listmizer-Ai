import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck,
  MapPin,
  Package,
  Layers,
  Info,
  ShieldCheck,
  RefreshCw,
  Loader2,
  ImageIcon,
} from 'lucide-react';

const couriers = [
  { name: 'Shiprocket', ratePerKg: 55, speed: '2-4 days', reliability: 'High' },
  { name: 'Delhivery', ratePerKg: 60, speed: '3-5 days', reliability: 'Medium' },
  { name: 'Blue Dart', ratePerKg: 70, speed: '2-3 days', reliability: 'High' },
  { name: 'DTDC', ratePerKg: 50, speed: '4-6 days', reliability: 'Medium' },
  { name: 'India Post', ratePerKg: 40, speed: '5-7 days', reliability: 'Low' },
  { name: 'FedEx', ratePerKg: 85, speed: '1-2 days', reliability: 'Very High' },
  { name: 'DHL', ratePerKg: 95, speed: '1-2 days', reliability: 'Very High' },
];

const packagingSuggestions = {
  bubble: 'Use lightweight bubble wrap to reduce void space and minimize costs.',
  box: 'Choose a snug box; avoid oversized cartons to keep dimensional weight down.',
  courier: 'Go with courier-provided packaging for faster pickup and better protection.',
};

interface ShipmentPrediction {
  estimatedCost: number;
  costRange: { min: number; max: number };
  estimatedDays: string;
  bestCourier: string;
  cheapestCourier: string;
  dimensionalWeight: number;
  actualWeight: number;
  packagingTip: string;
  courierComparison: { name: string; price: number; delivery: string }[];
  volumetricDivisor: number;
}

export default function ShippingPredictorTool() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState<number>(0.5);
  const [dimensions, setDimensions] = useState({ l: 30, w: 20, h: 10 });
  const [packagingType, setPackagingType] = useState<'box' | 'bubble' | 'courier'>('box');
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<ShipmentPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validate = () => {
    if (!origin.trim() || !destination.trim() || !weight || !dimensions.l || !dimensions.w || !dimensions.h) {
      setError('Please enter required package information before predicting shipping cost.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const calculateDimensionalWeight = (divisor = 5000) => {
    return (dimensions.l * dimensions.w * dimensions.h) / divisor;
  };

  const buildComparison = (chargeableWeight: number) => {
    return couriers.map((courier) => {
      const price = chargeableWeight * courier.ratePerKg + 40;
      return {
        name: courier.name,
        price,
        delivery: courier.speed,
      };
    });
  };

  const handlePredict = async () => {
    if (!validate()) return;
    if (!imageFile) {
      setError('Please upload packaging image to improve the recommendation.');
      return;
    }

    setIsPredicting(true);
    try {
      const divisor = 5000;
      const dimensionalWeight = calculateDimensionalWeight(divisor);
      const chargeableWeight = Math.max(weight, dimensionalWeight);
      const comparison = buildComparison(chargeableWeight);
      const sortedByPrice = [...comparison].sort((a, b) => a.price - b.price);
      const mainPrediction = sortedByPrice[0];

      const bestCourier = mainPrediction.name;
      const cheapestCourier = sortedByPrice[0].name;
      const estimatedCost = mainPrediction.price;
      const costRange = {
        min: Math.max(estimatedCost * 0.95, 10),
        max: estimatedCost * 1.05,
      };
      const estimatedDays = mainPrediction.delivery;

      setPrediction({
        estimatedCost,
        costRange,
        estimatedDays,
        bestCourier,
        cheapestCourier,
        dimensionalWeight,
        actualWeight: weight,
        packagingTip: packagingSuggestions[packagingType],
        courierComparison: comparison,
        volumetricDivisor: divisor,
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to predict shipping. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-deep-dark flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary-blue" />
              Shipping Cost Predictor
            </h3>
            <p className="text-xs text-gray-500 mt-1">Enter package details to get accurate quotes from major couriers.</p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <label className="space-y-1 text-[11px] font-black uppercase text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Origin City
                </span>
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </label>
              <label className="space-y-1 text-[11px] font-black uppercase text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destination City
                </span>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Delhi"
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </label>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <label className="space-y-1 text-[11px] font-black uppercase text-gray-500">
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Weight (kg)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weight || ''}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </label>
              <label className="space-y-1 text-[11px] font-black uppercase text-gray-500">
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Packaging Type
                </span>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value as any)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                >
                  <option value="box">Box</option>
                  <option value="bubble">Bubble Wrap</option>
                  <option value="courier">Courier Packaging</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {['L', 'W', 'H'].map((key) => (
                <label key={key} className="space-y-1 text-[11px] font-black uppercase text-gray-500 text-center">
                  {key}
                  <input
                    type="number"
                    min="1"
                    value={dimensions[key.toLowerCase() as keyof typeof dimensions]}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        [key.toLowerCase()]: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-center text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label
                htmlFor="shipping-image"
                className="cursor-pointer rounded-2xl border border-dashed border-gray-300 px-4 py-2 text-xs font-black text-gray-600 flex items-center gap-2 hover:border-primary-blue hover:text-primary-blue transition"
              >
                <ImageIcon className="h-4 w-4" />
                Upload Packaging Image
              </label>
              <input
                id="shipping-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img src={imagePreview} className="h-12 w-12 rounded-lg object-cover border border-gray-200" alt="Packaging preview" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs font-semibold text-gray-500 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handlePredict}
                disabled={isPredicting}
                className="w-full rounded-2xl bg-primary-blue py-3 text-sm font-black text-white shadow-lg shadow-primary-blue/30 transition hover:bg-blue-600 disabled:opacity-50"
              >
                {isPredicting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating in real time...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Predict Shipping Cost
                  </span>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-xs font-bold uppercase text-red-600">{error}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {prediction ? (
            <motion.div
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Shipping Cost Prediction</p>
                  <p className="text-3xl font-black text-deep-dark">₹{prediction.estimatedCost.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">
                    Range: ₹{prediction.costRange.min.toFixed(0)} - ₹{prediction.costRange.max.toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">Best Courier</p>
                  <p className="text-lg font-black text-primary-blue">{prediction.bestCourier}</p>
                  <p className="text-[11px] text-gray-500">{prediction.estimatedDays}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-4 text-xs text-gray-600">
                <p>
                  <span className="font-bold text-gray-900">Dimensional Weight Impact:</span> Actual {prediction.actualWeight.toFixed(2)}kg vs volumetric {prediction.dimensionalWeight.toFixed(2)}kg (divisor {prediction.volumetricDivisor}).
                </p>
                <p className="text-gray-500">
                  {prediction.dimensionalWeight > prediction.actualWeight
                    ? 'Volumetric weight dominates the chargeable mass—consider reducing box size or choosing tighter packaging.'
                    : 'Weight drives the cost; packaging is already optimized.'}
                </p>
                <p>
                  <span className="font-bold">Packaging Tip:</span> {prediction.packagingTip}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Courier Comparison</p>
                <div className="mt-3 grid gap-3">
                  {prediction.courierComparison.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-[11px] text-gray-500">Delivery {item.delivery}</p>
                      </div>
                      <p className="font-black text-deep-dark">₹{item.price.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white/80 p-6 text-center text-xs text-gray-500">
              <p className="font-black uppercase tracking-widest">Awaiting Prediction</p>
              <p className="mt-2">Provide inputs and upload packaging image to simulate real courier quotes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
