// ════════════════════════════════════════════════════
// PULSE — ADHD-Friendly Keyboard Navigation
// Quick actions, focus management, skip links, hotkeys
// ════════════════════════════════════════════════════

import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../store';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(actions: ShortcutAction[]) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape to blur
      if (e.key === 'Escape') {
        target.blur();
      }
      return;
    }

    for (const action of actions) {
      const matches =
        e.key.toLowerCase() === action.key.toLowerCase() &&
        (!action.ctrl || e.ctrlKey) &&
        (!action.shift || e.shiftKey) &&
        (!action.alt || e.altKey) &&
        (!action.meta || e.metaKey);

      if (matches) {
        if (action.preventDefault !== false) e.preventDefault();
        action.action();
        break;
      }
    }
  }, [actions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useFocusTrap(enabled: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    previousFocusRef.current = document.activeElement as HTMLElement;

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    return () => {
      container.removeEventListener('keydown', handleTab);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [enabled]);

  return containerRef;
}

// Skip link is a component, not a hook - exported separately
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:rounded-lg focus:font-semibold"
    >
      Skip to main content
    </a>
  );
}

export function useGlobalHotkeys() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentPage, focusMode, toggleShield, focusShield, toggleBookmarks, toggleSocial, toggleFeed, togglePomodoro } = useUIStore();

  // Quick navigation
  const goDashboard = useCallback(() => navigate('/'), [navigate]);
  const goUPSC = useCallback(() => navigate('/upsc'), [navigate]);
  const goCSAT = useCallback(() => navigate('/csat'), [navigate]);
  const goPsychology = useCallback(() => navigate('/psychology'), [navigate]);
  const goHealth = useCallback(() => navigate('/health'), [navigate]);
  const goCommand = useCallback(() => navigate('/command'), [navigate]);
  const goResearch = useCallback(() => navigate('/research'), [navigate]);
  const goFinance = useCallback(() => navigate('/finance'), [navigate]);
  const goSettings = useCallback(() => navigate('/settings'), [navigate]);
  const goCrisis = useCallback(() => navigate('/crisis'), [navigate]);

  const actions: ShortcutAction[] = [
    // Navigation shortcuts (Ctrl+1-9, 0 for settings)
    { key: '1', ctrl: true, description: 'Dashboard', action: goDashboard },
    { key: '2', ctrl: true, description: 'UPSC Lens', action: goUPSC },
    { key: '3', ctrl: true, description: 'CSAT Practice', action: goCSAT },
    { key: '4', ctrl: true, description: 'Psychology', action: goPsychology },
    { key: '5', ctrl: true, description: 'Health Pulse', action: goHealth },
    { key: '6', ctrl: true, description: 'Command HQ', action: goCommand },
    { key: '7', ctrl: true, description: 'Research', action: goResearch },
    { key: '8', ctrl: true, description: 'Finance', action: goFinance },
    { key: '9', ctrl: true, description: 'Social Pulse', action: () => navigate('/social') },
    { key: '0', ctrl: true, description: 'Settings', action: goSettings },

    // Focus & shield
    { key: 'f', ctrl: true, description: 'Toggle Focus Mode', action: () => setCurrentPage(location.pathname) },
    { key: 's', ctrl: true, description: 'Toggle Focus Shield', action: toggleShield },

    // Quick actions
    { key: 'b', ctrl: true, description: 'Bookmarks Panel', action: toggleBookmarks },
    { key: 'k', ctrl: true, description: 'Social Panel', action: toggleSocial },
    { key: 'f', meta: true, description: 'Feed Panel', action: toggleFeed },
    { key: 'p', ctrl: true, description: 'Pomodoro', action: togglePomodoro },

    // Crisis
    { key: 'c', ctrl: true, shift: true, description: 'Crisis Mode', action: goCrisis },

    // Escape to close modals/panels
    { key: 'Escape', description: 'Close panels / blur inputs', action: () => {
      document.activeElement?.blur();
    } },

    // Refresh
    { key: 'r', ctrl: true, description: 'Refresh feed', action: () => window.location.reload() },
  ];

  useKeyboardShortcuts(actions);

  // Return help text for a help dialog
  return actions.map(a => ({
    keys: [a.ctrl && 'Ctrl', a.shift && 'Shift', a.alt && 'Alt', a.meta && '⌘', a.key.toUpperCase()].filter(Boolean).join(' + '),
    description: a.description,
  }));
}

// Help dialog component (not a hook)
export function KeyboardShortcutsHelp() {
  const shortcuts = useGlobalHotkeys();

  return (
    <dialog className="dialog max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">Keyboard Shortcuts</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-800/50">
            <span className="text-slate-400">{s.description}</span>
            <kbd className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-yellow-400 border border-slate-700">{s.keys}</kbd>
          </div>
        ))}
      </div>
      <button onClick={() => document.querySelector('dialog')?.close()} className="btn-primary w-full mt-4">Close</button>
    </dialog>
  );
}