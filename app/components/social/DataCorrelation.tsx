import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUsers, FiActivity, FiMap } from 'react-icons/fi';
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
    <div className="space-y-6">
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="relative">
          <FiUsers className="absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target identifier (username, email, etc.)"
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white
                     placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !target}
            className="absolute right-2 top-2 bg-[#ff0000] text-white px-4 py-2 rounded-lg
                     hover:bg-[#ff0000]/90 transition-all duration-300 disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            <FiSearch className={`text-lg ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </form>

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Timeline */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-[#00e5ff]" />
              <h3 className="text-lg font-medium text-white">Activity Timeline</h3>
            </div>
            <div className="space-y-4">
              {data.timeline.map((event, index) => (
                <div
                  key={index}
                  className="relative pl-6 pb-4 border-l border-white/10 last:pb-0"
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-[#00e5ff] rounded-full -translate-x-[5px]" />
                  <p className="text-sm text-gray-400">{event.date}</p>
                  <p className="text-white">{event.description}</p>
                  <p className="text-sm text-gray-500">{event.platform}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Map */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <FiMap className="text-[#00e5ff]" />
              <h3 className="text-lg font-medium text-white">Connection Map</h3>
            </div>
            <div className="aspect-square bg-black/20 rounded-lg p-4">
              {/* Here you would integrate a graph visualization library */}
              <p className="text-center text-gray-400">Connection visualization would go here</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}