// ════════════════════════════════════════════════════
// PULSE — TTS Toast Bar
// Floating control bar for Text-to-Speech playback
// Ported from app.js DOM-based approach
// ════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { Volume2, Pause, Play, X, SkipBack } from 'lucide-react';
import { cn } from '../../utils';

export type TTSBarStatus = 'idle' | 'speaking' | 'paused' | 'error';

interface TTSBarProps {
  status: TTSBarStatus;
  currentText: string;
  onPause: () => void;
  onCancel: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function TTSBar({ status, currentText, onPause, onCancel, collapsed, onToggle }: TTSBarProps) {
  const isActive = status === 'speaking' || status === 'paused';
  const isPaused = status === 'paused';
  const isError = status === 'error';

  if (!isActive && !isError) return null;

  const displayText = currentText.length > 60
    ? currentText.slice(0, 60) + '…'
    : currentText;

  return (
    <div
      id="ttsToast"
      className={cn(
        'tts-toast',
        isError && 'tts-toast-error'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="tts-toast-inner">
        {/* Icon */}
        <span className="tts-toast-icon">
          {isError ? '⚠️' : '🔊'}
        </span>

        {/* Info */}
        <span className="tts-toast-info" id="ttsInfo">
          {isError ? 'TTS error — please try again' : displayText}
        </span>

        {/* Controls */}
        <div className="tts-toast-controls">
          {isActive && !isError && (
            <button
              id="ttsPauseBtn"
              onClick={onPause}
              className="tts-toast-btn"
              aria-label={isPaused ? 'Resume' : 'Pause'}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}

          <button
            id="ttsCloseBtn"
            onClick={onCancel}
            className="tts-toast-btn tts-toast-close"
            aria-label="Stop"
            title="Stop"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
