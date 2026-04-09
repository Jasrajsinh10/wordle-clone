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

  const formatGuess = () => {
    if (!targetWord) return [];
    const states = getLetterStates(currentGuess.toUpperCase(), targetWord.toUpperCase());
    
    // Update used keys
    const newUsedKeys = { ...usedKeys };
    currentGuess.toUpperCase().split('').forEach((l, i) => {
      const currentState = states[i];
      const prevState = newUsedKeys[l];

      if (currentState === 'correct') {
        newUsedKeys[l] = 'correct';
      } else if (currentState === 'present' && prevState !== 'correct') {
        newUsedKeys[l] = 'present';
      } else if (currentState === 'absent' && prevState !== 'correct' && prevState !== 'present') {
        newUsedKeys[l] = 'absent';
      }
    });

    setUsedKeys(newUsedKeys);
    return states;
  };

  const addNewGuess = () => {
    if (!targetWord || turn > 5 || currentGuess.length !== 5) return;

    const guess = currentGuess.toUpperCase();

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
