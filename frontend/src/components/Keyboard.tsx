'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

interface KeyboardProps {
  usedKeys: { [key: string]: 'absent' | 'present' | 'correct' | 'empty' };
  onKey: (key: string) => void;
}

export const Keyboard = ({ usedKeys, onKey }: KeyboardProps) => {
  return (
    <div className="mt-8 px-2 max-w-2xl mx-auto">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 mb-2">
          {row.map((key) => {
            const state = usedKeys[key];
            const isControl = key === 'ENTER' || key === 'BACKSPACE';
            
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={cn(
                  "key text-sm md:text-base",
                  isControl ? "px-4" : "flex-1 max-w-[45px]",
                  state === 'correct' && "key-correct",
                  state === 'present' && "key-present",
                  state === 'absent' && "key-absent"
                )}
              >
                {key === 'BACKSPACE' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-5.91a2.25 2.25 0 010-3.318l6.375-5.91a2.25 2.25 0 013.074 0l9.74 9.032a2.25 2.25 0 010 3.318l-9.74 9.032a2.25 2.25 0 01-3.074 0z" />
                  </svg>
                ) : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
