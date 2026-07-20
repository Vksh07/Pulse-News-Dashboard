// ════════════════════════════════════════════════════
// PULSE — Text-to-Speech Hook
// Ported from app.js legacy TTS with voice selection,
// pause/resume/cancel controls, error handling, XP rewards
// ════════════════════════════════════════════════════

import { useCallback, useRef, useState, useEffect } from 'react';

export type TTSStatus = 'idle' | 'speaking' | 'paused' | 'error';

export interface TTSState {
  status: TTSStatus;
  currentText: string;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
}

export interface TTSParams {
  title: string;
  snippet?: string;
  onXP?: (amount: number) => void;
}

/**
 * useTTS — Robust Text-to-Speech hook with voice selection,
 * pause/resume/cancel, error handling, and XP integration.
 *
 * Ported and enhanced from app.js:speakArticle()
 */
export function useTTS() {
  const [state, setState] = useState<TTSState>({
    status: 'idle',
    currentText: '',
    voices: [],
    selectedVoiceURI: null,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevVoiceURIRef = useRef<string | null>(null);

  // Load voices (async on some browsers)
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const v = synth.getVoices().filter(v => v.lang.startsWith('en'));
      setState(s => ({ ...s, voices: v }));
      // Try to find Indian English voice
      const indianVoice = v.find(
        vo => vo.lang.startsWith('en') && (vo.name.includes('India') || vo.name.includes('Google') || vo.name.includes('UK'))
      );
      if (indianVoice) {
        setState(s => ({ ...s, selectedVoiceURI: indianVoice.voiceURI }));
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(({ title, snippet, onXP }: TTSParams) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setState(s => ({ ...s, status: 'error', currentText: title }));
      return;
    }

    // Cancel any ongoing speech first
    if (synth.speaking) synth.cancel();
    if (synth.paused) synth.resume();

    const text = `${title}. ${snippet || ''}`;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.0;
    u.volume = 1.0;

    // Apply preferred voice
    const { voices, selectedVoiceURI } = state;
    if (selectedVoiceURI) {
      const match = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (match) u.voice = match;
    } else {
      // Fallback: pick Indian/Google/UK
      const fallback = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('India') || v.name.includes('Google') || v.name.includes('UK'))
      );
      if (fallback) u.voice = fallback;
    }

    u.onstart = () => {
      setState(s => ({ ...s, status: 'speaking', currentText: title }));
    };

    u.onend = () => {
      setState(s => ({ ...s, status: 'idle', currentText: '' }));
      if (onXP) onXP(3);
    };

    u.onerror = (e) => {
      if ((e as SpeechSynthesisErrorEvent).error === 'canceled') {
        setState(s => ({ ...s, status: 'idle', currentText: '' }));
        return;
      }
      setState(s => ({ ...s, status: 'error', currentText: title }));
      // Reset to idle after error display
      setTimeout(() => setState(s => ({ ...s, status: 'idle' })), 2000);
    };

    u.onpause = () => {
      setState(s => ({ ...s, status: 'paused' }));
    };

    u.onresume = () => {
      setState(s => ({ ...s, status: 'speaking' }));
    };

    utteranceRef.current = u;
    synth.speak(u);
  }, [state.voices, state.selectedVoiceURI]);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth?.speaking && !synth.paused) {
      synth.pause();
    }
  }, []);

  const resume = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth?.paused) {
      synth.resume();
    }
  }, []);

  const cancel = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth) synth.cancel();
    setState(s => ({ ...s, status: 'idle', currentText: '' }));
  }, []);

  const togglePause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (synth.paused) {
      synth.resume();
    } else if (synth.speaking) {
      synth.pause();
    }
  }, []);

  const selectVoice = useCallback((voiceURI: string) => {
    setState(s => ({ ...s, selectedVoiceURI: voiceURI }));
  }, []);

  return {
    ...state,
    speak,
    pause,
    resume,
    cancel,
    togglePause,
    selectVoice,
    isActive: state.status === 'speaking' || state.status === 'paused',
  };
}
