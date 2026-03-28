import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck,
  MapPin,
  Package,
  RefreshCw,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { getShippingRates, type CourierRate } from '../../lib/shiprocket';







interface ShipmentPrediction {
  estimatedCost: number;
  costRange: { min: number; max: number };
  estimatedDays: string;
  bestCourier: string;
  cheapestCourier: string;
  dimensionalWeight: number;
  actualWeight: number;
  packagingTip: string;
  courierComparison: { name: string; price: number; delivery: string; rating?: string }[];
  volumetricDivisor: number;
}

const VOLUMETRIC_DIVISOR = 5000;

export default function ShippingPredictorTool() {
const [pickupPincode, setPickupPincode] = useState('');
const [deliveryPincode, setDeliveryPincode] = useState('');
  const [weight, setWeight] = useState<number>(0.5);
const [dimensions, setDimensions] = useState({ length: 30, breadth: 20, height: 10 });

  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<ShipmentPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validate = () => {
    if (!pickupPincode.trim() || !deliveryPincode.trim()) {
      setError('Please enter both pickup and delivery pincodes.');
      return false;
    }
    if (!/^\d{6}$/.test(pickupPincode) || !/^\d{6}$/.test(deliveryPincode)) {
      setError('Use six-digit pincodes for both pickup and delivery.');
      return false;
    }
    if (weight <= 0) {
      setError('Provide a positive weight for the package.');
      return false;
    }
    if (dimensions.length <= 0 || dimensions.breadth <= 0 || dimensions.height <= 0) {
      setError('Add valid package dimensions before running the prediction.');
      return false;
    }
    setError(null);
    return true;
  };

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };



  const handlePredict = async () => {
    if (!validate()) return;

    let currentToken = token;
    if (!currentToken) {
      currentToken = await authenticate();
      if (!currentToken) return;
    }

    setIsPredicting(true);
    try {
      const params = new URLSearchParams({
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight: weight.toString(),
        length: dimensions.length.toString(),
        breadth: dimensions.breadth.toString(),
        height: dimensions.height.toString(),
      });

      const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let courierList = data.available_courier_companies || data.data || [];
      if (!Array.isArray(courierList)) courierList = [];

      if (courierList.length === 0) {
        setError('No courier services available for this route.');
        setIsPredicting(false);
        return;
      }

      const comparison = courierList.map((c: any) => ({
        name: c.courier_name || c.name || 'Unknown',
        price: parseFloat(c.rate) || 0,
        delivery: c.etd || '3-5 days',
        rating: c.pickup_rating || '⭐⭐⭐⭐',
      })).sort((a, b) => a.price - b.price);

      const mainPrediction = comparison[0];

      setPrediction({
        estimatedCost: mainPrediction.price,
        costRange: {
          min: mainPrediction.price * 0.95,
          max: mainPrediction.price * 1.05,
        },
        estimatedDays: mainPrediction.delivery,
        bestCourier: mainPrediction.name,
        cheapestCourier: mainPrediction.name,
        dimensionalWeight: 0,
        actualWeight: weight,
        packagingTip: '',
        courierComparison: comparison,
        volumetricDivisor: 5000,
      });
      setError(null);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to fetch shipping rates. Please check pincodes and try again.');
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
Pickup Pincode
                </span>
                <input
value={pickupPincode}
onChange={(e) => setPickupPincode(e.target.value)}
placeholder="400001"
                  className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </label>
              <label className="space-y-1 text-[11px] font-black uppercase text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
Delivery Pincode
                </span>
                <input
value={deliveryPincode}
onChange={(e) => setDeliveryPincode(e.target.value)}
placeholder="110001"
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

            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {(['length', 'breadth', 'height'] as const).map((dim) => (
                <label key={dim} className="space-y-1 text-[11px] font-black uppercase text-gray-500 text-center">
                  {dim.charAt(0).toUpperCase()}(cm)
                  <input
                    type="number"
                    min="1"
                    value={dimensions[dim] || ''}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        [dim]: Number(e.target.value),
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
className="w-full h-[38px] rounded-[8px] bg-primary-blue px-6 text-sm font-black text-white shadow-sm hover:shadow-md hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center"
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
{prediction.courierComparison.slice(0, 10).map((item, index) => (
                    <div
                      key={item.name}
                      className="group flex items-center justify-between rounded-[8px] border border-gray-100 bg-white shadow-sm hover:shadow-md cursor-pointer p-4 h-[38px] hover:scale-[1.02] transition-all overflow-hidden"
                      onClick={() => {
                        const params = new URLSearchParams({
                          pickup_postcode: pickupPincode,
                          delivery_postcode: deliveryPincode,
                          weight: weight.toString(),
                          length: dimensions.length.toString(),
                          breadth: dimensions.breadth.toString(),
                          height: dimensions.height.toString(),
                          courier_name: item.name,
                        });
                        window.open(`https://app.shiprocket.in/shipment/create?${params}`, '_blank');
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-blue to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          #{index + 1}
                        </div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.delivery}</p>
                      </div>
                      <p className="font-black text-lg text-primary-blue">₹{item.price.toFixed(0)}</p>
                      <p className="text-xs text-gray-400 ml-2">{item.rating || '⭐⭐⭐⭐'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white/80 p-6 text-center text-xs text-gray-500">
              <p className="font-black uppercase tracking-widest">Awaiting Prediction</p>
<p className="mt-2">Enter pickup & delivery pincodes, package dimensions, and optionally upload image for AI dimension estimation to get real Shiprocket courier rates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
