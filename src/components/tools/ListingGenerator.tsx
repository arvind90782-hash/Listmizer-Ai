import React, { useMemo, useState } from 'react';
import { Copy, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { generateProductContent } from '../../lib/gemini';
import { auth } from '../../lib/firebase';

function splitSections(result: string) {
  const titleMatch = result.match(/TITLE:\s*([\s\S]*?)(?:\n\s*\n|$)/i);
  const bulletsMatch = result.match(/BULLET POINTS:\s*([\s\S]*?)(?:\n\s*\nDESCRIPTION:|$)/i);
  const descMatch = result.match(/DESCRIPTION:\s*([\s\S]*?)(?:\n\s*\nKEYWORDS:|$)/i);
  const keywordsMatch = result.match(/KEYWORDS:\s*([\s\S]*)$/i);

  return {
    title: titleMatch?.[1]?.trim() || 'Generated listing title',
    bullets: bulletsMatch?.[1]?.trim() || '1. Feature one\n2. Feature two\n3. Feature three',
    description: descMatch?.[1]?.trim() || 'Your generated product description will appear here.',
    keywords: keywordsMatch?.[1]?.trim() || 'keyword one, keyword two, keyword three',
  };
}

export default function ListingGenerator() {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [platform, setPlatform] = useState('Amazon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = useMemo(() => Boolean(auth.currentUser), []);
  const parsed = result ? splitSections(result) : null;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleGenerate();
  };

  return (
    <div className="space-y-8">
      {!isLoggedIn && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
          Guest mode is limited. Login to unlock full-length listings, saved history, and faster usage.
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Premium Leather Laptop Bag"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Key Features (One per line)
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g. Water resistant\nFits 15-inch laptop\nGenuine leather"
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Target Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {['Amazon', 'Flipkart', 'Meesho', 'Myntra'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                    platform === p
                      ? 'border-primary-blue bg-primary-blue text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-primary-blue dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary w-full !py-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Listing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate AI Listing
              </>
            )}
          </button>
        </form>

        <div className="relative min-h-[400px]">
          <div className="absolute inset-0 overflow-auto rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
            {parsed ? (
              <div className="space-y-5">
                <div className="relative rounded-2xl border border-white/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-4 top-4 rounded-lg bg-gray-50 p-2 shadow-sm transition hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
                  </button>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">Title</p>
                  <h3 className="max-w-[90%] text-2xl font-black text-deep-dark dark:text-white">{parsed.title}</h3>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">Bullet Points</p>
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-slate-300">{parsed.bullets}</pre>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">Description</p>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">{parsed.description}</p>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">Keywords</p>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">{parsed.keywords}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                <Sparkles className="mb-4 h-12 w-12 opacity-20" />
                <p className="text-sm">Your AI-generated listing will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
