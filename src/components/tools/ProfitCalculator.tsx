import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, PieChart, Info, ArrowRight, BarChart3 } from 'lucide-react';

export default function ProfitCalculator() {
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [marketingCost, setMarketingCost] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  
  const [result, setResult] = useState({
    grossProfit: 0,
    netProfit: 0,
    margin: 0,
    roi: 0,
    gstAmount: 0,
    totalCosts: 0
  });

  useEffect(() => {
    const gstAmount = sellingPrice * (gstRate / 100);
    const totalCosts = costPrice + shippingCost + marketingCost + gstAmount;
    const grossProfit = sellingPrice - costPrice;
    const netProfit = sellingPrice - totalCosts;
    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    const roi = costPrice > 0 ? (netProfit / costPrice) * 100 : 0;

    setResult({
      grossProfit,
      netProfit,
      margin,
      roi,
      gstAmount,
      totalCosts
    });
  }, [sellingPrice, costPrice, shippingCost, marketingCost, gstRate]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Cost Price (₹)
              </label>
              <input
                type="number"
                value={costPrice || ''}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Shipping Cost (₹)
              </label>
              <input
                type="number"
                value={shippingCost || ''}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                Marketing Cost (₹)
              </label>
              <input
                type="number"
                value={marketingCost || ''}
                onChange={(e) => setMarketingCost(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              GST Rate on Product (%)
            </label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
            >
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Net profit is calculated after deducting all costs including GST on the selling price. ROI is calculated based on the cost price of the product.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 dark:border-primary-blue/20">
              <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-1">Net Profit</p>
              <p className={`text-2xl font-black ${result.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{result.netProfit.toFixed(0)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 dark:border-primary-blue/20">
              <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-1">Profit Margin</p>
              <p className={`text-2xl font-black ${result.margin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.margin.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Profit Analysis</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Gross Profit</span>
                <span className="text-lg font-bold dark:text-white">₹{result.grossProfit.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Total Costs</span>
                <span className="text-lg font-bold text-red-500">₹{result.totalCosts.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">ROI (Return on Investment)</span>
                <span className={`text-lg font-bold ${result.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {result.roi.toFixed(1)}%
                </span>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-base font-bold text-deep-dark dark:text-white">Net Profit</span>
                <span className={`text-2xl font-black ${result.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{result.netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
