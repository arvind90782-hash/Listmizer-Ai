import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TOOLS } from '../constants';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import ListingGenerator from '../components/tools/ListingGenerator';
import ImageGenerator from '../components/tools/ImageGenerator';
import KeywordTool from '../components/tools/KeywordTool';
import AmazonCalculator from '../components/tools/AmazonCalculator';
import FlipkartCalculator from '../components/tools/FlipkartCalculator';
import MeeshoCalculator from '../components/tools/MeeshoCalculator';
import GSTCalculator from '../components/tools/GSTCalculator';
import ProfitCalculator from '../components/tools/ProfitCalculator';
import InvoiceGenerator from '../components/tools/InvoiceGenerator';
import BarcodeGenerator from '../components/tools/BarcodeGenerator';
import ShippingPredictorTool from '../components/tools/ShippingPredictorTool';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'listing-gen': ListingGenerator,
  'image-gen': ImageGenerator,
  'keyword-tool': KeywordTool,
  'amazon-calc': AmazonCalculator,
  'flipkart-calc': FlipkartCalculator,
  'meesho-calc': MeeshoCalculator,
  'gst-calc': GSTCalculator,
  'profit-calc': ProfitCalculator,
  'invoice-gen': InvoiceGenerator,
  'barcode-gen': BarcodeGenerator,
  'shipping-predictor': ShippingPredictorTool,
};

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.id === id);
  const ToolComponent = id ? TOOL_COMPONENTS[id] : null;

  if (!tool) {
    return (
      <div className="pt-32 pb-24 flex flex-col items-center justify-center min-h-screen px-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-gray-600 mb-8">The tool you are looking for does not exist or has been moved.</p>
        <Link to="/tools" className="btn-primary">Back to All Tools</Link>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-24 bg-soft-bg dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/tools" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-blue transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
        </motion.div>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue">
              <tool.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-primary-blue/5 text-primary-blue text-[10px] font-black uppercase tracking-wider border border-primary-blue/10">
                  {tool.category}
                </span>
                {tool.id.includes('gen') && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    AI Powered
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-deep-dark dark:text-white tracking-tight">
                {tool.title}
              </h1>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-slate-400 text-lg max-w-3xl"
          >
            {tool.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl dark:bg-slate-900/50 dark:border-slate-800"
        >
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're currently fine-tuning this AI tool to ensure it provides the most accurate results for your business.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
