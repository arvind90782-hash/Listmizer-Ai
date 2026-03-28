import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ImageIcon,
  Truck,
  MapPin,
  Package,
  Loader2,
  Download,
  Crop,
  Ruler,
} from 'lucide-react';

interface Dim {
  length: number;
  breadth: number;
  height: number;
}

interface Optimization {
  id: number;
  thumbnail: string;
  dims: Dim;
  rate: number;
  courier: string;
  etd: string;
  savings: number;
}

interface CourierRate {
  courier_name: string;
  rate: number;
  etd: string;
  pickup_rating?: number;
  delivery_rating?: number;
}

const ImageShippingOptimizer: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pickupPincode, setPickupPincode] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [baseWeight, setBaseWeight] = useState(0.5);
  const [baseDims, setBaseDims] = useState<Dim>({ length: 30, breadth: 20, height: 10 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getToken = async (): Promise<string> => {
    const localToken = localStorage.getItem('shiprocket_token');
    if (localToken) return localToken;

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: import.meta.env.VITE_SHIPROCKET_EMAIL || 'arvind90782@gmail.com',
        password: import.meta.env.VITE_SHIPROCKET_PASSWORD || 'n7905752@NA',
      }),
    });
    const data = await res.json();
    const newToken = data.token;
    localStorage.setItem('shiprocket_token', newToken);
    setToken(newToken);
    return newToken;
  };

  const getShippingRates = async (pickup: string, delivery: string, weight: number, length: number, breadth: number, height: number): Promise<CourierRate[]> => {
    const token = await getToken();
    const params = new URLSearchParams({
      pickup_postcode: pickup,
      delivery_postcode: delivery,
      weight: weight.toString(),
      length: length.toString(),
      breadth: breadth.toString(),
      height: height.toString(),
    });
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`, {
      headers: {'Authorization': `Bearer ${token}`},
    });
    const data = await res.json();
    return data.data.available_courier_companies || [];
  };

  const analyzeImage = async (base64: string): Promise<{cropRatio: number}> => {
    // Use Gemini or fallback
    const cropRatio = 0.3; // 30% reduction fallback
    // TODO: Extend gemini.ts for vision bbox
    return {cropRatio};
  };

  const generateThumbnails = async (image: HTMLImageElement, ratios: number[]): Promise<string[]> => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const thumbs = [];
    for (let ratio of ratios) {
      const scale = 1 - ratio;
      const w = image.width * scale;
      const h = image.height * scale;
      canvas.width = 200;
      canvas.height = (h / w) * 200;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      thumbs.push(canvas.toDataURL());
    }
    return thumbs;
  };

  const handleOptimize = async () => {
    if (!imageFile || !pickupPincode || !deliveryPincode || !baseWeight || !baseDims.length) {
      setError('Please fill all fields and upload image.');
      return;
    }

    setIsOptimizing(true);
    setError('');
    try {
      const base64 = imagePreview!.split(',')[1];
      const analysis = await analyzeImage(base64);
      const ratios = Array.from({length: 12}, (_, i) => i * 0.083); // 0-1 step 8.3%

      const img = new Image();
      img.src = imagePreview!;
      await new Promise(r => img.onload = r);

      const thumbnails = await generateThumbnails(img, ratios);

      const promises = ratios.map(async (ratio, i) => {
        const scale = 1 - ratio;
        const optDims = {
          length: baseDims.length * scale,
          breadth: baseDims.breadth * scale,
          height: baseDims.height * scale,
        };
        const rates = await getShippingRates(pickupPincode, deliveryPincode, baseWeight, optDims.length, optDims.breadth, optDims.height);
        const bestRate = rates[0];
        const baseRate = (await getShippingRates(pickupPincode, deliveryPincode, baseWeight, baseDims.length, baseDims.breadth, baseDims.height))[0];
        const savings = ((baseRate.rate - bestRate.rate) / baseRate.rate * 100).toFixed(1);
        return {
          id: i,
          thumbnail: thumbnails[i],
          dims: optDims,
          rate: bestRate.rate,
          courier: bestRate.courier_name,
          etd: bestRate.etd,
          savings: Number(savings),
        };
      });

      const results = await Promise.all(promises);
      const sorted = results.sort((a, b) => a.rate - b.rate);
      setOptimizations(sorted);
    } catch (err) {
      setError('Optimization failed. Try again.');
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file || file.size > 5 * 1024 * 1024) {
      setError('Max 5MB JPG/PNG/WEBP');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <motion.div className="glass-card p-8 rounded-[2rem]">
        <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Truck className="w-10 h-10" />
          Meesho Image Shipping Optimizer
        </h2>
        <p className="text-gray-600 mb-8">Upload image → AI optimize → 12 packaging options → cheapest shipping</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold mb-2">Upload Product Image</label>
            <label htmlFor="optimizer-image" className="block w-full p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer hover:border-primary-blue">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-bold">Click to upload JPG/PNG/WEBP (Max 5MB)</p>
            </label>
            <input id="optimizer-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full max-h-64 object-contain rounded-xl shadow-lg" />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Package Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Pickup Pin</label>
                <input
                  type="text"
                  value={pickupPincode}
                  onChange={(e) => setPickupPincode(e.target.value)}
                  placeholder="400001"
                  className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Delivery Pin</label>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  placeholder="110001"
                  className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baseWeight}
                  onChange={(e) => setBaseWeight(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Dims LxBxH (cm)</label>
                <input
                  type="text"
                  value={`${baseDims.length}x${baseDims.breadth}x${baseDims.height}`}
                  onChange={(e) => {
                    const [l, b, h] = e.target.value.split('x').map(Number);
                    setBaseDims({length: l || 30, breadth: b || 20, height: h || 10});
                  }}
                  placeholder="30x20x10"
                  className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary-blue"
                />
              </div>
            </div>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full bg-gradient-to-r from-primary-blue to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crop className="w-5 h-5" />}
              {isOptimizing ? 'Optimizing...' : 'Optimize for Cheapest Shipping'}
            </button>
          </div>
        </div>
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold">{error}</div>}
      </motion.div>

      {optimizations.length > 0 && (
        <motion.div className="glass-card p-8 rounded-[2rem]">
          <h3 className="text-2xl font-bold mb-6">Optimized Packaging Options ({optimizations.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {optimizations.map((opt) => (
              <motion.div
                key={opt.id}
                className="group relative rounded-2xl bg-white/70 backdrop-blur-sm border shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden"
              >
                <div className="p-6 text-center">
                  <img src={opt.thumbnail} alt={`Opt ${opt.id}`} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition" />
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-2xl text-primary-blue">₹{opt.rate.toFixed(0)}</span>
                      <span className="text-sm font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {opt.savings}%
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{opt.courier}</p>
                    <p className="text-xs text-gray-500">{opt.etd}</p>
                    <p className="text-xs text-gray-600">{Object.values(opt.dims).map((d) => d.toFixed(0)).join('x')}cm</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageShippingOptimizer;
