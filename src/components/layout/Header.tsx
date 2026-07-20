import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';

const PRIMARY = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upsc', label: 'UPSC' },
  { to: '/csat', label: 'CSAT' },
];

const SECONDARY = [
  { to: '/sr', label: 'Spaced Repetition' },
  { to: '/psychology', label: 'Psychology' },
  { to: '/focus', label: 'Focus Mode' },
  { to: '/health', label: 'Health Pulse' },
  { to: '/research', label: 'Research Intelligence' },
  { to: '/finance', label: 'Market Finance' },
  { to: '/social', label: 'Social Pulse' },
  { to: '/productivity', label: 'Productivity Pulse' },
  { to: '/systems', label: 'Systems Engineer' },
];

const MORE = [
  { to: '/settings', label: 'Settings' },
  { to: '/login', label: 'Login' },
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/main', label: 'Main Agent OC' },
  { to: '/command', label: 'Maverick HQ' },
  { to: '/crisis', label: 'Crisis' },
];

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ to, label, end = false }: { to: string; label: string; end?: boolean }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive: active }) =>
        `px-3 py-1.5 rounded text-sm transition-colors ${
          active
            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Pulse Home">
          <span className="text-2xl">📰</span>
          <span className="font-black text-xl text-white">Pulse</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Primary">
          {PRIMARY.map(item => (
            <NavItem key={item.to} to={item.to} label={item.label} end={item.to === '/'} />
          ))}
          <span className="mx-2 text-slate-600">·</span>
          {SECONDARY.map(item => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
          <span className="mx-2 text-slate-600">·</span>
          {MORE.map(item => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <button
          className="lg:hidden p-2 rounded hover:bg-slate-800"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3">
          <div className="flex flex-col gap-1">
            {[...PRIMARY, ...SECONDARY, ...MORE].map(item => (
              <NavItem key={item.to} to={item.to} label={item.label} end={item.to === '/'} />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}