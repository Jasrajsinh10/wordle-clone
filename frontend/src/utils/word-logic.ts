export type LetterState = 'absent' | 'present' | 'correct' | 'empty';

export interface GuessLetter {
  key: string;
  state: LetterState;
}

export const getLetterStates = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');
  const usedTarget = Array(5).fill(false);

  // First pass: Find correct letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
      usedTarget[i] = true;
    }
  }

  // Second pass: Find present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;

    for (let j = 0; j < 5; j++) {
      if (!usedTarget[j] && guessChars[i] === targetChars[j]) {
        result[i] = 'present';
        usedTarget[j] = true;
        break;
      }
    }
  }

  return result;
};
