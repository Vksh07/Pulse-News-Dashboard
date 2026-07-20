import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';
import { BreakingStream } from './pages/BreakingStream';
import { BreakingDigest } from './pages/BreakingDigest';
const Settings = React.lazy(() => import('./pages/Settings'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const CrisisMode = React.lazy(() => import('./pages/CrisisMode').then(m => ({ default: m.CrisisMode })));
const FocusMode = React.lazy(() => import('./pages/FocusMode').then(m => ({ default: m.FocusMode })));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, refetchOnWindowFocus: false } },
});

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-6 text-sm text-slate-400">Loading…</div>}>{children}</Suspense>;
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'whitespace-nowrap text-xs font-semibold border rounded-full px-3 py-1.5 transition-colors ' +
        (isActive ? 'border-white/30 bg-white/10 text-white' : 'border-slate-700/60 bg-slate-900/70 text-slate-400 hover:border-slate-600')
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  );
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>
      <div className="mx-auto w-full max-w-6xl px-3 pt-3">
        <nav aria-label="Primary" className="flex flex-row gap-2 overflow-x-auto">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/breaking-digest" label="Breaking Digest" />
          <NavItem to="/breaking-stream" label="Breaking Stream" />
        </nav>
      </div>
      <main id="main-content" className="mx-auto w-full max-w-7xl px-3 pt-3 pb-24" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/breaking-digest" element={<BreakingDigest />} />
          <Route path="/breaking-stream" element={<BreakingStream />} />
          <Route path="/landing" element={<Lazy><Landing /></Lazy>} />
          <Route path="/login" element={<Lazy><Login /></Lazy>} />
          <Route path="/onboarding" element={<Lazy><Onboarding /></Lazy>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/focus" element={<Lazy><FocusMode /></Lazy>} />
          <Route path="/crisis" element={<Lazy><CrisisMode /></Lazy>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-slate-800 !text-white !border !border-slate-700',
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </QueryClientProvider>
  );
}
