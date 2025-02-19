import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiImage, FiMapPin, FiCalendar, FiLink, FiAlertCircle } from 'react-icons/fi';
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
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center
                   hover:border-[#ff0000]/40 transition-all duration-300 cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-400">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports JPG, PNG, and WEBP formats
          </p>
        </label>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
          <FiAlertCircle className="text-red-500" />
          <span className="text-red-500">{error}</span>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <FiImage className="mx-auto text-4xl text-[#00e5ff] animate-pulse mb-4" />
          <p className="text-gray-400">Analyzing image...</p>
        </div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* EXIF Data */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">EXIF Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              {results.exif?.dateTaken && (
                <div className="flex items-center gap-2 text-gray-400">
                  <FiCalendar className="text-[#00e5ff]" />
                  <span>Taken: {results.exif.dateTaken}</span>
                </div>
              )}
              {results.exif?.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <FiMapPin className="text-[#00e5ff]" />
                  <span>Location: {results.exif.location}</span>
                </div>
              )}
              {/* Add more EXIF data fields */}
            </div>
          </div>

          {/* Reverse Image Search Results */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Found On</h3>
            <div className="space-y-4">
              {results.reverseSearch?.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-black/20 rounded-lg"
                >
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-white font-medium">{result.title}</h4>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#00e5ff] hover:underline flex items-center gap-1"
                    >
                      <FiLink />
                      <span>{result.domain}</span>
                    </a>
                    <p className="text-sm text-gray-400 mt-1">
                      Found: {result.dateFound}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}