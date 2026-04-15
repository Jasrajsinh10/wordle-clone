'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLetterStates, LetterState } from '../utils/word-logic';
import { getApiUrl } from '../utils/api';

export const useWordle = (targetWord: string | null) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<(string | null)[]>(Array(6).fill(null));
  const [history, setHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: LetterState }>({});
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const validateAndAddGuess = useCallback(async () => {
    if (!targetWord || turn > 5 || currentGuess.length !== 5 || isProcessing) return;
    
    setIsProcessing(true);
    const guess = currentGuess.toUpperCase();
    
    try {
      const res = await fetch(getApiUrl('/game/validate-word/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: guess })
      });
      const data = await res.json();
      
      if (!data.is_valid) {
        setMessage('Not in word list');
        setTimeout(() => setMessage(''), 2000);
        setIsProcessing(false);
        return;
      }
    } catch (err) {
      console.error('Validation failed', err);
      // Fallback: allow if validation fails for network reasons
    }

    const states = getLetterStates(guess, targetWord.toUpperCase());

    // Update used keys
    setUsedKeys((prev) => {
      const newUsedKeys = { ...prev };
      guess.split('').forEach((char, i) => {
        const letterState = states[i];
        const prevState = newUsedKeys[char];

        if (letterState === 'correct') {
          newUsedKeys[char] = 'correct';
        } else if (letterState === 'present' && prevState !== 'correct') {
          newUsedKeys[char] = 'present';
        } else if (letterState === 'absent' && prevState !== 'correct' && prevState !== 'present') {
          newUsedKeys[char] = 'absent';
        }
      });
      return newUsedKeys;
    });

    if (guess === targetWord.toUpperCase()) {
      setIsCorrect(true);
      setStatus('won');
    }

    setGuesses((prev) => {
      const newGuesses = [...prev];
      newGuesses[turn] = guess;
      return newGuesses;
    });

    setHistory((prev) => [...prev, guess]);
    setTurn((prev) => prev + 1);
    setCurrentGuess('');
    setIsProcessing(false);

    if (turn === 5 && guess !== targetWord.toUpperCase()) {
      setStatus('lost');
    }
  }, [currentGuess, turn, targetWord, isProcessing, history]);

  const handleKeyup = useCallback(({ key }: { key: string }) => {
    if (status !== 'playing' || isProcessing) return;

    const k = key.toUpperCase();

    if (k === 'ENTER') {
      if (turn > 5) return;
      if (history.includes(currentGuess.toUpperCase())) return;
      if (currentGuess.length !== 5) return;
      validateAndAddGuess();
    }

    if (k === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(k)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + k);
      }
    }
  }, [currentGuess, turn, history, status, isProcessing, validateAndAddGuess]);

  return { turn, currentGuess, guesses, isCorrect, usedKeys, status, message, handleKeyup };
};
