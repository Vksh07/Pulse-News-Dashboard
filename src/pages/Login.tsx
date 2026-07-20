import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Github, Chrome, Zap } from 'lucide-react';

const BENEFITS = [
  { icon: '🎯', title: 'Free to start', desc: 'No credit card' },
  { icon: '🚀', title: '14-day Pro trial', desc: 'Full access' },
  { icon: '🔄', title: 'Cancel anytime', desc: 'No lock-in' },
  { icon: '🧠', title: 'ADHD-optimized', desc: 'Built for focus' },
  { icon: '📊', title: 'UPSC-aligned', desc: 'Syllabus tagged' },
  { icon: '🎮', title: 'Gamified', desc: 'XP & streaks' },
];

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = [];
    const colors = ['rgba(234,179,8,', 'rgba(34,197,94,', 'rgba(59,130,246,'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1.5 + Math.random() * 3,
        alpha: 0.15 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

const quotes = [
  { text: '"The best time to plant a tree was 20 years ago. The second best time is now."', author: 'Chinese Proverb' },
  { text: '"Success is the sum of small efforts repeated day in and day out."', author: 'Robert Collier' },
  { text: '"Your focus determines your reality."', author: 'Qui-Gon Jinn' },
  { text: '"Small daily improvements over time lead to stunning results."', author: 'James Clear' },
];

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authed, setAuthed] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx((p) => (p + 1) % quotes.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      if (!isLogin && password !== confirmPassword) throw new Error('Passwords do not match');
      if (password.length < 8) throw new Error('Password must be at least 8 characters');
      localStorage.setItem('pulse_auth_token', 'demo-jwt-token');
      localStorage.setItem('pulse_user_email', email);
      setAuthed(true);
      setTimeout(() => navigate('/dashboard'), 250);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {};

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-slate-950">
      <ParticleCanvas />

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

        <div className="relative text-center max-w-md">
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">📰</span>
            <div>
              <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">Pulse</span>
              <p className="text-slate-500 text-sm mt-1 tracking-widest uppercase">ADHD-Savvy News</p>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white mb-4 leading-tight">News That Doesn't<br />Overwhelm You</h2>

          <div className="space-y-4 text-left">
            {[
              { icon: '🎯', text: 'UPSC syllabus-tagged articles' },
              { icon: '⚡', text: 'Energy-adaptive reading modes' },
              { icon: '🧠', text: 'Spaced repetition for retention' },
              { icon: '🏆', text: 'Gamified progress & streaks' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xl">{f.icon}</span>
                <span className="text-slate-300 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Rotating quote */}
          <div className="mt-10 p-5 rounded-xl bg-white/5 border border-white/10 min-h-[80px] flex flex-col justify-center transition-all duration-500">
            <p className="text-sm text-slate-400 italic leading-relaxed" key={quoteIdx}>
              {quotes[quoteIdx].text}
            </p>
            <p className="text-xs text-slate-600 mt-2">— {quotes[quoteIdx].author}</p>
          </div>

          <div className="mt-8 flex justify-center gap-1.5">
            {quotes.map((_, i) => (
              <button key={i} onClick={() => setQuoteIdx(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === quoteIdx ? 'bg-yellow-500 w-6' : 'bg-slate-700 hover:bg-slate-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/5 via-transparent to-transparent lg:hidden" />

        <div className="w-full max-w-md relative">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="text-4xl">📰</span>
              <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Pulse</span>
            </Link>
          </div>

          <div className={`transition-all duration-500 ${authed ? 'opacity-0 scale-95 absolute inset-0 pointer-events-none' : ''}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join Pulse'}
              </h1>
              <p className="text-slate-400 text-sm">
                {isLogin ? 'Sign in to continue your UPSC journey' : 'Start your ADHD-savvy news experience'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/15 border border-red-500/25 rounded-2xl flex items-center gap-3 text-red-400 animate-pop-in">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl hover:border-yellow-500/20 transition-all duration-500">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-yellow-500 transition-colors" />
                    <input
                      id="email" type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="you@example.com" required autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white placeholder-slate-600 outline-none focus:border-yellow-500/50 focus:shadow-[0_0_20px_rgba(234,179,8,0.08)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within/input:text-yellow-500 transition-colors" />
                    <input
                      id="password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••" required autoComplete={isLogin ? 'current-password' : 'new-password'}
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white placeholder-slate-600 outline-none focus:border-yellow-500/50 focus:shadow-[0_0_20px_rgba(234,179,8,0.08)] transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="animate-fade-slide-up">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="••••••••" required autoComplete="new-password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white placeholder-slate-600 outline-none focus:border-yellow-500/50 focus:shadow-[0_0_20px_rgba(234,179,8,0.08)] transition-all"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="relative w-full py-3.5 rounded-xl font-bold text-base text-black overflow-hidden transition-all duration-300 disabled:opacity-60 group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 group-hover/btn:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" />{isLogin ? 'Signing In...' : 'Creating...'}</>
                      : <><Zap className="h-5 w-5" />{isLogin ? 'Sign In' : 'Create Account'}</>}
                  </span>
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-900 text-slate-500">or</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => handleOAuth('GitHub')}
                  className="py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/60 border border-slate-700/50 hover:border-yellow-500/30 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Github className="h-5 w-5" /> GitHub
                </button>
                <button type="button" onClick={() => handleOAuth('Google')}
                  className="py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/60 border border-slate-700/50 hover:border-yellow-500/30 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Chrome className="h-5 w-5" /> Google
                </button>
              </div>

              <p className="mt-6 text-center text-slate-400 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); setConfirmPassword(''); }}
                  className="ml-1.5 text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Mobile benefits */}
            <div className="mt-8 lg:hidden">
              <p className="text-center text-slate-600 text-xs font-semibold uppercase tracking-widest mb-4">Why Pulse?</p>
              <div className="grid grid-cols-3 gap-2">
                {BENEFITS.slice(0, 3).map((b) => (
                  <div key={b.title} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/50 text-center">
                    <span className="text-xl block mb-1">{b.icon}</span>
                    <p className="text-xs font-semibold text-white">{b.title}</p>
                    <p className="text-[10px] text-slate-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Authed overlay */}
          {authed && (
            <div className="text-center animate-pop-in">
              <div className="relative inline-block mb-6">
                <div className="text-7xl animate-bounce">🚀</div>
                <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/30 via-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Signed In!</h2>
              <p className="text-slate-400">Redirecting to your dashboard...</p>
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.6s' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
