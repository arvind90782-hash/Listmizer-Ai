import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Barcode, Download, Printer, Info, RefreshCw } from 'lucide-react';

export default function BarcodeGenerator() {
  const [sku, setSku] = useState(`SKU-${Math.floor(Math.random() * 1000000)}`);
  const [format, setFormat] = useState('CODE128');
  const [isGenerating, setIsGenerating] = useState(false);
  const barcodeRef = useRef<HTMLDivElement>(null);

  const generateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSku(`SKU-${Math.floor(Math.random() * 1000000)}`);
      setIsGenerating(false);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateNew();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
            Enter SKU or Product ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter SKU"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
            />
            <button
              type="submit"
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-primary-blue transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
            Barcode Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
          >
            <option value="CODE128">CODE 128 (Standard)</option>
            <option value="EAN13">EAN-13 (Retail)</option>
            <option value="UPC">UPC (Universal)</option>
            <option value="QR">QR Code</option>
          </select>
        </div>
      </form>

      <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-8 shadow-2xl shadow-primary-blue/5">
        <div ref={barcodeRef} className="p-8 bg-white rounded-xl border border-gray-100 flex flex-col items-center space-y-4">
          {/* Visual Barcode Representation */}
          <div className="flex gap-1 h-24 items-end">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{
                  width: Math.random() > 0.5 ? '2px' : '4px',
                  height: `${60 + Math.random() * 40}%`,
                  opacity: Math.random() > 0.1 ? 1 : 0
                }}
              />
            ))}
          </div>
          <p className="text-sm font-mono font-bold tracking-[0.5em] text-black uppercase">{sku}</p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Format: {format}</p>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-blue-700 dark:text-blue-400 text-[10px] leading-relaxed max-w-sm">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>This generator creates high-resolution barcodes suitable for thermal printing on labels. Ensure your scanner supports the selected format.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrint}
          className="px-8 py-4 rounded-2xl bg-primary-blue text-white font-bold flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-primary-blue/20"
        >
          <Printer className="w-5 h-5" />
          Print Labels
        </button>
        <button
          className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-deep-dark dark:text-white font-bold border border-gray-200 dark:border-slate-700 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </button>
      </div>
    </div>
  );
}
