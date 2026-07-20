// ════════════════════════════════════════════════════
// PULSE — TTS Context
// Provides TTS state to the entire app via React Context
// ════════════════════════════════════════════════════

import React, { createContext, ReactNode } from 'react';
import { useTTS, TTSParams, TTSStatus } from '../../hooks/useTTS';

export interface TTSContextValue {
  status: TTSStatus;
  currentText: string;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  speak: (params: TTSParams) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  togglePause: () => void;
  selectVoice: (voiceURI: string) => void;
  isActive: boolean;
}

export const TTSContext = createContext<TTSContextValue | null>(null);

interface TTSProviderProps {
  children: ReactNode;
}

export function TTSProvider({ children }: TTSProviderProps) {
  const tts = useTTS();
  return (
    <TTSContext.Provider value={tts}>
      {children}
    </TTSContext.Provider>
  );
}
