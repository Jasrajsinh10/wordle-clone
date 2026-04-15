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
                  "key text-sm md:text-base transition-all",
                  isControl ? "flex-[1.5]" : "flex-1",
                  "max-w-[65px] h-[58px]",
                  state === 'correct' && "key-correct",
                  state === 'present' && "key-present",
                  state === 'absent' && "key-absent"
                )}
              >
                {key === 'BACKSPACE' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
                  </svg>
                ) : (
                  <span className="font-bold tracking-tighter">{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
