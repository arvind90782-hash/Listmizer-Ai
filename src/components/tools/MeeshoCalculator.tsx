import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, TrendingUp, DollarSign, PieChart } from 'lucide-react';

export default function MeeshoCalculator() {
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0.5);
  
  const [fees, setFees] = useState({
    commission: 0,
    shipping: 0,
    gst: 0,
    total: 0,
    netProfit: 0,
    margin: 0
  });

  useEffect(() => {
    // Meesho India Fee Logic (Simplified)
    // Meesho is known for 0% commission
    const commission = 0;
    const shippingFee = weight * 55; // Base rate for Meesho
    
    const totalFeesBeforeGst = commission + shippingFee;
    const gstOnFees = totalFeesBeforeGst * 0.18;
    const totalFees = totalFeesBeforeGst + gstOnFees;
    
    const netProfit = sellingPrice - costPrice - totalFees;
    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;

    setFees({
      commission,
      shipping: shippingFee,
      gst: gstOnFees,
      total: totalFees,
      netProfit,
      margin
    });
  }, [sellingPrice, costPrice, weight]);

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

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
              Product Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="0.5"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
            />
          </div>

          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-start gap-3 text-green-700 dark:text-green-400 text-xs leading-relaxed">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Meesho offers 0% commission. Your primary costs are shipping and the 18% GST applied to logistics fees.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Meesho Fee Breakdown</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Marketplace Commission</span>
                <span className="text-sm font-bold text-green-500">₹0.00 (0%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">Shipping Fee</span>
                <span className="text-sm font-bold dark:text-white">₹{fees.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-slate-400">GST on Logistics (18%)</span>
                <span className="text-sm font-bold dark:text-white">₹{fees.gst.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-sm font-bold text-deep-dark dark:text-white">Total Deductions</span>
                <span className="text-sm font-black text-red-500">₹{fees.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 dark:border-primary-blue/20">
              <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-1">Net Profit</p>
              <p className={`text-2xl font-black ${fees.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{fees.netProfit.toFixed(0)}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-primary-blue/5 dark:bg-primary-blue/10 border border-primary-blue/10 dark:border-primary-blue/20">
              <p className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-1">Profit Margin</p>
              <p className={`text-2xl font-black ${fees.margin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {fees.margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
