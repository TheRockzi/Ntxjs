'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (credentials: { username: string; password: string }) => {
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setIsAuthenticated(true);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} key="login" />
      ) : (
        <Layout key="dashboard" />
      )}
    </AnimatePresence>
  );
}