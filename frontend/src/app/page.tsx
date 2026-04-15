'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Grid } from '@/components/GameBoard';
import { Keyboard } from '@/components/Keyboard';
import { useWordle } from '@/hooks/useWordle';
import { AuthForm } from '@/components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/utils/api';

export default function Home() {
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [message, setMessage] = useState('');

  // Fetch random word
  const fetchWord = async () => {
    const url = getApiUrl('/api/game/random-word/');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTargetWord(data.word.toUpperCase());
    } catch (err) {
      console.error(`Failed to fetch word from ${url}:`, err);
      // If you see a CORS error in the browser console, update CORS_ALLOWED_ORIGINS in Render.
      setTargetWord('APPLE'); // Fallback
    }
  };

  useEffect(() => {
    fetchWord();
    
    // Load guest stats from sessionStorage
    const savedStats = sessionStorage.getItem('wordle_guest_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse guest stats');
      }
    }

    // Check if user is logged in (via cookie-based profile check)
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(getApiUrl('/users/me/'), {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setStats({ wins: data.wins, losses: data.losses });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const { turn, currentGuess, guesses, isCorrect, usedKeys, status, handleKeyup } = useWordle(targetWord || '');

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup]);

  useEffect(() => {
    if (status !== 'playing' && targetWord) {
      updateStats(status === 'won');
      setMessage(status === 'won' ? 'Splendid!' : `The word was ${targetWord}`);
      
      // Auto-open stats modal after a short delay
      const timer = setTimeout(() => {
        setIsStatsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, targetWord]);

  const updateStats = async (won: boolean) => {
    if (user) {
      try {
        const res = await fetch(getApiUrl('/users/update-stats/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result: won ? 'win' : 'loss' }),
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setStats({ wins: data.wins, losses: data.losses });
        }
      } catch (err) {
        console.error('Failed to update stats');
      }
    } else {
      // Guest stats
      const newStats = {
        wins: stats.wins + (won ? 1 : 0),
        losses: stats.losses + (won ? 0 : 1)
      };
      setStats(newStats);
      sessionStorage.setItem('wordle_guest_stats', JSON.stringify(newStats));
    }
  };

  const onLoginSuccess = (data: any) => {
    fetchProfile();
    setIsAuthOpen(false);
  };

  const onLogout = async () => {
    try {
      // Clear session/cookies (ideally calling a backend logout endpoint if needed)
      // For now we just reset local state
      setUser(null);
      setStats({ wins: 0, losses: 0 });
      sessionStorage.removeItem('wordle_guest_stats');
    } catch (e) {}
  };

  const totalGames = stats.wins + stats.losses;
  const winPercent = totalGames === 0 ? 0 : Math.round((stats.wins / totalGames) * 100);

  return (
    <main className="min-h-screen bg-brand-dark overflow-x-hidden flex flex-col">
      <Navbar 
        onOpenStats={() => setIsStatsOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        {targetWord ? (
          <>
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} target={targetWord} />
            <div className="flex-1" />
            <Keyboard usedKeys={usedKeys} onKey={(key) => handleKeyup({ key })} />
          </>
        ) : (
          <div className="animate-pulse text-brand-gray">Loading Wordle...</div>
        )}
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            key="message-modal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded font-bold z-[100]"
          >
            {message}
          </motion.div>
        )}

        {isAuthOpen && (
          <div key="auth-modal" className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
            <AuthForm onSuccess={onLoginSuccess} onClose={() => setIsAuthOpen(false)} />
          </div>
        )}

        {isStatsOpen && (
          <div 
            key="stats-modal"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
            onClick={() => setIsStatsOpen(false)}
          >
            <div 
              className="bg-brand-dark p-8 rounded-xl border border-brand-gray w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-6 text-center uppercase tracking-widest">Statistics</h2>
              <div className="flex justify-around mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalGames}</div>
                  <div className="text-[10px] uppercase text-brand-gray">Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{winPercent}</div>
                  <div className="text-[10px] uppercase text-brand-gray">Win %</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.wins}</div>
                  <div className="text-[10px] uppercase text-brand-gray">Wins</div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-brand-green hover:bg-green-600 font-bold py-3 rounded uppercase transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
