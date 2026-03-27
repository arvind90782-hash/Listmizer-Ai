import React from 'react';
import PricingSection from '../components/PricingSection';
import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="pt-32 pb-24 bg-soft-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <PricingSection />

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time from your account settings. You will have access until the end of your billing period." },
              { q: "Do you offer a free trial for Pro plans?", a: "We have a generous Free plan that lets you test all core features. For Pro features, we offer a 7-day money-back guarantee." },
              { q: "Is my product data secure?", a: "Absolutely. We use enterprise-grade encryption and never share your product data or images with third parties." },
              { q: "Which marketplaces do you support?", a: "Currently we support Amazon India, Flipkart, Meesho, Shopify, and Etsy. More marketplaces are being added monthly." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <HelpCircle className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-deep-dark mb-2">{item.q}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
