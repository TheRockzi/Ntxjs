import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiImage, FiMapPin, FiCalendar, FiLink, FiAlertCircle, FiCamera, FiSettings } from 'react-icons/fi';
import type { ImageAnalysisResult } from '@/app/lib/types';

export function ImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await analyzeImage(file);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await analyzeImage(file);
  }, []);

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/social/image-analysis', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Analysis failed');

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
          className="inline-flex items-center justify-center p-3 rounded-full bg-[#00e5ff]/10 mb-4"
        >
          <FiCamera className="text-3xl text-[#00e5ff]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Image Intelligence</h2>
        <p className="text-gray-400">Analyze image metadata and perform reverse searches</p>
      </div>

      {/* Upload Area */}
      <div className="max-w-3xl mx-auto">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff]/20 to-[#ff0000]/20 rounded-2xl blur-xl opacity-0 
                        group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative border-3 border-dashed border-white/10 rounded-2xl p-12 text-center
                       group-hover:border-[#00e5ff]/40 transition-all duration-300 bg-black/40 backdrop-blur-xl">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <FiUpload className="mx-auto text-5xl text-[#00e5ff] mb-6 
                                group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white mb-2">Drop your image here</h3>
              <p className="text-gray-400 mb-4">
                or click to select a file for analysis
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, and WEBP formats
              </p>
            </label>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <FiAlertCircle className="text-xl text-red-500" />
            <span className="text-red-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isAnalyzing && (
        <div className="text-center py-12">
          <FiImage className="mx-auto text-5xl text-[#00e5ff] animate-pulse mb-4" />
          <p className="text-xl font-semibold text-white mb-2">Analyzing image...</p>
          <p className="text-gray-400">Extracting metadata and performing reverse search</p>
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-5xl mx-auto"
        >
          {/* EXIF Data */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                       hover:border-white/20 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#00e5ff]/10">
                <FiSettings className="text-2xl text-[#00e5ff]" />
              </div>
              <h3 className="text-xl font-semibold text-white">EXIF Metadata</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.exif?.dateTaken && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/5
                              group-hover:border-white/10 transition-all duration-300">
                  <FiCalendar className="text-xl text-[#00e5ff]" />
                  <div>
                    <p className="text-sm text-gray-400">Date Taken</p>
                    <p className="text-white">{results.exif.dateTaken}</p>
                  </div>
                </div>
              )}
              
              {results.exif?.location && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/5
                              group-hover:border-white/10 transition-all duration-300">
                  <FiMapPin className="text-xl text-[#00e5ff]" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{results.exif.location}</p>
                  </div>
                </div>
              )}

              {results.exif?.camera && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-black/40 border border-white/5
                              group-hover:border-white/10 transition-all duration-300">
                  <FiCamera className="text-xl text-[#00e5ff]" />
                  <div>
                    <p className="text-sm text-gray-400">Camera</p>
                    <p className="text-white">{results.exif.camera}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reverse Image Search Results */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8
                       hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#ff0000]/10">
                <FiImage className="text-2xl text-[#ff0000]" />
              </div>
              <h3 className="text-xl font-semibold text-white">Image Matches</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.reverseSearch?.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6 p-6 bg-black/40 rounded-xl border border-white/5
                           hover:border-white/20 transition-all duration-300 group"
                >
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border border-white/10
                             group-hover:border-white/20 transition-all duration-300"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white mb-2 group-hover:text-[#00e5ff] transition-colors">
                      {result.title}
                    </h4>
                    <div className="flex items-center gap-4 mb-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#00e5ff] hover:underline"
                      >
                        <FiLink />
                        <span>{result.domain}</span>
                      </a>
                      <span className="text-sm text-gray-400">
                        Found: {result.dateFound}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}