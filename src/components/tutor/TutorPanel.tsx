// ════════════════════════════════════════════════════
// PULSE — Tutor Panel & Notification Bell
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store';
import { useGamificationStore } from '../../store';
import { X, ChevronLeft, ChevronRight, Brain, Target, Award, BookOpen, CheckCircle, XCircle, Clock, RotateCcw, ArrowRight, Flame, Lightbulb, Sparkles, Zap, Bell } from 'lucide-react';
import { cn, formatRelativeTime, escapeHtml } from '../../utils';
import toast from 'react-hot-toast';

// ─── Tutor Panel ───
const CSAT_QUESTIONS = [
  {
    q: 'If 60% of students in a class are boys and the number of girls is 24, what is the total number of students?',
    opts: ['48', '60', '72', '80'],
    ans: 1,
    exp: 'Girls = 40% = 24. Total = 24/40 × 100 = 60.',
    category: 'Percentages',
  },
  {
    q: 'A train 150m long passes a pole in 15 seconds. What is its speed in km/h?',
    opts: ['36 km/h', '42 km/h', '48 km/h', '54 km/h'],
    ans: 0,
    exp: 'Speed = Distance/Time = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.',
    category: 'Speed, Time & Distance',
  },
  {
    q: 'If A : B = 2 : 3 and B : C = 4 : 5, then A : C = ?',
    opts: ['8 : 15', '5 : 8', '2 : 5', '3 : 5'],
    ans: 0,
    exp: "A/B = 2/3, B/C = 4/5. A/C = (2/3)×(4/5) = 8/15, so A:C = 8:15.",
    category: 'Ratios & Proportions',
  },
  {
    q: 'What is the next number in the series: 2, 6, 12, 20, 30, ?',
    opts: ['38', '40', '42', '44'],
    ans: 2,
    exp: 'Pattern: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, so next = 6×7 = 42.',
    category: 'Number Series',
  },
  {
    q: 'A is the father of B. B is the sister of C. D is the mother of C. How is D related to A?',
    opts: ['Sister', 'Wife', 'Daughter', 'Mother'],
    ans: 1,
    exp: "A is father of B and C, D is mother of C. So D is A's wife.",
    category: 'Blood Relations',
  },
  {
    q: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    opts: ['Some roses fade quickly', 'All flowers fade quickly', 'None of these', 'All roses are flowers that fade quickly'],
    ans: 2,
    exp: 'We cannot conclude that some roses fade quickly — the "some" may be other flowers. So "None of these" is correct.',
    category: 'Logical Reasoning',
  },
  {
    q: 'The average weight of 5 people is 60 kg. If one person leaves, the average drops to 58 kg. What is the weight of the person who left?',
    opts: ['62 kg', '64 kg', '66 kg', '68 kg'],
    ans: 3,
    exp: 'Total weight of 5 = 5×60 = 300. Total of 4 = 4×58 = 232. Weight of person who left = 300 - 232 = 68 kg.',
    category: 'Averages',
  },
  {
    q: 'A man rows 12 km upstream and 28 km downstream taking 5 hours each time. What is the speed of the current?',
    opts: ['1.6 km/h', '2 km/h', '2.4 km/h', '4 km/h'],
    ans: 0,
    exp: 'Upstream speed = 12/5 = 2.4 km/h. Downstream speed = 28/5 = 5.6 km/h. Speed of current = (5.6 - 2.4)/2 = 1.6 km/h.',
    category: 'Boats & Streams',
  },
  {
    q: 'If the ratio of ages of A and B is 5:3 and the sum of their ages is 64 years, what is the age of A?',
    opts: ['35 years', '40 years', '45 years', '30 years'],
    ans: 1,
    exp: "Let ages be 5x and 3x. 5x + 3x = 64 → 8x = 64 → x = 8. Age of A = 5x = 40 years.",
    category: 'Age Problems',
  },
  {
    q: 'A and B can do a work in 12 days, B and C in 15 days, C and A in 20 days. How many days will A alone take to complete the work?',
    opts: ['20', '24', '30', '36'],
    ans: 2,
    exp: 'A+B = 1/12, B+C = 1/15, C+A = 1/20. 2(A+B+C) = 1/12+1/15+1/20 = 5/60+4/60+3/60 = 12/60 = 1/5. A+B+C = 1/10. A = (A+B+C) - (B+C) = 1/10 - 1/15 = 1/30. A alone = 30 days.',
    category: 'Time & Work',
  },
];

