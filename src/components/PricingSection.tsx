import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../constants';
import { cn } from '../lib/utils';

export default function PricingSection() {
  return (
    <section className="py-10 bg-soft-bg dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-deep-dark dark:text-white mb-2">
            Simple, <span className="text-primary-blue">Transparent</span> Pricing
          </h2>
          <p className="text-xs text-gray-600 dark:text-slate-400 max-w-xl mx-auto">
            Choose the plan that fits your business stage. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "glass-card rounded-[1.25rem] p-5 flex flex-col relative dark:bg-slate-900/50 dark:border-slate-800",
                plan.highlighted ? "border-primary-blue/30 shadow-xl shadow-primary-blue/5 scale-102 z-10" : ""
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-blue text-white px-3 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-3">
                <h3 className="text-base font-bold text-deep-dark dark:text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-extrabold text-deep-dark dark:text-white">{plan.price}</span>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight">{plan.description}</p>
              </div>

              <div className="space-y-2.5 mb-5 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      plan.highlighted ? "bg-primary-blue/10 text-primary-blue" : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500"
                    )}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={cn(
                "w-full py-1.5 rounded-xl font-bold transition-all duration-300 text-xs",
                plan.highlighted 
                  ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20 hover:bg-primary-blue/90" 
                  : "bg-gray-100 dark:bg-slate-800 text-deep-dark dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700"
              )}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
