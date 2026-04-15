'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLetterStates, LetterState } from '../utils/word-logic';

export const useWordle = (targetWord: string | null) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<(string | null)[]>(Array(6).fill(null));
  const [history, setHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: LetterState }>({});
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const addNewGuess = () => {
    if (!targetWord || turn > 5 || currentGuess.length !== 5) return;

    const guess = currentGuess.toUpperCase();
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

    if (turn === 5 && guess !== targetWord.toUpperCase()) {
      setStatus('lost');
    }
  };

  const handleKeyup = useCallback(({ key }: { key: string }) => {
    if (status !== 'playing') return;

    if (key === 'Enter') {
      if (turn > 5) return;
      if (history.includes(currentGuess.toUpperCase())) return;
      if (currentGuess.length !== 5) return;
      addNewGuess();
    }

    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  }, [currentGuess, turn, history, status, targetWord]);

  return { turn, currentGuess, guesses, isCorrect, usedKeys, status, handleKeyup };
};
