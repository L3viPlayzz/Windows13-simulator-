import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, User } from 'lucide-react';
import { PinLock } from './PinLock';
import { PasswordLock } from './PasswordLock';
import { WindowsHello } from './WindowsHello';

interface AuthSelectorProps {
  onUnlock: () => void;
  isOwner: boolean; // true = jouw account
}

export function AuthSelector({ onUnlock, isOwner }: AuthSelectorProps) {
  const [selectedAuth, setSelectedAuth] = useState<'choose' | 'pin' | 'password' | 'hello' | 'guest'>('choose');

  // --- Guest view ---
  if (!isOwner) {
    if (selectedAuth === 'guest') {
      onUnlock(); // automatisch unlock voor guest
      return null;
    }

    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedAuth('guest')}
          className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl
                     bg-gradient-to-br from-gray-500/20 to-gray-700/20
                     border-2 border-gray-400/50 hover:border-gray-300
                     hover:bg-gradient-to-br hover:from-gray-500/30 hover:to-gray-700/30
                     transition-all shadow-lg"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">Guest</p>
            <p className="text-gray-300 text-xs mt-1">Login as guest</p>
          </div>
        </motion.button>
      </div>
    );
  }

  // --- Owner view ---
  if (selectedAuth === 'pin') return <PinLock onUnlock={onUnlock} correctPin="110911" />;
  if (selectedAuth === 'password') return <PasswordLock onUnlock={onUnlock} correctPassword="Levi20111028!" />;
  if (selectedAuth === 'hello') return <WindowsHello onUnlock={onUnlock} onBack={() => setSelectedAuth('choose')} />;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Windows 13</h1>
          <p className="text-cyan-300 text-sm">Choose login method</p>
        </motion.div>

        <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
          {/* Windows Hello */}
          <motion.button onClick={() => setSelectedAuth('hello')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/50 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-emerald-500/30 hover:to-green-500/30 transition-all shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Windows Hello</p>
              <p className="text-emerald-300 text-xs mt-1">Face recognition</p>
            </div>
          </motion.button>

          {/* PIN */}
          <motion.button onClick={() => setSelectedAuth('pin')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-pink-500/30 transition-all shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">PIN Code</p>
              <p className="text-purple-300 text-xs mt-1">Enter 6-digit code</p>
            </div>
          </motion.button>

          {/* Password */}
          <motion.button onClick={() => setSelectedAuth('password')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-cyan-500/30 transition-all shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Password</p>
              <p className="text-blue-300 text-xs mt-1">Enter password</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
