import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ArrowLeft, Zap, Sparkles } from 'lucide-react';

const TOPICS = [
  { id: 'india', label: 'India', emoji: '🇮🇳', desc: 'National affairs & polity', color: 'from-yellow-500/20 to-amber-500/10', border: 'border-l-yellow-500' },
  { id: 'tamilnadu', label: 'Tamil Nadu', emoji: '📍', desc: 'State-specific news', color: 'from-blue-500/20 to-sky-500/10', border: 'border-l-blue-500' },
  { id: 'andhra', label: 'Andhra Pradesh', emoji: '📍', desc: 'AP current affairs', color: 'from-purple-500/20 to-violet-500/10', border: 'border-l-purple-500' },
  { id: 'world', label: 'International', emoji: '🌍', desc: 'Global headlines', color: 'from-green-500/20 to-emerald-500/10', border: 'border-l-green-500' },
  { id: 'finance', label: 'Finance', emoji: '💰', desc: 'Markets & economy', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-l-emerald-500' },
  { id: 'earnings', label: 'Earnings', emoji: '💼', desc: 'Corporate results', color: 'from-amber-500/20 to-orange-500/10', border: 'border-l-amber-500' },
  { id: 'sports', label: 'Sports', emoji: '🏏', desc: 'All sports coverage', color: 'from-red-500/20 to-rose-500/10', border: 'border-l-red-500' },
  { id: 'national_sports', label: 'National Sports', emoji: '🏏', desc: 'Indian sports', color: 'from-pink-500/20 to-fuchsia-500/10', border: 'border-l-pink-500' },
  { id: 'international_sports', label: 'Intl Sports', emoji: '⚽', desc: 'Global sports', color: 'from-indigo-500/20 to-blue-500/10', border: 'border-l-indigo-500' },
];

const ENERGY_MODES = [
  { id: 'high' as const, label: 'High Focus', emoji: '🔥', desc: 'Deep work — dense news, full stats', bars: 4, gradient: 'from-red-500 to-orange-500' },
  { id: 'medium' as const, label: 'Balanced', emoji: '⚡', desc: 'Smart mix — focus + recovery', bars: 3, gradient: 'from-yellow-500 to-amber-500' },
  { id: 'low' as const, label: 'Gentle', emoji: '🌿', desc: 'Easy reading — fewer items', bars: 2, gradient: 'from-green-500 to-emerald-500' },
  { id: 'rest' as const, label: 'Rest Mode', emoji: '😴', desc: 'Just essentials — zero pressure', bars: 1, gradient: 'from-blue-500 to-indigo-500' },
];

const STEP_CONFIG = [
  { emoji: '👋', title: "Hey there!", subtitle: "Let's tune Pulse for you", color: 'from-yellow-500 to-amber-500', bg: 'from-yellow-500/10 via-transparent to-transparent' },
  { emoji: '🎯', title: 'Pick Your Topics', subtitle: 'Choose what you care about', color: 'from-green-500 to-emerald-500', bg: 'from-green-500/10 via-transparent to-transparent' },
  { emoji: '⚡', title: 'Energy Mode', subtitle: 'How are you feeling today?', color: 'from-blue-500 to-indigo-500', bg: 'from-blue-500/10 via-transparent to-transparent' },
  { emoji: '🚀', title: "You're All Set!", subtitle: 'Your dashboard is ready', color: 'from-yellow-500 to-green-500', bg: 'from-yellow-500/10 via-green-500/10 to-transparent' },
];

function ConfettiCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#eab308', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b'];
    const pieces: { x: number; y: number; vx: number; vy: number; r: number; color: string; rot: number; vr: number }[] = [];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: 1 + Math.random() * 3,
        r: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 8,
      });
    }

    let frame = 0;
    const totalFrames = 120;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.05;
        p.vx *= 0.99;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
        ctx.restore();
      }
      frame++;
      if (frame < totalFrames) animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [active]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-50" />;
}

