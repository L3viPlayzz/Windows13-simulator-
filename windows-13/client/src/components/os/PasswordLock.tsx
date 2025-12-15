import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';

interface PasswordLockProps {
  onUnlock: () => void;
}

// Hier zet je de hash van je wachtwoord (bijvoorbeeld "Levi20111028!")
const HASHED_PASSWORD = '$2a$10$5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vYZ5vY';

export function PasswordLock({ onUnlock }: PasswordLockProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const match = await bcrypt.compare(password, HASHED_PASSWORD);
      if (match) {
        setLocked(false);
        setTimeout(() => onUnlock(), 600);
      } else {
        setError(true);
        setPassword('');
        setTimeout(() => setError(false), 1000);
      }
    } catch (e) {
      console.error('Error checking password:', e);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [password]);

  if (!locked) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black z-[10000] pointer-events-none"
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-[10000] overflow-hidden">
      <motion.div className="relative z-10 flex flex-col items-center gap-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-400/50 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2 font-display">Windows 13</h1>
        <p className="text-blue-300 text-sm">Enter your password to continue</p>

        <div className="w-80 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-blue-400/50'
            }`}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 w-80"
        >
          Sign In
        </button>

        {error && <p className="text-red-400 text-sm mt-2">Incorrect password</p>}
      </motion.div>
    </div>
  );
}