const PSYCH_CARDS = [
  {
    title: 'Dopamine & Motivation',
    content: 'ADHD brains have lower baseline dopamine. Novelty, urgency, and completion signals boost it. Use micro-goals and immediate rewards.',
    tags: ['Neuroscience', 'Motivation', 'Dopamine'],
  },
  {
    title: 'Time Blindness',
    content: 'Difficulty sensing time passing. Use external timers, visual countdowns, and the "3-second rule" to bypass the planning trap.',
    tags: ['Time Management', 'Executive Function'],
  },
  {
    title: 'Rejection Sensitivity',
    content: 'Perceived criticism feels physically painful. Reframe feedback as data. Practice self-compassion scripts.',
    tags: ['Emotional Regulation', 'RSD'],
  },
  {
    title: 'Hyperfocus Management',
    content: 'Hyperfocus is a superpower when directed. Use "focus shields" and timers to prevent burnout. Schedule recovery.',
    tags: ['Focus', 'Energy Management'],
  },
  {
    title: 'Working Memory Limits',
    content: 'ADHD working memory holds ~3 items vs 7. Externalize everything: write it down, use checklists, voice notes.',
    tags: ['Working Memory', 'Strategies'],
  },
  {
    title: 'Emotional Dysregulation',
    content: 'Emotions hit harder and last longer. Name it to tame it. Use the 90-second rule: emotions peak at 90s if not fed.',
    tags: ['Emotions', 'Regulation'],
  },
];

