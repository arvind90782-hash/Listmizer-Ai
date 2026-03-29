import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ToolsPage() {
  return (
    <main className="pt-32 pb-24 bg-soft-bg dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/5 border border-primary-blue/10 text-primary-blue text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>All-in-One Seller Suite</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-deep-dark dark:text-white mb-6"
          >
            AI Powered <span className="text-primary-blue">Seller Tools</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Explore our comprehensive collection of AI tools designed to automate your ecommerce workflow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-[2rem] flex flex-col group hover:shadow-2xl hover:shadow-primary-blue/10 transition-all duration-300 dark:bg-slate-900/50 dark:border-slate-800"
            >
              <div className="w-14 h-14 bg-primary-blue/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-blue group-hover:text-white transition-colors duration-300">
                <tool.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-deep-dark dark:text-white mb-3 group-hover:text-primary-blue transition-colors">
                {tool.title}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                {tool.description}
              </p>

              <Link 
                to={`/tools/${tool.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-deep-dark dark:text-white font-bold text-sm group-hover:bg-primary-blue group-hover:text-white transition-all duration-300"
              >
                Open Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
