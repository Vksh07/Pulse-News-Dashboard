import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Brain, Zap, Award, Shield, TrendingUp, CheckCircle, Sparkles, Star, ChevronRight } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'UPSC Lens', desc: 'Smart filtering by syllabus topics. Articles tagged with GS papers, auto-sorted by relevance.', color: '#22c55e', bg: 'from-green-500/20 to-emerald-500/10' },
  { icon: Zap, title: 'ADHD-First Design', desc: 'Focus mode, energy-aware layout, micro-goals, dopamine rotation — built for neurodivergent brains.', color: '#eab308', bg: 'from-yellow-500/20 to-amber-500/10' },
  { icon: Target, title: 'CSAT Practice', desc: 'Daily quant & reasoning questions with explanations. Spaced repetition for retention.', color: '#3b82f6', bg: 'from-blue-500/20 to-sky-500/10' },
  { icon: Award, title: 'Gamified Progress', desc: 'XP, streaks, levels, achievements — dopamine loops that actually help you study.', color: '#8b5cf6', bg: 'from-purple-500/20 to-violet-500/10' },
  { icon: Shield, title: 'Focus Shield', desc: 'One-click distraction blocker. Energy-aware scheduling. Hide everything except the task.', color: '#ec4899', bg: 'from-pink-500/20 to-fuchsia-500/10' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Reading heatmaps, category breakdowns, XP sources, streak consistency.', color: '#f59e0b', bg: 'from-orange-500/20 to-amber-500/10' },
];

const STATS = [
  { value: '2M+', label: 'Articles Indexed' },
  { value: '50+', label: 'UPSC Topics' },
  { value: '15+', label: 'CSAT Categories' },
  { value: '100%', label: 'ADHD-Friendly' },
];

const TESTIMONIALS = [
  { quote: 'Finally a news app that doesn\'t make me feel guilty for not reading everything. The UPSC Lens saves me hours every week.', author: 'Priya S., UPSC 2024 Aspirant' },
  { quote: 'The ADHD features are game-changing. Focus mode + micro-goals = I actually finish my daily reading now.', author: 'Arjun M., Working Professional' },
  { quote: 'CSAT practice with spaced repetition? Genius. My quant score jumped 15 points in a month.', author: 'Kavya R., Repeat Attempt' },
];

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const p: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      p.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: 1 + Math.random() * 2, a: 0.1 + Math.random() * 0.2 });
    }

    const colors = ['rgba(234,179,8,', 'rgba(34,197,94,', 'rgba(59,130,246,', 'rgba(139,92,246,'];
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pt of p) {
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
        if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + pt.a + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const num = parseInt(value.replace(/[^0-9]/g, ''));
  const suffixChar = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const end = num;
        const duration = 1500;
        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          start = Math.floor(eased * end);
          setDisplay(start + suffixChar);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, suffixChar]);

  return <div ref={ref}>{display}</div>;
}

