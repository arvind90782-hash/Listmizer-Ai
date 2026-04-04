import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Loader2, AlertCircle, ImageIcon, RefreshCw, Upload, X } from 'lucide-react';
import { auth } from '../../lib/firebase';

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

function svgDataUrl({ prompt, photo, accent }: { prompt: string; photo?: string | null; accent: string }) {
  const safePrompt = prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="1"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="1"/>
      </linearGradient>
      <radialGradient id="r" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="1200" fill="url(#g)"/>
    <rect width="1200" height="1200" fill="url(#r)"/>
    ${photo ? `<image href="${photo}" x="120" y="160" width="960" height="760" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)" />` : ''}
    <rect x="120" y="160" width="960" height="760" rx="56" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
    <rect x="120" y="950" width="960" height="130" rx="36" fill="rgba(15,23,42,0.7)"/>
    <text x="180" y="1000" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800">Listmizer AI</text>
    <text x="180" y="1050" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="500">${safePrompt}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = useMemo(() => Boolean(auth.currentUser), []);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(await fileToDataUrl(file));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please add a product description before generating.');
      return;
    }

    if (!imagePreview && !imageFile) {
      setError('Please upload a product image first.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const imageUrl = imagePreview || (imageFile ? await fileToDataUrl(imageFile) : null);
      const generated = svgDataUrl({
        prompt,
        photo: imageUrl,
        accent: '#2563EB',
      });
      setResult(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `generated-product-${Date.now()}.svg`;
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleGenerate();
  };

  const handlePromptKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      await handleGenerate();
    }
  };

  return (
    <div className="space-y-8">
      {!isLoggedIn && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
          Guest mode is limited. Login unlocks more generations and download access.
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Product Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="e.g. A premium black leather handbag with gold accents on a white studio background"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <Sparkles className="h-4 w-4" />
              Studio tip
            </div>
            Add colors, lighting, and background details for a cleaner marketplace preview.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex-1 !justify-start"
            >
              <Upload className="h-4 w-4" />
              {imagePreview ? 'Replace Image' : 'Upload Product Image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="rounded-xl border border-gray-200 bg-white p-3 text-gray-500 transition hover:text-red-500 dark:border-slate-700 dark:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {imagePreview && (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <img src={imagePreview} alt="Upload preview" className="h-56 w-full object-cover" />
            </div>
          )}

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
                Generating Studio Image...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                Generate AI Image
              </>
            )}
          </button>
        </form>

        <div className="relative aspect-square">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative h-full w-full"
                >
                  <img src={result} alt="Generated Product" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={handleDownload}
                      className="rounded-full bg-white p-3 text-deep-dark transition-transform hover:scale-110"
                      title="Download Image"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="rounded-full bg-white p-3 text-deep-dark transition-transform hover:scale-110"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-gray-400"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 dark:bg-slate-800">
                    <ImageIcon className="h-10 w-10 opacity-20" />
                  </div>
                  <p className="mb-2 text-sm font-bold">No Image Generated</p>
                  <p className="text-xs opacity-60">Your studio-quality catalog preview will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isGenerating && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-900/70">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary-blue" />
                <p className="text-sm font-bold text-primary-blue">AI is creating your image...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
