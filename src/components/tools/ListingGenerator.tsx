import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { generateProductContent } from '../../lib/gemini';

export default function ListingGenerator() {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [platform, setPlatform] = useState('Amazon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productName || !features) {
      setError('Please enter product details before generating.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      const content = await generateProductContent(productName, features, platform);
      setResult(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Premium Leather Laptop Bag"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Key Features (One per line)
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g. Water resistant\nFits 15-inch laptop\nGenuine leather"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Target Platform
            </label>
            <div className="flex gap-2">
              {['Amazon', 'Flipkart', 'Meesho', 'Myntra'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    platform === p
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-primary-blue'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-2 !py-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Optimized Listing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Listing
              </>
            )}
          </button>
        </div>

        <div className="relative min-h-[400px]">
          <div className="absolute inset-0 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 overflow-auto">
            {result ? (
              <div className="relative">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-0 right-0 p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Your AI-generated listing will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
