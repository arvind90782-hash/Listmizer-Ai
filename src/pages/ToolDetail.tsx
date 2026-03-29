import React, { Suspense, lazy, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TOOLS } from '../constants';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

const TOOL_LOADERS: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'listing-gen': () => import('../components/tools/ListingGenerator'),
  'image-gen': () => import('../components/tools/ImageGenerator'),
  'keyword-tool': () => import('../components/tools/KeywordTool'),
  'amazon-calc': () => import('../components/tools/AmazonCalculator'),
  'flipkart-calc': () => import('../components/tools/FlipkartCalculator'),
  'meesho-calc': () => import('../components/tools/MeeshoCalculator'),
  'gst-calc': () => import('../components/tools/GSTCalculator'),
  'profit-calc': () => import('../components/tools/ProfitCalculator'),
  'invoice-gen': () => import('../components/tools/InvoiceGenerator'),
  'barcode-gen': () => import('../components/tools/BarcodeGenerator'),
  'shipping-predictor': () => import('../components/tools/ShippingPredictorTool'),
};

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find((item) => item.id === id);

  const ToolComponent = useMemo(() => {
    if (!id || !TOOL_LOADERS[id]) return null;
    return lazy(TOOL_LOADERS[id]);
  }, [id]);

  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-24">
        <AlertCircle className="mb-6 h-16 w-16 text-red-500" />
        <h1 className="mb-4 text-3xl font-bold">Tool Not Found</h1>
        <p className="mb-8 text-gray-600 dark:text-slate-400">The tool you are looking for does not exist or has been moved.</p>
        <Link to="/tools" className="btn-primary">
          Back to All Tools
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-soft-bg pt-32 pb-24 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-primary-blue">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
        </motion.div>

        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-blue/10 text-primary-blue">
              <tool.icon className="h-8 w-8" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full border border-primary-blue/10 bg-primary-blue/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary-blue">
                  {tool.category}
                </span>
                {tool.id.includes('gen') && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500">
                    <Sparkles className="h-3 w-3" />
                    AI Powered
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-deep-dark dark:text-white md:text-4xl">{tool.title}</h1>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl text-lg text-gray-600 dark:text-slate-400"
          >
            {tool.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-5 shadow-2xl md:p-10 dark:bg-slate-900/50 dark:border-slate-800"
        >
          <Suspense fallback={<ToolLoading />}>
            {ToolComponent ? <ToolComponent /> : <ToolPlaceholder />}
          </Suspense>
        </motion.div>
      </div>
    </main>
  );
}

function ToolLoading() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue border-t-transparent" />
    </div>
  );
}

function ToolPlaceholder() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
        <Sparkles className="h-10 w-10 text-amber-500" />
      </div>
      <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
      <p className="mx-auto max-w-md text-gray-600 dark:text-slate-400">
        We&apos;re currently fine-tuning this AI tool to ensure it provides the most accurate results for your business.
      </p>
    </div>
  );
}
