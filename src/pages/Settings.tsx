import React, { useState } from 'react';
import { useUIStore } from '../store';
import {
  Moon,
  Sun,
  FontSizes,
  TextCursorInput,
  AlertTriangle,
  Clock,
  Check,
  Loader2,
  Activity,
  Zap,
} from 'lucide-react';

export function Settings() {
  const {
    theme,
    fontSize,
    readingSpeed,
    autoRefresh,
    refreshInterval,
    language,
    pomodoroPanelOpen,
    tutorPanelOpen,
    focusMode,
    upscLens,
    energyMode,
    setPreferences,
  } = useUIStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPreferences({
        theme,
        fontSize,
        readingSpeed,
        autoRefresh,
        refreshInterval: Number(refreshInterval),
        language,
        pomodoroPanelOpen,
        tutorPanelOpen,
        focusMode,
        upscLens,
        energyMode,
      });
      // Apply theme to document root
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      alert('Settings saved!');
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Settings ⚙️
        </h1>

        <form className="space-y-6" onSubmit={handleSave}>
          {/* Theme */}
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">Theme</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreferences({ theme: 'dark' })}
                className={`flex-1 px-4 py-2 rounded ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Moon className="w-5 h-5" /> Dark
              </button>
              <button
                onClick={() => setPreferences({ theme: 'light' })}
                className={`flex-1 px-4 py-2 rounded ${theme === 'light' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Sun className="w-5 h-5" /> Light
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">Base Font Size</label>
            <div className="flex flex-wrap gap-2">
              {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
                <button
                  key={size}
                  onClick={() => setPreferences({ fontSize: size })}
                  className={`px-3 py-1.5 rounded ${fontSize === size ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Speed */}
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">Reading Speed (WPM)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={50}
                max={500}
                step={5}
                value={readingSpeed}
                onChange={(e) => setPreferences({ readingSpeed: Number(e.target.value) })}
                className="w-20 px-2 py-1 rounded border border-slate-600 bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <span className="text-slate-400">wpm</span>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setPreferences({ language: e.target.value as string })}
              className="border rounded px-3 py-1.5 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 w-24"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>
          </div>

          {/* Auto-refresh */}
          <div className="space-y-4">
            <label className="block text-slate-300 font-medium">Auto-refresh</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setPreferences({ autoRefresh: e.target.checked })}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-slate-300">Enable auto-refresh</span>
              </label>
              {autoRefresh && (
                <>
                  <input
                    type="number"
                    min={10000}
                    max={600000}
                    step={10000}
                    value={refreshInterval}
                    onChange={(e) => setPreferences({ refreshInterval: Number(e.target.value) })}
                    className={`w-24 px-2 py-1 rounded border border-slate-600 bg-slate-900 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${!autoRefresh ? 'opacity-50' : ''}`}
                  />
                  <span className="text-slate-400">ms</span>
                </>
              )}
            </div>
          </div>

          {/* Advanced toggle */}
          <div className="space-y-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-left flex items-center justify-between text-slate-400 hover:text-white"
            >
              <span>Toggle Advanced Options</span>
              <span className="ml-2">{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Pomodoro Panel</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pomodoroPanelOpen}
                        onChange={(e) => setPreferences({ pomodoroPanelOpen: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-slate-300">Open pomodoro panel by default</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tutor Panel</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tutorPanelOpen}
                        onChange={(e) => setPreferences({ tutorPanelOpen: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-slate-300">Open tutor panel by default</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Focus Mode</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={focusMode}
                        onChange={(e) => setPreferences({ focusMode: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-slate-300">Enable focus mode by default</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">UPSC Lens</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={upscLens}
                        onChange={(e) => setPreferences({ upscLens: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-slate-300">Start with UPSC Lens enabled</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Energy Mode</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={energyMode}
                        onChange={(e) => setPreferences({ energyMode: e.target.checked })}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-slate-300">Enable energy-aware features</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${isSaving
                  ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}
              `}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}