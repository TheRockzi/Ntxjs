import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiImage, FiShare2, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { UsernameSearch } from './UsernameSearch';
import { ImageAnalysis } from './ImageAnalysis';
import { DataCorrelation } from './DataCorrelation';
import { LegalDisclaimer } from './LegalDisclaimer';

type AnalysisTab = 'username' | 'image' | 'correlation' | 'legal' | null;

const analysisOptions = [
  {
    id: 'username',
    label: 'Username Search',
    icon: FiSearch,
    description: 'Search and analyze usernames across multiple platforms',
    color: '#ff0000',
    gradient: 'from-[#ff0000]/20 to-transparent'
  },
  {
    id: 'image',
    label: 'Image Analysis',
    icon: FiImage,
    description: 'Analyze images for metadata and perform reverse searches',
    color: '#00e5ff',
    gradient: 'from-[#00e5ff]/20 to-transparent'
  },
  {
    id: 'correlation',
    label: 'Data Correlation',
    icon: FiShare2,
    description: 'Correlate data across different sources and timelines',
    color: '#bc13fe',
    gradient: 'from-[#bc13fe]/20 to-transparent'
  },
  {
    id: 'legal',
    label: 'Legal Guidelines',
    icon: FiInfo,
    description: 'Important legal and ethical considerations',
    color: '#00ff41',
    gradient: 'from-[#00ff41]/20 to-transparent'
  }
];

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
              <h1 className="text-4xl font-bold text-white mb-4">
                Social Analysis Tools
              </h1>
              <p className="text-lg text-gray-200">Select an analysis tool to begin your investigation</p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
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
                    scale: 1.02,
                    y: -5
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(option.id as AnalysisTab)}
                  className="relative group cursor-pointer"
                >
                  {/* Background Gradient Effect */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 
                               group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`}
                  />

                  {/* Card Content */}
                  <div className="relative bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8
                                hover:border-white/20 transition-all duration-500 overflow-hidden
                                shadow-lg hover:shadow-xl hover:shadow-black/30">
                    {/* Decorative Elements */}
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-16 -translate-y-16 rounded-full"
                      style={{ background: `radial-gradient(circle, ${option.color}, transparent 70%)` }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 w-24 h-24 opacity-10 transform -translate-x-12 translate-y-12 rounded-full"
                      style={{ background: `radial-gradient(circle, ${option.color}, transparent 70%)` }}
                    />

                    {/* Icon */}
                    <div 
                      className="relative inline-flex p-4 rounded-xl mb-6 transition-transform duration-500
                                group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <option.icon 
                        className="text-3xl transition-transform duration-500 group-hover:scale-110"
                        style={{ color: option.color }}
                      />
                      <div 
                        className="absolute inset-0 rounded-xl opacity-50 blur-md transition-opacity duration-500
                                 group-hover:opacity-100"
                        style={{ backgroundColor: `${option.color}10` }}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white tracking-wide
                                   transition-all duration-500"
                      >
                        {option.label}
                      </h3>
                      <p className="text-base text-gray-200 font-medium leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    {/* Hover Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-2
                                  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <div 
                        className="text-sm font-bold tracking-wide"
                        style={{ color: option.color }}
                      >
                        Click to Start →
                      </div>
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
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-medium"
              >
                <FiArrowLeft />
                <span>Back to Tools</span>
              </button>
              <h2 className="text-2xl font-bold text-white">
                {analysisOptions.find(opt => opt.id === activeTab)?.label}
              </h2>
            </div>

            <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-xl p-6">
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