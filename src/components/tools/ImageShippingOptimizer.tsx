import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ImageIcon,
  Truck,
  Loader2,
  Crop,
} from 'lucide-react';
import { getShippingRates } from '../../lib/shiprocket';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);



  const analyzeImage = async (base64: string): Promise<{cropRatio: number}> => {
    // Use Gemini or fallback
    const cropRatio = 0.3; // 30% reduction fallback
    // TODO: Extend gemini.ts for vision bbox
    return {cropRatio};
  };

  const generateThumbnails = async (image: HTMLImageElement, ratios: number[]): Promise<string[]> => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas not initialized');
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not access canvas context');
    }

    const thumbs: string[] = [];
    for (const ratio of ratios) {
      const scale = Math.max(0.25, Math.min(0.9, 1 - ratio));
      const w = image.width * scale;
      const h = image.height * scale;
      canvas.width = 200;
      canvas.height = (h / w) * 200 || 200;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      thumbs.push(canvas.toDataURL());
    }
    return thumbs;
  };

  const handleOptimize = async () => {
    if (!imageFile || !imagePreview) {
      setError('Please upload an image before optimizing.');
      return;
    }
    if (!pickupPincode || !deliveryPincode || !baseWeight || baseWeight <= 0) {
      setError('Please provide valid pin codes and weight.');
      return;
    }
    if (baseDims.length <= 0 || baseDims.breadth <= 0 || baseDims.height <= 0) {
      setError('Please provide valid package dimensions.');
      return;
    }

    setError('');
    setIsOptimizing(true);
    setOptimizations([]);

    try {
      const base64 = imagePreview.split(',')[1];
      const analysis = await analyzeImage(base64);
      const baseCrop = Math.min(0.5, Math.max(0.1, analysis.cropRatio ?? 0.3));
      const ratios = Array.from({ length: 12 }, (_, i) => Math.min(0.85, baseCrop + i * 0.04));

      const img = new Image();
      img.src = imagePreview;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Unable to load the uploaded image.'));
      });

      const thumbnails = await generateThumbnails(img, ratios);
      const baseRates = await getShippingRates(
        pickupPincode,
        deliveryPincode,
        baseWeight,
        baseDims.length,
        baseDims.breadth,
        baseDims.height
      );

      if (baseRates.length === 0) {
        throw new Error('No base rates available for this route.');
      }

      const baseRate = baseRates[0];

      const promises = ratios.map(async (ratio, i) => {
        const scale = Math.max(0.25, 1 - ratio);
        const optDims: Dim = {
          length: baseDims.length * scale,
          breadth: baseDims.breadth * scale,
          height: baseDims.height * scale,
        };

        const rates = await getShippingRates(
          pickupPincode,
          deliveryPincode,
          baseWeight,
          optDims.length,
          optDims.breadth,
          optDims.height
        );

        if (!rates.length) {
          throw new Error('No optimized rates returned.');
        }

        const bestRate = rates[0];
        const savings = baseRate.rate > 0 ? ((baseRate.rate - bestRate.rate) / baseRate.rate) * 100 : 0;

        return {
          id: i,
          thumbnail: thumbnails[i],
          dims: optDims,
          rate: bestRate.rate,
          courier: bestRate.courier_name,
          etd: bestRate.etd,
          savings: Number(savings.toFixed(1)),
        };
      });

      const results = await Promise.all(promises);
      const sorted = results.sort((a, b) => a.rate - b.rate);
      setOptimizations(sorted);
    } catch (err) {
      console.error(err);
      setError('Optimization failed. Try again.');
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
