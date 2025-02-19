import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiGlobe, FiClock, FiAlertCircle } from 'react-icons/fi';
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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <FiUser className="absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username to search"
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white
                     placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40 transition-all"
          />
          <button
            type="submit"
            disabled={isSearching || !username}
            className="absolute right-2 top-2 bg-[#ff0000] text-white px-4 py-2 rounded-lg
                     hover:bg-[#ff0000]/90 transition-all duration-300 disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            <FiSearch className={`text-lg ${isSearching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
          <FiAlertCircle className="text-red-500" />
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-white/20
                     transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-10 h-10 rounded-full bg-black/40"
                />
                <div>
                  <h3 className="font-medium text-white">{profile.username}</h3>
                  <p className="text-sm text-gray-400">{profile.platform}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                profile.status === 'active' ? 'bg-green-500/20 text-green-500' :
                profile.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {profile.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiGlobe className="text-[#00e5ff]" />
                <span>{profile.url}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiClock className="text-[#00e5ff]" />
                <span>Last active: {profile.lastActive}</span>
              </div>
            </div>

            {profile.connections && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  Connected to {profile.connections} other profiles
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}