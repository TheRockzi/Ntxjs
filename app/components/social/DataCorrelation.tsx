import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUsers, FiActivity, FiMap, FiShare2, FiClock, FiGlobe } from 'react-icons/fi';
import type { CorrelationData } from '@/app/lib/types';

export function DataCorrelation() {
  const [target, setTarget] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<CorrelationData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/social/correlate?target=${encodeURIComponent(target)}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-[#bc13fe]/10 mb-4"
        >
          <FiShare2 className="text-3xl text-[#bc13fe]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Correlation</h2>
        <p className="text-gray-400">Connect and analyze relationships across platforms</p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#bc13fe]/20 to-[#00e5ff]/20 blur-xl opacity-20"></div>
          <div className="relative">
            <FiUsers className="absolute left-4 top-4 text-xl text-gray-500" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target identifier (username, email, etc.)"
              className="w-full bg-black/40 backdrop-blur-xl border-2 border-white/10 rounded-2xl pl-12 pr-32 py-4 text-lg text-white
                       placeholder:text-gray-500 focus:outline-none focus:border-[#bc13fe]/40 transition-all
                       hover:border-white/20 shadow-lg shadow-black/20"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !target}
              className="absolute right-3 top-3 bg-gradient-to-r from-[#bc13fe] to-[#bc13fe]/80 text-white px-6 py-2 rounded-xl
                       hover:from-[#bc13fe]/90 hover:to-[#bc13fe]/70 transition-all duration-300 font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#bc13fe]/20
                       hover:shadow-xl hover:shadow-[#bc13fe]/30 disabled:hover:shadow-none"
            >
              <div className="flex items-center gap-2">
                <FiSearch className={`text-lg ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>Analyze</span>
              </div>
            </button>
          </div>
        </div>
      </form>

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Timeline */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                       hover:border-white/20 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[#00e5ff]/10">
                <FiActivity className="text-2xl text-[#00e5ff]" />
              </div>
              <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
            </div>

            <div className="space-y-6">
              {data.timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-6 border-l-2 border-[#00e5ff]/20 last:pb-0
                           group/event hover:border-[#00e5ff] transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 w-4 h-4 bg-[#00e5ff] rounded-full -translate-x-[9px]
                               group-hover/event:scale-125 transition-transform duration-300" />
                  
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-[#00e5ff]" />
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-white/5
                               group-hover/event:border-white/20 transition-all duration-300">
                    <p className="text-white mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiGlobe className="text-[#00e5ff]" />
                      <span>{event.platform}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connection Map */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                       hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[#bc13fe]/10">
                <FiMap className="text-2xl text-[#bc13fe]" />
              </div>
              <h3 className="text-xl font-semibold text-white">Connection Map</h3>
            </div>

            <div className="aspect-square bg-black/40 rounded-xl p-6 border border-white/5
                         hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-400">
                  Connection visualization would go here
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}