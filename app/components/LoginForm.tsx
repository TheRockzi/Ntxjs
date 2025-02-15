'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUser, FiLock } from 'react-icons/fi';

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#141414] p-8 rounded-lg border border-white/10"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiShield className="text-[#ff0000] text-3xl" />
          <div>
            <h1 className="text-2xl font-semibold text-white">KaliumOSINT</h1>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-[#ff0000]/40"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#ff0000] text-white py-2 rounded-lg hover:bg-[#ff0000]/90 
                     transition-all font-medium shadow-lg shadow-[#ff0000]/20"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Default credentials: admin/admin
        </p>
      </motion.div>
    </div>
  );
}