function ParticleBg({ step }: { step: number }) {
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

    for (let i = 0; i < 40; i++) {
      p.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: 1 + Math.random() * 2.5, a: 0.1 + Math.random() * 0.25 });
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
        ctx.fillStyle = colors[step % colors.length] + pt.a + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [step]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low' | 'rest'>('medium');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [showConfetti, setShowConfetti] = useState(false);

  const cfg = STEP_CONFIG[step];

  const toggleTopic = useCallback((id: string) => {
    setSelectedTopics((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem('pulse_user_name', name || 'Reader');
      localStorage.setItem('pulse_user_topics', selectedTopics.join(','));
      localStorage.setItem('pulse_energy_mode', energy);
    } catch {}
    setShowConfetti(true);
    setStep(3);
  }, [name, selectedTopics, energy]);

  const goNext = () => { setDirection('forward'); setStep((s) => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection('back'); setStep((s) => Math.max(s - 1, 0)); };

  const progressPct = step === 3 ? 100 : Math.round((step / 2) * 100);

  const animClass = direction === 'forward' ? 'animate-fade-slide-up' : 'animate-pop-in';

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950">
      <ConfettiCanvas active={showConfetti} />
      <ParticleBg step={step} />

      {/* Step gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${cfg.bg} blur-[120px] transition-all duration-1000`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr ${cfg.bg} blur-[100px] transition-all duration-1000`} style={{ animationDelay: '500ms' }} />
      </div>

      <div className="relative w-full max-w-xl" key={step}>
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]">📰</span>
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent">Pulse</span>
          </div>
        </div>

        {/* Main card */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${cfg.color} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`} />
          <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-lg shadow-lg`}>
                {cfg.emoji}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{cfg.title}</h1>
                <p className="text-xs text-slate-400">{cfg.subtitle}</p>
              </div>
              {step < 3 && (
                <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-full">
                  Step {step + 1}/3
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-700 ease-out`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-3 flex items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        i <= step
                          ? 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                          : 'bg-slate-800 text-slate-600'
                      }`}>
                        {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium transition-colors hidden sm:inline ${i <= step ? 'text-slate-300' : 'text-slate-700'}`}>
                        {['Name', 'Topics', 'Energy'][i]}
                      </span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-px mx-3 transition-colors duration-500 ${i < step ? 'bg-yellow-500/40' : 'bg-slate-800'}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 0 — Name */}
            {step === 0 && (
              <div className={animClass} key="s0">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">👋</div>
                  <h2 className="text-xl font-bold text-white mb-1">What should I call you?</h2>
                  <p className="text-sm text-slate-400">Just a name or nickname — casual is fine</p>
                </div>
                <div className="relative max-w-xs mx-auto">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Venkat"
                    autoFocus
                    className="w-full text-center text-xl rounded-xl border-2 border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white outline-none focus:border-yellow-500/50 focus:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && goNext()}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">{name ? '✍️' : '🖋️'}</div>
                </div>
                <div className="flex justify-center mt-6">
                  <button onClick={goNext} disabled={!name.trim()}
                    className="group relative px-8 py-3 rounded-xl font-bold text-base text-black overflow-hidden transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:scale-105 transition-transform" />
                    <span className="relative flex items-center gap-2">
                      Let's Go! <ChevronRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Topics */}
            {step === 1 && (
              <div className={animClass} key="s1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">Choose up to 8 topics</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${selectedTopics.length >= 8 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'}`}>
                    {selectedTopics.length}/8
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TOPICS.map((t) => {
                    const active = selectedTopics.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => toggleTopic(t.id)}
                        disabled={!active && selectedTopics.length >= 8}
                        className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                          active
                            ? 'border-yellow-500/60 bg-gradient-to-br ' + t.color + ' shadow-[0_0_24px_rgba(234,179,8,0.1)] scale-[1.02]'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950/80'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-2xl transition-transform duration-200 ${active ? 'scale-110' : ''}`}>{t.emoji}</span>
                          {active && <span className="w-5 h-5 rounded-full bg-yellow-500 text-black flex items-center justify-center"><Check className="h-3 w-3" /></span>}
                        </div>
                        <p className="text-sm font-bold text-white">{t.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={goBack}
                    className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={goNext} disabled={selectedTopics.length === 0}
                    className="group relative px-7 py-2.5 rounded-xl font-bold text-sm text-black overflow-hidden transition-all duration-300 disabled:opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-105 transition-transform" />
                    <span className="relative flex items-center gap-2">Next <ChevronRight className="h-4 w-4" /></span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Energy */}
            {step === 2 && (
              <div className={animClass} key="s2">
                <div className="grid grid-cols-2 gap-3">
                  {ENERGY_MODES.map((mode) => {
                    const active = energy === mode.id;
                    return (
                      <button key={mode.id} onClick={() => setEnergy(mode.id)}
                        className={`group relative rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                          active
                            ? 'border-yellow-500/60 bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent shadow-[0_0_30px_rgba(234,179,8,0.12)] scale-[1.02]'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-3xl mb-3 transition-transform duration-200 group-hover:scale-110">{mode.emoji}</div>
                        <p className="text-base font-bold text-white mb-2">{mode.label}</p>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${
                              i < mode.bars
                                ? active ? `bg-gradient-to-r ${mode.gradient}` : 'bg-slate-600'
                                : 'bg-slate-800'
                            }`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{mode.desc}</p>
                        {active && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center"><Check className="h-3.5 w-3.5" /></div>}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={goBack}
                    className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={finish}
                    className="group relative px-7 py-2.5 rounded-xl font-bold text-sm text-black overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-105 transition-transform" />
                    <span className="relative flex items-center gap-2">Finish Setup <Sparkles className="h-4 w-4" /></span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Done */}
            {step === 3 && (
              <div className="text-center py-4" key="s3">
                <div className="relative inline-block mb-6">
                  <div className="text-7xl animate-bounce">🚀</div>
                  <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/30 via-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">You're All Set, {name || 'Reader'}!</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                  Your topics and energy mode are locked in. We'll keep it visual, fast, and low-friction.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {selectedTopics.length} topics
                  </div>
                  <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {ENERGY_MODES.find(m => m.id === energy)?.label}
                  </div>
                </div>
                <button onClick={() => navigate('/dashboard')}
                  className="group relative inline-flex items-center gap-2 px-10 py-3.5 rounded-xl font-bold text-lg text-black overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-green-500 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                  <span className="relative flex items-center gap-2">
                    Open Dashboard <ChevronRight className="h-6 w-6" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
