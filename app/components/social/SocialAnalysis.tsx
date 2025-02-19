import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiImage, FiShare2, FiInfo, FiArrowLeft, FiBarChart2 } from 'react-icons/fi';
import { UsernameSearch } from './UsernameSearch';
import { ImageAnalysis } from './ImageAnalysis';
import { DataCorrelation } from './DataCorrelation';
import { LegalDisclaimer } from './LegalDisclaimer';
import { AnalyticsGrid } from './AnalyticsGrid';

type AnalysisTab = 'username' | 'image' | 'correlation' | 'legal' | null;

const analysisOptions = [
  {
    id: 'username',
    label: 'Username Search',
    icon: FiSearch,
    description: 'Search and analyze usernames across multiple platforms',
    color: '#ff0000'
  },
  {
    id: 'image',
    label: 'Image Analysis',
    icon: FiImage,
    description: 'Analyze images for metadata and perform reverse searches',
    color: '#00e5ff'
  },
  {
    id: 'correlation',
    label: 'Data Correlation',
    icon: FiShare2,
    description: 'Correlate data across different sources and timelines',
    color: '#bc13fe'
  },
  {
    id: 'legal',
    label: 'Legal Guidelines',
    icon: FiInfo,
    description: 'Important legal and ethical considerations',
    color: '#00ff41'
  }
];

// Mock analytics data
const mockAnalytics = {
  profiles: 847,
  activity: 92,
  reach: 156432,
  risks: 12,
  trends: {
    profiles: 15,
    activity: 8,
    reach: 23,
    risks: -5
  }
};

export function SocialAnalysis() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>(null);

  const handleCardClick = (tab: AnalysisTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 min-h-screen">
      <AnimatePresence mode="wait">
        {!activeTab ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-4">
                Social Analysis Tools
              </h1>
              <p className="text-gray-400">Select an analysis tool to begin your investigation</p>
            </div>

            {/* Analytics Overview */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <FiBarChart2 className="text-[#00e5ff] text-xl" />
                <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
              </div>
              <AnalyticsGrid data={mockAnalytics} />
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {analysisOptions.map((option) => (
                <motion.div
                  key={option.id}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 20,
                      scale: 0.95
                    },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 0 20px ${option.color}40`
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(option.id as AnalysisTab)}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 cursor-pointer
                           hover:border-white/20 transition-all duration-300"
                  style={{
                    boxShadow: `0 0 10px ${option.color}20`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <option.icon 
                        className="text-2xl"
                        style={{ color: option.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{option.label}</h3>
                      <p className="text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft />
                <span>Back to Tools</span>
              </button>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {analysisOptions.find(opt => opt.id === activeTab)?.label}
              </h2>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
              {activeTab === 'username' && <UsernameSearch />}
              {activeTab === 'image' && <ImageAnalysis />}
              {activeTab === 'correlation' && <DataCorrelation />}
              {activeTab === 'legal' && <LegalDisclaimer />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}