import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Loader2,
  AlertCircle,
  ImageIcon,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { generateMarketplaceImages, GeneratedMarketplaceImage } from '../../lib/gemini';

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedMarketplaceImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = useMemo(() => Boolean(auth.currentUser), []);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(await fileToDataUrl(file));
    setResults([]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for how you want to modify the product image.');
      return;
    }

    if (!imagePreview && !imageFile) {
      setError('Please upload a product image first.');
      return;
    }

    if (!imageFile) {
      setError('Please upload the original product file again.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const imageDataUrl = imagePreview || (await fileToDataUrl(imageFile));
      const imageBase64 = imageDataUrl.split(',')[1];
      const mimeType = imageFile.type || 'image/png';

      const generated = await generateMarketplaceImages(
        prompt,
        imageBase64,
        mimeType,
        imageDataUrl
      );

      const usableResults = generated.filter((item) => item.imageUrl);
      if (usableResults.length !== 3) {
        throw new Error('Gemini did not return all 3 image variants. Please try again.');
      }

      setResults(usableResults);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate marketplace images.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (item: GeneratedMarketplaceImage) => {
    if (!item.imageUrl) return;
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.id}-${Date.now()}.png`;
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

      <div className="grid items-start gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-slate-300">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="e.g. Make this product look premium with studio lighting, clean white background, luxury shadows, and generate 3 professional ecommerce variants"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-relaxed text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <Sparkles className="h-4 w-4" />
              Generation direction
            </div>
            Upload one product image, then write how you want it modified. The tool will edit that
            same uploaded image according to your prompt and generate 3 professional ecommerce
            variants.
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
                  setResults([]);
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

          <button type="submit" disabled={isGenerating} className="btn-primary w-full !py-4">
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Modifying Image Into 3 Variants...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                Generate 3 Variants
              </>
            )}
          </button>
        </form>

        <div className="relative min-h-[640px] rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:p-6">
          <AnimatePresence mode="wait">
            {results.length ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-1"
              >
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt="Generated ecommerce product"
                        className="h-72 w-full object-cover sm:h-80"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-deep-dark transition hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={handleGenerate}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                          disabled={isGenerating}
                        >
                          <RefreshCw className="h-4 w-4" />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-[560px] flex-col items-center justify-center p-8 text-center text-gray-400"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 dark:bg-slate-800">
                  <ImageIcon className="h-10 w-10 opacity-20" />
                </div>
                <p className="mb-2 text-sm font-bold">No Images Generated Yet</p>
                <p className="max-w-sm text-xs opacity-60">
                  Your uploaded product image will be modified into 3 professional ecommerce
                  variants that you can download and use in listings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isGenerating && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-white/75 backdrop-blur-sm dark:bg-slate-900/70">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary-blue" />
              <p className="text-sm font-bold text-primary-blue">
                Gemini is modifying your image into 3 professional variants...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
