import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';
import bcrypt from 'bcryptjs';

interface PinLockProps {
  onUnlock: () => void;
}

// Hier zet je de hash van je PIN (bijvoorbeeld 110911)
const HASHED_PIN = '$2a$10$VhJXl/1ZqJx1Fq6VnU0VYOe6q/8xL7dYQnR8aDkG5K8c6QzS4e8rC';

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(true);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    const match = await bcrypt.compare(pin, HASHED_PIN);
    if (match) {
      setLocked(false);
      setTimeout(() => onUnlock(), 600);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  useEffect(() => {
    if (pin.length === 6) {
      setTimeout(handleSubmit, 100);
    }
  }, [pin]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length === 6) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pin]);

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
      {/* Rest van je UI blijft hetzelfde */}
      {/* PIN Display, Keypad, Error message */}
    </div>
  );
}