export function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <span className="text-2xl sm:text-3xl">📰</span>
                <div className="absolute -inset-3 bg-yellow-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Pulse</span>
            </Link>
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'How It Works', 'Testimonials', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-slate-400 hover:text-white text-sm font-medium transition-all hover:tracking-wide">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-all hidden sm:inline">Sign In</Link>
              <Link to="/onboarding"
                className="group relative px-5 py-2.5 rounded-xl font-bold text-sm text-black overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 group-hover:scale-105 transition-transform" />
                <span className="relative flex items-center gap-2">Get Started <Sparkles className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-4 overflow-hidden">
        <HeroCanvas />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-slate-950 to-green-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.08),transparent_70%)]" />

        {/* Large decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-green-500/8 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-green-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-semibold mb-8 animate-fade-slide-up shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>New: UPSC Lens — Auto-tagging by syllabus</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 animate-fade-slide-up leading-[1.1]" style={{ animationDelay: '100ms' }}>
            News That{' '}
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 bg-clip-text text-transparent animate-pulse" style={{ animationDuration: '4s' }}>
              Works
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl text-slate-400">for{' '}
              <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">Your Brain</span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-12 animate-fade-slide-up leading-relaxed" style={{ animationDelay: '200ms' }}>
            The ADHD-savvy news dashboard for UPSC aspirants.
            Smart filtering, gamified progress, and focus tools — built for how your brain actually works.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-slide-up" style={{ animationDelay: '300ms' }}>
            <Link to="/onboarding"
              className="group relative px-10 py-4 rounded-xl font-bold text-lg text-black overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
              <span className="relative flex items-center gap-2">
                Start Free <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a href="#features"
              className="group px-10 py-4 rounded-xl font-bold text-lg text-slate-200 bg-slate-800/60 border border-slate-700/50 hover:border-yellow-500/30 hover:bg-slate-800 transition-all duration-300 flex items-center gap-2"
            >
              Explore Features <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Trust */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
            {['No credit card required', 'Cancel anytime', 'Privacy-first', '14-day Pro trial'].map((item) => (
              <div key={item} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent py-10">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Built for How You <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Learn</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Every feature designed around ADHD challenges and UPSC demands.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i}
                className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 group-hover:border-yellow-500/30 transition-all duration-500" />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-slate-800/80 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-green-500 transition-all duration-300">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Three Steps to <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Smarter News</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Personalize, read, track — it's that simple.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Personalize', desc: 'Pick your UPSC topics, set daily goals, choose your focus modes. Takes 2 minutes.', emoji: '🎯', gradient: 'from-yellow-500 to-amber-500' },
              { step: 2, title: 'Read Smart', desc: 'UPSC Lens auto-tags articles. Focus mode removes distractions. Micro-goals keep you moving.', emoji: '🧠', gradient: 'from-green-500 to-emerald-500' },
              { step: 3, title: 'Track & Grow', desc: 'XP, streaks, analytics, spaced repetition. See progress, build habits, ace the exam.', emoji: '📈', gradient: 'from-blue-500 to-indigo-500' },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 group-hover:border-yellow-500/20 transition-all duration-500" />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className={`absolute top-8 right-8 w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} text-black font-black text-lg flex items-center justify-center shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-yellow-500/5 via-green-500/5 to-blue-500/5 blur-[100px]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Trusted by <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Aspirants</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Real results from real UPSC aspirants.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 group-hover:border-yellow-500/20 transition-all duration-500" />
                <div className="relative">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-green-500 flex items-center justify-center text-sm font-bold text-black shadow-lg">
                      {t.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.author}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Verified Aspirant</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Simple <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Pricing</span></h2>
            <p className="text-lg text-slate-400">Start free. ₹299/mo for Pro. No lock-in.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Free', price: '₹0', features: ['UPSC Lens (basic)', 'Focus Mode', 'CSAT Practice (5/day)', 'Micro-goals', 'Basic Analytics', '7-day history'], cta: 'Start Free', popular: false },
              { name: 'Pro', price: '₹299', features: ['Everything in Free', 'Unlimited CSAT', 'Spaced Repetition', 'Full Analytics', 'Unlimited History', 'Priority Support', 'Custom Topics'], cta: 'Get Pro', popular: true },
              { name: 'Team', price: '₹799', features: ['Everything in Pro', 'Up to 5 members', 'Shared Bookmarks', 'Team Analytics', 'Admin Dashboard', 'Dedicated Support'], cta: 'Contact Sales', popular: false },
            ].map((plan, i) => (
              <div key={i} className={`group relative rounded-2xl p-6 flex flex-col transition-all duration-500 hover:scale-[1.02] ${plan.popular ? '-mt-4' : ''}`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border transition-all duration-500 ${plan.popular ? 'border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)]' : 'border-slate-800/80 group-hover:border-yellow-500/20'}`} />
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-sm font-bold shadow-lg z-10 flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> Most Popular
                  </div>
                )}
                <div className="relative flex flex-col flex-1">
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-slate-400 text-sm">{i === 0 ? '' : '/month'}</span>
                    </div>
                    <p className="text-slate-500 text-xs">No card to start</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.price === '₹299' ? '/onboarding' : '/login'}
                    className={`relative w-full py-3 rounded-xl font-bold text-sm text-center overflow-hidden transition-all duration-300 ${
                      plan.popular
                        ? 'text-black'
                        : 'text-slate-200 bg-slate-800/60 border border-slate-700/50 hover:border-yellow-500/30'
                    }`}
                  >
                    {plan.popular && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                      </>
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {plan.cta} <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-green-500/10 to-blue-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.15),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Ready to Study <span className="bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Smarter</span>?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Join thousands of UPSC aspirants who've switched to ADHD-friendly news.
          </p>
          <Link to="/onboarding"
            className="group relative inline-flex items-center gap-2 px-12 py-4 rounded-xl font-bold text-lg text-black overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
            <span className="relative flex items-center gap-2">
              Start Free Today <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
          <p className="mt-4 text-slate-500 text-sm flex items-center justify-center gap-4">
            <span>No credit card</span>
            <span>•</span>
            <span>Cancel anytime</span>
            <span>•</span>
            <span>14-day Pro trial</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📰</span>
                <span className="font-black text-xl bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Pulse</span>
              </Link>
              <p className="text-slate-400 text-sm">ADHD-savvy news for UPSC aspirants.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white transition-all hover:tracking-wide">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 Pulse. Built for UPSC aspirants by neurodivergent engineers.</p>
            <div className="flex items-center gap-4">
              {['𝕏', '⌘', '💬'].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-yellow-500/30 transition-all">
                  <span>{icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
