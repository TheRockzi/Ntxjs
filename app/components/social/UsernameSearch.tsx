import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiGlobe, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi';
import type { SocialProfile } from '@/app/lib/types';

export function UsernameSearch() {
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(`/api/social/username?q=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Search failed');
      
      setProfiles(data.profiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 rounded-full bg-[#ff0000]/10 mb-4"
        >
          <FiUsers className="text-3xl text-[#ff0000]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Username Intelligence</h2>
        <p className="text-gray-400">Track digital footprints across multiple platforms</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/20 to-[#00e5ff]/20 blur-xl opacity-20"></div>
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-xl text-gray-500 transition-colors group-focus-within:text-[#ff0000]" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to search"
              className="w-full bg-black/40 backdrop-blur-xl border-2 border-white/10 rounded-2xl pl-12 pr-32 py-4 text-lg text-white
                       placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all
                       hover:border-white/20 shadow-lg shadow-black/20"
            />
            <button
              type="submit"
              disabled={isSearching || !username}
              className="absolute right-3 top-3 bg-gradient-to-r from-[#ff0000] to-[#ff0000]/80 text-white px-6 py-2 rounded-xl
                       hover:from-[#ff0000]/90 hover:to-[#ff0000]/70 transition-all duration-300 font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff0000]/20
                       hover:shadow-xl hover:shadow-[#ff0000]/30 disabled:hover:shadow-none"
            >
              <div className="flex items-center gap-2">
                <FiSearch className={`text-lg ${isSearching ? 'animate-spin' : ''}`} />
                <span>Search</span>
              </div>
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <FiAlertCircle className="text-xl text-red-500" />
            <span className="text-red-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000]/20 to-[#00e5ff]/20 rounded-xl blur-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Card Content */}
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6
                          group-hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      className="w-12 h-12 rounded-xl bg-black/40 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black
                                  group-hover:scale-110 transition-transform duration-300"
                         style={{
                           backgroundColor: profile.status === 'active' ? '#10b981' :
                                          profile.status === 'inactive' ? '#f59e0b' : '#ef4444'
                         }}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#ff0000] transition-colors">
                      {profile.username}
                    </h3>
                    <p className="text-sm text-gray-400">{profile.platform}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.status === 'active' ? 'bg-green-500/20 text-green-500' :
                  profile.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {profile.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400 group/link
                              hover:text-[#00e5ff] transition-colors">
                  <FiGlobe className="text-[#00e5ff]" />
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" 
                     className="truncate hover:underline">
                    {profile.url}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FiClock className="text-[#00e5ff]" />
                  <span>Last active: {profile.lastActive}</span>
                </div>
              </div>

              {profile.connections && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <FiUsers className="text-[#00e5ff]" />
                    <span className="text-gray-400">
                      Connected to <span className="text-white font-medium">{profile.connections}</span> profiles
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}