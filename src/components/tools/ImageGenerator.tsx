import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Loader2, AlertCircle, ImageIcon, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description for the image.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Professional studio-quality ecommerce product photo of ${prompt}. Clean white background, perfect lighting, high resolution, catalog style.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setResult(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `generated-product-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Product Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A premium black leather handbag with gold accents on a white studio background"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all resize-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-3 text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Tip: Be specific about colors, materials, and lighting for the best results. Our AI will automatically optimize it for a professional catalog look.</p>
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
                Generating Studio Image...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Generate AI Image
              </>
            )}
          </button>
        </div>

        <div className="relative aspect-square">
          <div className="absolute inset-0 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group w-full h-full"
                >
                  <img 
                    src={result} 
                    alt="Generated Product" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={handleDownload}
                      className="p-3 rounded-full bg-white text-deep-dark hover:scale-110 transition-transform"
                      title="Download Image"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="p-3 rounded-full bg-white text-deep-dark hover:scale-110 transition-transform"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 p-8"
                >
                  <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm font-bold mb-2">No Image Generated</p>
                  <p className="text-xs opacity-60">Your professional studio-quality catalog image will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <Loader2 className="w-10 h-10 text-primary-blue animate-spin mb-4" />
                <p className="text-sm font-bold text-primary-blue">AI is creating your masterpiece...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