export function TutorPanel({ onClose }: { onClose: () => void }) {
  const { tutorPanelOpen } = useUIStore();
  const { awardXP } = useGamificationStore();
  const [activeTab, setActiveTab] = useState<'csat' | 'psych'>('csat');
  const [csatIndex, setCsatIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [csatStats, setCsatStats] = useState({ correct: 0, total: 0, streak: 0 });
  const [psychIndex, setPsychIndex] = useState(0);

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('csat_stats');
    if (saved) {
      try { setCsatStats(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveCsatStats = () => {
    localStorage.setItem('csat_stats', JSON.stringify(csatStats));
  };

  const currentCsat = CSAT_QUESTIONS[csatIndex];
  const currentPsych = PSYCH_CARDS[psychIndex];
  const correct = showResult && selectedOption !== null && selectedOption === currentCsat?.ans;

  const handleCsatSelect = (option: number) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    const correct = option === currentCsat.ans;
    
    const newStats = { ...csatStats };
    newStats.total += 1;
    if (correct) {
      newStats.correct += 1;
      newStats.streak += 1;
    } else {
      newStats.streak = 0;
    }
    setCsatStats(newStats);
    localStorage.setItem('csat_stats', JSON.stringify(newStats));
    
    if (correct) {
      const xpGain = 10 * (newStats.streak >= 3 ? 2 : 1);
      awardXP(xpGain);
      if (newStats.streak >= 3) {
        toast.success(`🔥 ${newStats.streak}-streak! Double XP!`);
      }
    }
  };

  const nextCsat = () => {
    setCsatIndex((csatIndex + 1) % CSAT_QUESTIONS.length);
    setSelectedOption(null);
    setShowResult(false);
  };

  const prevCsat = () => {
    setCsatIndex((csatIndex - 1 + CSAT_QUESTIONS.length) % CSAT_QUESTIONS.length);
    setSelectedOption(null);
    setShowResult(false);
  };

  const nextPsych = () => setPsychIndex((psychIndex + 1) % PSYCH_CARDS.length);
  const prevPsych = () => setPsychIndex((psychIndex - 1 + PSYCH_CARDS.length) % PSYCH_CARDS.length);

  if (!document.getElementById('tutor-panel-root')) {
    return null; // Rendered via portal
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 flex flex-col animate-fade-slide-up" id="tutor-panel-root">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Tutor-OC
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
            {csatStats.correct}/{csatStats.total} • 🔥{csatStats.streak}
          </span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('csat')}
          className={cn('flex-1 py-3 px-4 text-center text-sm font-medium border-b-2 transition-all',
            activeTab === 'csat' ? 'border-yellow-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          )}
        >
          <Target className="h-4 w-4 mx-auto mb-1" />
          CSAT Practice
        </button>
        <button
          onClick={() => setActiveTab('psych')}
          className={cn('flex-1 py-3 px-4 text-center text-sm font-medium border-b-2 transition-all',
            activeTab === 'psych' ? 'border-green-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
          )}
        >
          <Lightbulb className="h-4 w-4 mx-auto mb-1" />
          Psych Refresher
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'csat' && currentCsat && (
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                {currentCsat.category}
              </span>
              <span className="text-xs text-slate-500">Q.{csatIndex + 1}/{CSAT_QUESTIONS.length}</span>
            </div>

            {/* Question */}
            <div className="card p-5 mb-4">
              <p className="text-lg font-medium text-white mb-4">{escapeHtml(currentCsat.q)}</p>

              {/* Options */}
              <div className="space-y-3">
                {currentCsat.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCsatSelect(i)}
                    disabled={showResult}
                    className={cn(
                      'csat-option w-full p-4 rounded-lg text-left text-base transition-all border-2',
                      showResult && i === currentCsat.ans && 'correct border-green-500 bg-green-500/10 text-green-400',
                      showResult && i === selectedOption && !correct && 'wrong border-red-500 bg-red-500/10 text-red-400',
                      !showResult && selectedOption === i && 'border-yellow-500 bg-yellow-500/10',
                      !showResult && selectedOption === null && 'bg-slate-800 border-slate-700 hover:border-yellow-500 hover:bg-slate-700',
                      showResult && i !== currentCsat.ans && i !== selectedOption && 'border-slate-700 bg-slate-800/50 opacity-60'
                    )}
                  >
                    <span className="font-mono font-bold text-lg mr-3 w-8 inline-block text-yellow-500">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {escapeHtml(opt)}
                    {showResult && i === currentCsat.ans && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                    {showResult && i === selectedOption && !correct && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={cn(
                'csat-result p-4 rounded-lg animate-fade-slide-up',
                correct ? 'correct' : 'wrong'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {correct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold">{correct ? 'Correct!' : 'Incorrect'}</span>
                </div>
                <p className="text-slate-300">{escapeHtml(currentCsat.exp)}</p>
                {!correct && (
                  <p className="text-sm text-yellow-400 mt-2">
                    The correct answer is <strong>{String.fromCharCode(65 + currentCsat.ans)}. {currentCsat.opts[currentCsat.ans]}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <button onClick={prevCsat} className="btn-secondary btn-sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>Streak: <span className="font-bold text-yellow-500">{csatStats.streak}</span></span>
                <span>Accuracy: {csatStats.total > 0 ? Math.round((csatStats.correct / csatStats.total) * 100) : 0}%</span>
              </div>
              <button onClick={nextCsat} className="btn-primary btn-sm">
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <StatCard label="Correct" value={csatStats.correct} color="green" icon={CheckCircle} />
              <StatCard label="Total" value={csatStats.total} color="blue" icon={Target} />
              <StatCard label="Streak" value={csatStats.streak} color="yellow" icon={Flame} />
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={prevCsat} className="flex-1 btn-secondary btn-sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              <button onClick={nextCsat} className="flex-1 btn-primary btn-sm">
                Shuffle <RotateCcw className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'psych' && (
          <div className="space-y-4 animate-fade-slide-up">
            <PsychCard 
              key={psychIndex}
              title={currentPsych.title}
              content={currentPsych.content}
              tags={currentPsych.tags}
              index={psychIndex}
              total={PSYCH_CARDS.length}
              onPrev={prevPsych}
              onNext={nextPsych}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <div className="card p-3 text-center">
      <Icon className={cn('h-5 w-5 mx-auto mb-1', `text-${color}-500`)} />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function PsychCard({ title, content, tags, index, total, onPrev, onNext }: { 
  title: string; content: string; tags: string[]; index: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500">Card {index + 1}/{total}</span>
      </div>
      <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        {title}
      </h3>
      <p className="text-slate-300 mb-4 leading-relaxed">{content}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <button onClick={onPrev} className="btn-secondary btn-sm">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </button>
        <span className="text-xs text-slate-500">{index + 1}/{total}</span>
        <button onClick={onNext} className="btn-primary btn-sm">
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// ─── Notification Bell ───
export function NotificationBell() {
  const { notifications, addNotification, markNotificationRead, clearNotifications } = useUIStore();
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5 text-slate-400 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-950 border border-slate-700 rounded-xl shadow-xl z-50 animate-fade-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            {notifications.length > 0 && (
              <button onClick={clearNotifications} className="text-xs text-slate-500 hover:text-white">
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {notifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={cn('w-full p-4 text-left hover:bg-slate-800 transition-colors', !notification.read && 'bg-slate-800/50')}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('w-2 h-2 rounded-full mt-1 flex-shrink-0',
                        notification.type === 'success' && 'bg-green-500',
                        notification.type === 'error' && 'bg-red-500',
                        notification.type === 'warning' && 'bg-yellow-500',
                        notification.type === 'info' && 'bg-blue-500',
                        notification.type === 'achievement' && 'bg-yellow-500',
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium text-white', !notification.read && 'font-bold')}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700">
              <button onClick={clearNotifications} className="w-full text-sm text-slate-500 hover:text-white">
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useRef } from 'react';