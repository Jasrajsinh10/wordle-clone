'use client';

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TileProps {
  letter?: string;
  state?: 'absent' | 'present' | 'correct' | 'empty';
  index?: number;
}

export const Tile = ({ letter, state = 'empty', index = 0 }: TileProps) => {
  const variants = {
    pop: { scale: [1, 1.1, 1], transition: { duration: 0.1 } },
    flip: { 
      rotateX: [0, 90, 0], 
      transition: { duration: 0.4, delay: index * 0.1 } 
    }
  };

  return (
    <motion.div
      variants={variants}
      animate={letter && state === 'empty' ? 'pop' : (state !== 'empty' ? 'flip' : '')}
      className={cn(
        "tile",
        state === 'empty' && !letter && "tile-empty",
        state === 'empty' && letter && "tile-active",
        state === 'correct' && "tile-correct",
        state === 'present' && "tile-present",
        state === 'absent' && "tile-absent"
      )}
    >
      {letter}
    </motion.div>
  );
};

interface RowProps {
  guess?: string | null;
  currentGuess?: string;
  target?: string;
}

export const Row = ({ guess, currentGuess, target }: RowProps) => {
  if (guess) {
    const letters = guess.split('');
    const states = target ? require('../utils/word-logic').getLetterStates(guess, target) : Array(5).fill('absent');
    
    return (
      <div className="flex gap-1.5 mb-1.5 justify-center">
        {letters.map((l, i) => (
          <Tile key={i} letter={l} state={states[i]} index={i} />
        ))}
      </div>
    );
  }

  if (currentGuess !== undefined) {
    const letters = currentGuess.split('');
    return (
      <div className="flex gap-1.5 mb-1.5 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Tile key={i} letter={letters[i]} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 mb-1.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
};

export const Grid = ({ guesses, currentGuess, turn, target }: { guesses: (string | null)[], currentGuess: string, turn: number, target: string }) => {
  return (
    <div className="pt-8">
      {guesses.map((guess, i) => {
        if (turn === i) {
          return <Row key={i} currentGuess={currentGuess} />;
        }
        return <Row key={i} guess={guess} target={target} />;
      })}
    </div>
  );
};
