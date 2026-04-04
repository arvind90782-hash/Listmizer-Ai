import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Copy, Check, Loader2, AlertCircle, TrendingUp, Globe, BarChart3 } from 'lucide-react';
import { generateKeywords } from '../../lib/gemini';

export default function KeywordTool() {
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('Amazon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productName) {
      setError('Please enter a product name to find keywords.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      const content = await generateKeywords(productName, platform);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleGenerate();
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Product Name / Category
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Wireless Bluetooth Headphones"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Target Marketplace
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Amazon', 'Flipkart', 'Meesho', 'Myntra'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    platform === p
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-primary-blue'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Trend</span>
              </div>
              <p className="text-lg font-black text-deep-dark dark:text-white">High</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Competition</span>
              </div>
              <p className="text-lg font-black text-deep-dark dark:text-white">Medium</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-2 !py-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Search Trends...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find High-Volume Keywords
              </>
            )}
          </button>
        </form>

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
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Keyword analysis will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
