import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Upload, Camera, Check, AlertTriangle } from 'lucide-react';
import { generateProductListingFromImage, ProductListingInputs } from '../../lib/productListing';

const initialState: ProductListingInputs = {
  title: '',
  brand: '',
  category: '',
  description: '',
  imageNotes: '',
  additionalContext: '',
};

export default function ProductImageListing() {
  const [inputs, setInputs] = useState(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [limitNotice, setLimitNotice] = useState(false);

  const handleChange = (field: keyof ProductListingInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const isRateLimitError = (err: unknown) => {
    if (!err) return false;
    const message = typeof err === 'string' ? err : (err as { message?: string }).message ?? '';
    const status = (err as { status?: number }).status;
    if (status === 429 || /quota|limit|rate limit|exceeded/i.test(message)) {
      return true;
    }
    try {
      const parsed = typeof err === 'string' ? JSON.parse(err) : err;
      if (parsed?.error?.status === 'RESOURCE_EXHAUSTED' || parsed?.error?.status === 'RATE_LIMIT_EXCEEDED') {
        return true;
      }
    } catch {
      // ignore parse failures
    }
    return false;
  };

  const handleTryAgainLater = () => {
    setLimitNotice(false);
    setError(null);
  };

  const handleUpgrade = () => {
    window.open('https://listmizer-ai.vercel.app/pricing', '_blank', 'noopener');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!inputs.description.trim()) {
      setError('Please describe the product briefly so AI can fill the story.');
      return;
    }

    if (!imageFile) {
      setError('Please upload a product image before generating the listing.');
      return;
    }

    setError(null);
    setLimitNotice(false);
    setIsGenerating(true);
    try {
      const output = await generateProductListingFromImage(inputs);
      setResult(output);
      setLimitNotice(false);
    } catch (err: any) {
      if (isRateLimitError(err)) {
        setLimitNotice(true);
        setError(null);
      } else {
        setError(err?.message || 'Could not generate listing. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleGenerate();
  };

  const handleTextareaKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      await handleGenerate();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-deep-dark mb-2">Describe your product</h3>
            <p className="text-xs text-gray-500 mb-4">Just type a short summary and let the AI fill every marketplace section.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={inputs.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-blue"
                placeholder="Product Title (optional)"
              />
              <input
                value={inputs.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-blue"
                placeholder="Brand Name (optional)"
              />
            </div>
            <input
              value={inputs.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-blue"
              placeholder="Category / Sub-category hint (optional)"
            />
            <textarea
              value={inputs.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              rows={4}
              className="mt-4 w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm focus:ring-2 focus:ring-primary-blue"
              placeholder="Describe the product in 2–3 sentences, mention usage, materials, or customer promise."
            />
            <textarea
              value={inputs.additionalContext}
              onChange={(e) => handleChange('additionalContext', e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              rows={2}
              className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:ring-2 focus:ring-primary-blue"
              placeholder="Additional context (ideal audience, mood, style)."
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black text-gray-600 uppercase tracking-wider mb-3">Image (optional)</h3>
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              <Camera className="h-6 w-6 text-gray-400" />
              <p>Upload a product shot (white background, clear focus) to help the AI describe the visuals.</p>
              <label
                htmlFor="product-listing-image-upload"
                className="cursor-pointer rounded-full border border-primary-blue px-4 py-2 text-xs font-black text-primary-blue inline-flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </label>
              <input
                id="product-listing-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-full rounded-xl object-contain" />}
            </div>
            <textarea
              value={inputs.imageNotes}
              onChange={(e) => handleChange('imageNotes', e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              rows={2}
              className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:ring-2 focus:ring-primary-blue"
              placeholder="Optional: describe the image (angles, props, look)."
            />
          </div>
        </form>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !imageFile || !inputs.description.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating catalog JSON...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Listing Blueprint
              </>
            )}
          </button>
          {!imageFile && (
            <p className="text-[11px] text-gray-500 mt-2">Upload a product photo first—generations are locked without an image.</p>
          )}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600">
            <p className="font-black uppercase text-[11px] tracking-widest text-gray-500">AI Prompt Info</p>
            <p className="mt-2 text-[11px] text-gray-500">
              The AI will analyze your description & image, then return a JSON with Basic Info, Attributes, Variants, Pricing, Inventory, Shipping, Media suggestions, SEO keywords, and more.
            </p>
          </div>
        </div>
      </div>

      {limitNotice && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-black text-base text-amber-800">Free Usage Limit Reached</p>
              <p className="mt-1 text-xs text-amber-800/80">
                You have used all the free generations available for this tool. You can come back later when the limit resets, or upgrade your subscription to continue generating without limits.
              </p>
              <p className="mt-1 text-[10px] text-amber-700/80">Free generations reset every 24 hours.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={handleUpgrade}
                  className="rounded-full border border-amber-600 bg-amber-600 px-4 py-1 text-[11px] font-bold text-white transition hover:bg-amber-700"
                >
                  Upgrade Subscription
                </button>
                <button
                  onClick={handleTryAgainLater}
                  className="rounded-full border border-amber-500 px-4 py-1 text-[11px] font-bold text-amber-700 transition hover:bg-amber-100"
                >
                  Try Again Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!limitNotice && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <AlertTriangle className="inline-block mr-2 h-4 w-4 text-red-600" />
          {error}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-deep-dark dark:text-white">AI Generated Catalog JSON</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Check className="h-4 w-4 text-green-500" />
              Structured output
            </div>
          </div>
          <pre className="max-h-[480px] overflow-auto rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-700">
            {result}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
