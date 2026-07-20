import { useState, useEffect } from 'react';
import { cn } from '../utils';
import { useUIStore } from '../store';

export function FocusMode() {
  const setCurrentPage = useUIStore((s) => s.setCurrentPage);
  const exit = () => setCurrentPage('dashboard');

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
        <button onClick={exit} className="btn">Exit</button>
      </header>
      <section className="card">
        <p className="text-slate-400">Distraction-free view is active.</p>
      </section>
    </div>
  );
}
