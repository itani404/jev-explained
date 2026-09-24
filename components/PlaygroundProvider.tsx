'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { QuestionType } from '@/lib/types';

type PlaygroundState = {
  enabled: boolean;
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
  tryType: (type: QuestionType) => void;
};

const PlaygroundContext = createContext<PlaygroundState | null>(null);

export function PlaygroundProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const [questionType, setQuestionType] = useState<QuestionType>('choice');

  function tryType(type: QuestionType) {
    setQuestionType(type);
    document.getElementById('try')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <PlaygroundContext value={{ enabled, questionType, setQuestionType, tryType }}>
      {children}
    </PlaygroundContext>
  );
}

export function usePlayground(): PlaygroundState {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) throw new Error('usePlayground must be used inside <PlaygroundProvider>');
  return ctx;
}
