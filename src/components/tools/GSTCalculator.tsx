import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hash, Info, Calculator, ArrowRight } from 'lucide-react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [type, setType] = useState<'Exclusive' | 'Inclusive'>('Exclusive');
  
  const [result, setResult] = useState({
    gstAmount: 0,
    totalAmount: 0,
    baseAmount: 0,
    cgst: 0,
    sgst: 0
  });

  useEffect(() => {
    let gstAmount = 0;
    let totalAmount = 0;
    let baseAmount = 0;

    if (type === 'Exclusive') {
      baseAmount = amount;
      gstAmount = amount * (gstRate / 100);
      totalAmount = amount + gstAmount;
    } else {
      totalAmount = amount;
      baseAmount = amount / (1 + gstRate / 100);
      gstAmount = amount - baseAmount;
    }

    setResult({
      gstAmount,
      totalAmount,
      baseAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2
    });
  }, [amount, gstRate, type]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              GST Rate (%)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    gstRate === rate
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-primary-blue'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Calculation Type
            </label>
            <div className="flex gap-2">
              {['Exclusive', 'Inclusive'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as any)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                    type === t
                      ? 'bg-primary-blue text-white border-primary-blue'
                      : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-primary-blue'
                  }`}
                >
                  GST {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>GST is split equally between Central (CGST) and State (SGST) for intra-state transactions. For inter-state, IGST applies (Total GST).</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">GST Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Base Amount</span>
                <span className="text-lg font-bold dark:text-white">₹{result.baseAmount.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200 dark:border-slate-700">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">CGST ({gstRate/2}%)</p>
                  <p className="text-sm font-bold dark:text-white">₹{result.cgst.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">SGST ({gstRate/2}%)</p>
                  <p className="text-sm font-bold dark:text-white">₹{result.sgst.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Total GST Amount</span>
                <span className="text-lg font-bold text-primary-blue">₹{result.gstAmount.toFixed(2)}</span>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-base font-bold text-deep-dark dark:text-white">Total Amount</span>
                <span className="text-2xl font-black text-primary-blue">₹{result.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
