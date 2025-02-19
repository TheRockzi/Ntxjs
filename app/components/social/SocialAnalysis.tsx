import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiImage, FiShare2, FiInfo } from 'react-icons/fi';
import { UsernameSearch } from './UsernameSearch';
import { ImageAnalysis } from './ImageAnalysis';
import { DataCorrelation } from './DataCorrelation';
import { LegalDisclaimer } from './LegalDisclaimer';

type AnalysisTab = 'username' | 'image' | 'correlation' | 'legal';

export function SocialAnalysis() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('username');

  const tabs = [
    { id: 'username', label: 'Username Search', icon: FiSearch },
    { id: 'image', label: 'Image Analysis', icon: FiImage },
    { id: 'correlation', label: 'Data Correlation', icon: FiShare2 },
    { id: 'legal', label: 'Legal Guidelines', icon: FiInfo },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Social Analysis
        </h1>
        <div className="flex gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as AnalysisTab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300
                ${activeTab === id 
                  ? 'bg-[#ff0000] text-white shadow-lg shadow-[#ff0000]/20' 
                  : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60'}`}
            >
              <Icon className="text-lg" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6"
      >
        {activeTab === 'username' && <UsernameSearch />}
        {activeTab === 'image' && <ImageAnalysis />}
        {activeTab === 'correlation' && <DataCorrelation />}
        {activeTab === 'legal' && <LegalDisclaimer />}
      </motion.div>
    </div>
  );
}