import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, User } from 'lucide-react';
import { PinLock } from './PinLock';
import { PasswordLock } from './PasswordLock';
import { WindowsHello } from './WindowsHello';

export function AuthSelector({ onUnlock }: { onUnlock: () => void }) {
  const [selectedAuth, setSelectedAuth] = useState<'choose' | 'pin' | 'password' | 'hello' | 'guest'>('choose');
  const [isOwner, setIsOwner] = useState(false);

  // Check ownership bij load
  useEffect(() => {
    const owner = localStorage.getItem('owner_device') === 'true';
    setIsOwner(owner);
    if (!owner) {
      setSelectedAuth('guest');
    }
  }, []);

  // --- Guest mode ---
  if (!isOwner && selectedAuth === 'guest') {
    onUnlock(); // automatische unlock voor guest
    return null;
  }

  // --- Owner mode ---
  if (isOwner) {
    if (selectedAuth === 'pin') return <PinLock onUnlock={onUnlock} correctPin="110911" />;
    if (selectedAuth === 'password') return <PasswordLock onUnlock={onUnlock} correctPassword="Levi20111028!" />;
    if (selectedAuth === 'hello') return <WindowsHello onUnlock={onUnlock} onBack={() => setSelectedAuth('choose')} />;
  }

  // --- Auth keuze scherm ---
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Windows 13</h1>
          <p className="text-cyan-300 text-sm">{isOwner ? 'Choose login method' : 'Guest mode active'}</p>
        </motion.div>

        {isOwner && (
          <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
            {/* Windows Hello */}
            <AuthButton label="Windows Hello" subtitle="Face recognition" icon={<User className="w-8 h-8 text-white" />} onClick={() => setSelectedAuth('hello')} colors={['emerald', 'green']} />
            
            {/* PIN */}
            <AuthButton label="PIN Code" subtitle="Enter 6-digit code" icon={<Lock className="w-8 h-8 text-white" />} onClick={() => setSelectedAuth('pin')} colors={['purple', 'pink']} />
            
            {/* Password */}
            <AuthButton label="Password" subtitle="Enter password" icon={<KeyRound className="w-8 h-8 text-white" />} onClick={() => setSelectedAuth('password')} colors={['blue', 'cyan']} />
          </div>
        )}

        {!isOwner && (
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
        )}
      </div>
    </div>
  );
}

// Helper component voor auth buttons
function AuthButton({ label, subtitle, icon, onClick, colors }: { label: string; subtitle: string; icon: JSX.Element; onClick: () => void; colors: string[] }) {
  const [from, to] = colors;
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex flex-col items-center gap-4 px-8 py-8 rounded-2xl bg-gradient-to-br from-${from}-500/20 to-${to}-500/20 border-2 border-${from}-400/50 hover:border-${from}-300 hover:bg-gradient-to-br hover:from-${from}-500/30 hover:to-${to}-500/30 transition-all shadow-lg`}>
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${from}-400 to-${to}-400 flex items-center justify-center`}>{icon}</div>
      <div className="text-center">
        <p className="text-white font-semibold">{label}</p>
        <p className={`text-${from}-300 text-xs mt-1`}>{subtitle}</p>
      </div>
    </motion.button>
  );
}
