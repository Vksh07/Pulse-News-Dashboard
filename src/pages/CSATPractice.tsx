// ════════════════════════════════════════════════════
// PULSE — CSAT Practice Page
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store';
import { useGamificationStore } from '../store';
import { Target, CheckCircle, XCircle, Clock, RotateCcw, BookOpen, TrendingUp, Award, Brain } from 'lucide-react';
import { cn, formatRelativeTime, escapeHtml } from '../utils';
import { formatISTTime } from '../utils/date';

// CSAT Question Bank (from original app)
const CSAT_BANK = [
  {
    q: 'If 60% of students in a class are boys and the number of girls is 24, what is the total number of students?',
    opts: ['48', '60', '72', '80'],
    ans: 1,
    exp: 'Girls = 40% = 24. Total = 24/40 × 100 = 60.',
    category: 'Percentages',
    difficulty: 1,
  },
  {
    q: 'A train 150m long passes a pole in 15 seconds. What is its speed in km/h?',
    opts: ['36 km/h', '42 km/h', '48 km/h', '54 km/h'],
    ans: 0,
    exp: 'Speed = Distance/Time = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.',
    category: 'Speed, Time & Distance',
    difficulty: 2,
  },
  {
    q: 'If A : B = 2 : 3 and B : C = 4 : 5, then A : C = ?',
    opts: ['8 : 15', '5 : 8', '2 : 5', '3 : 5'],
    ans: 0,
    exp: "A/B = 2/3, B/C = 4/5. A/C = (2/3)×(4/5) = 8/15, so A:C = 8:15.",
    category: 'Ratios & Proportions',
    difficulty: 2,
  },
  {
    q: 'What is the next number in the series: 2, 6, 12, 20, 30, ?',
    opts: ['38', '40', '42', '44'],
    ans: 2,
    exp: 'Pattern: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, so next = 6×7 = 42.',
    category: 'Number Series',
    difficulty: 2,
  },
  {
    q: 'A is the father of B. B is the sister of C. D is the mother of C. How is D related to A?',
    opts: ['Sister', 'Wife', 'Daughter', 'Mother'],
    ans: 1,
    exp: "A is father of B and C, D is mother of C. So D is A's wife.",
    category: 'Blood Relations',
    difficulty: 2,
  },
  {
    q: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    opts: ['Some roses fade quickly', 'All flowers fade quickly', 'None of these', 'All roses are flowers that fade quickly'],
    ans: 2,
    exp: 'We cannot conclude that some roses fade quickly — the "some" may be other flowers. So "None of these" is correct.',
    category: 'Logical Reasoning',
    difficulty: 3,
  },
  {
    q: 'The average weight of 5 people is 60 kg. If one person leaves, the average drops to 58 kg. What is the weight of the person who left?',
    opts: ['62 kg', '64 kg', '66 kg', '68 kg'],
    ans: 3,
    exp: 'Total weight of 5 = 5×60 = 300. Total of 4 = 4×58 = 232. Weight of person who left = 300 - 232 = 68 kg.',
    category: 'Averages',
    difficulty: 2,
  },
  {
    q: 'A man rows 12 km upstream and 28 km downstream taking 5 hours each time. What is the speed of the current?',
    opts: ['1.6 km/h', '2 km/h', '2.4 km/h', '4 km/h'],
    ans: 0,
    exp: 'Upstream speed = 12/5 = 2.4 km/h. Downstream speed = 28/5 = 5.6 km/h. Speed of current = (5.6 - 2.4)/2 = 1.6 km/h.',
    category: 'Boats & Streams',
    difficulty: 3,
  },
  {
    q: 'If the ratio of ages of A and B is 5:3 and the sum of their ages is 64 years, what is the age of A?',
    opts: ['35 years', '40 years', '45 years', '30 years'],
    ans: 1,
    exp: "Let ages be 5x and 3x. 5x + 3x = 64 → 8x = 64 → x = 8. Age of A = 5x = 40 years.",
    category: 'Age Problems',
    difficulty: 1,
  },
  {
    q: 'A and B can do a work in 12 days, B and C in 15 days, C and A in 20 days. How many days will A alone take to complete the work?',
    opts: ['20', '24', '30', '36'],
    ans: 2,
    exp: 'A+B = 1/12, B+C = 1/15, C+A = 1/20. 2(A+B+C) = 1/12+1/15+1/20 = 5/60+4/60+3/60 = 12/60 = 1/5. A+B+C = 1/10. A = (A+B+C) - (B+C) = 1/10 - 1/15 = 1/30. A alone = 30 days.',
    category: 'Time & Work',
    difficulty: 3,
  },
  {
    q: 'The sum of first 20 terms of an AP is 610. If the first term is 2, what is the common difference?',
    opts: ['2', '3', '4', '5'],
    ans: 1,
    exp: 'S₂₀ = 20/2 [2(2) + 19d] = 610 → 10(4 + 19d) = 610 → 4 + 19d = 61 → 19d = 57 → d = 3.',
    category: 'Progressions',
    difficulty: 2,
  },
  {
    q: 'A shopkeeper marks his goods 40% above cost price and allows a discount of 25%. What is his profit percentage?',
    opts: ['5%', '10%', '5.5%', '4.5%'],
    ans: 0,
    exp: 'CP = 100, MP = 140, SP = 140 × 0.75 = 105. Profit = 5%.',
    category: 'Profit & Loss',
    difficulty: 2,
  },
  {
    q: 'In how many ways can 5 boys and 3 girls be seated in a row so that no two girls sit together?',
    opts: ['14400', '28800', '43200', '86400'],
    ans: 0,
    exp: 'Arrange 5 boys: 5! = 120 ways. 6 gaps for 3 girls: P(6,3) = 6×5×4 = 120. Total = 120 × 120 = 14400.',
    category: 'Permutations & Combinations',
    difficulty: 3,
  },
  {
    q: 'A bag contains 4 red, 5 blue, and 6 green balls. Two balls are drawn at random. What is the probability that both are red?',
    opts: ['2/35', '1/15', '4/105', '6/105'],
    ans: 3,
    exp: 'Total ways = C(15,2) = 105. Favorable = C(4,2) = 6. Probability = 6/105 = 2/35.',
    category: 'Probability',
    difficulty: 2,
  },
  {
    q: 'The difference between compound interest and simple interest on ₹10,000 for 2 years at 10% per annum is:',
    opts: ['₹50', '₹100', '₹150', '₹200'],
    ans: 1,
    exp: 'CI = 10000(1.1)² = 12100. SI = 10000×10×2/100 = 2000. Amount with SI = 12000. Difference = 12100 - 12000 = ₹100.',
    category: 'Interest',
    difficulty: 2,
  },
  {
    q: 'If log₂(x) + log₂(x-2) = 3, find x.',
    opts: ['2', '4', '6', '8'],
    ans: 1,
    exp: 'log₂(x(x-2)) = 3 → x(x-2) = 8 → x² - 2x - 8 = 0 → (x-4)(x+2) = 0 → x = 4 (since x > 2).',
    category: 'Logarithms',
    difficulty: 2,
  },
];

interface Question {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  category: string;
  difficulty: number;
}

interface Attempt {
  questionId: number;
  selected: number;
  correct: boolean;
  timeSpent: number;
  timestamp: string;
}

export function CSATPractice() {
  const { setCurrentPage } = useUIStore();
  const { awardXP } = useGamificationStore();

  const [currentSet, setCurrentSet] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [stats, setStats] = useState({ correct: 0, attempted: 0, streak: 0, bestStreak: 0 });
  const [dailyGoal, setDailyGoal] = useState(5);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load new set on mount
  useEffect(() => {
    const shuffled = [...CSAT_BANK].sort(() => Math.random() - 0.5);
    setCurrentSet(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(false);
    setStartTime(Date.now());
  }, []);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('csat_stats');
    if (saved) {
      try { setStats(JSON.parse(saved)); } catch {}
    }
    const savedGoal = localStorage.getItem('csat_daily_goal');
    if (savedGoal) setDailyGoal(Number(savedGoal));
  }, []);

  const saveStats = () => {
    localStorage.setItem('csat_stats', JSON.stringify(stats));
  };

  const question = currentSet[currentIndex];
  const progress = ((currentIndex + 1) / currentSet.length) * 100;
  const correct = showResult && selected !== null && selected === question?.ans;

  const handleSelect = (option: number) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    const timeSpent = Date.now() - startTime;
    const correct = option === question.ans;
    
    const attempt: Attempt = {
      questionId: CSAT_BANK.indexOf(question),
      selected: option,
      correct,
      timeSpent,
      timestamp: new Date().toISOString(),
    };
    
    setAttempts(prev => [...prev, attempt]);
    setStartTime(Date.now());

    const newStats = { ...stats };
    newStats.attempted += 1;
    if (correct) {
      newStats.correct += 1;
      newStats.streak += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
      awardXP(10);
      // Check daily goal
      if (newStats.correct >= dailyGoal && newStats.correct - 1 < dailyGoal) {
        awardXP(50);
      }
    } else {
      newStats.streak = 0;
    }
    setStats(newStats);
    saveStats();
  };

  const nextQuestion = () => {
    if (currentIndex < currentSet.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
      setStartTime(Date.now());
    } else {
      setCompleted(true);
    }
  };

  const newSet = () => {
    const shuffled = [...CSAT_BANK].sort(() => Math.random() - 0.5);
    setCurrentSet(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(false);
    setStartTime(Date.now());
  };

  const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
  const avgTime = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b.timeSpent, 0) / attempts.length / 1000) 
    : 0;

  const categoryStats = CSAT_BANK.reduce((acc, q, i) => {
    if (!acc[q.category]) acc[q.category] = { correct: 0, total: 0 };
    acc[q.category].total += 1;
    const attempt = attempts.find(a => a.questionId === i);
    if (attempt?.correct) acc[q.category].correct += 1;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  if (!question) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Target className="h-7 w-7 text-green-500" />
            CSAT Practice
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Daily quantitative aptitude & logical reasoning</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={newSet} className="btn-secondary btn-sm flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Set
          </button>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500 mb-1">Progress</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{currentIndex + 1}/{currentSet.length}</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 mb-1">Accuracy</p>
          <p className="text-2xl font-bold text-green-500">{accuracy}%</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 mb-1">Streak</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.streak} 🔥</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 mb-1">Avg Time</p>
          <p className="text-2xl font-bold text-blue-500">{avgTime}s</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="card p-6 relative">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
            {question.category}
          </span>
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
            Difficulty: {'★'.repeat(question.difficulty)}{'☆'.repeat(3 - question.difficulty)}
          </span>
          <span className="ml-auto text-sm text-slate-500">Q.{currentIndex + 1}</span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
          {escapeHtml(question.q)}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={cn(
                'csat-option w-full p-4 rounded-lg text-left text-base transition-all border-2',
                showResult && i === question.ans && 'correct border-green-500 bg-green-500/10 text-green-400',
                showResult && i === selected && !correct && 'wrong border-red-500 bg-red-500/10 text-red-400',
                !showResult && selected === i && 'border-yellow-500 bg-yellow-500/10',
                !showResult && selected === null && 'bg-slate-800 border-slate-700 hover:border-yellow-500 hover:bg-slate-700',
                showResult && i !== question.ans && i !== selected && 'border-slate-700 bg-slate-800/50 opacity-60'
              )}
            >
              <span className="font-mono font-bold text-lg mr-3 w-8 inline-block text-yellow-500">
                {String.fromCharCode(65 + i)}.
              </span>
              {escapeHtml(opt)}
              {showResult && i === question.ans && (
                <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
              )}
              {showResult && i === selected && !correct && (
                <XCircle className="ml-auto h-5 w-5 text-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={cn(
            'csat-result p-4 rounded-lg mt-4 animate-fade-slide-up',
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
            <p className="text-slate-300">{escapeHtml(question.exp)}</p>
            {!correct && (
              <p className="text-sm text-yellow-400 mt-2">
                The correct answer is <strong>{String.fromCharCode(65 + question.ans)}. {question.opts[question.ans]}</strong>
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => currentIndex > 0 && (setCurrentIndex(prev => prev - 1), setSelected(null), setShowResult(false), setStartTime(Date.now()))}
            disabled={currentIndex === 0}
            className="btn-secondary btn-sm"
          >
            Previous
          </button>
          <div className="text-sm text-slate-500">
            {currentIndex + 1} of {currentSet.length}
          </div>
          <button
            onClick={nextQuestion}
            disabled={!showResult}
            className={cn('btn-primary btn-sm', !showResult && 'opacity-50 cursor-not-allowed')}
          >
            {currentIndex === currentSet.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      {/* Completion Screen */}
      {completed && (
        <div className="card p-8 text-center animate-pop-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Set Complete!</h2>
          <p className="text-slate-400 mb-6">
            You answered <span className="text-green-500 font-bold">{stats.correct}</span> out of <span className="font-bold">{currentSet.length}</span> correctly
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-green-500">{stats.correct}</p>
              <p className="text-xs text-slate-400">Correct</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">{accuracy}%</p>
              <p className="text-xs text-slate-400">Accuracy</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-yellow-500">{stats.streak}</p>
              <p className="text-xs text-slate-400">Best Streak</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={newSet} className="btn-primary btn-lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              New Set
            </button>
            <button onClick={() => setCurrentIndex(0)} className="btn-secondary btn-lg">
              Retry This Set
            </button>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <details className="card">
        <summary className="p-4 cursor-pointer flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Category Breakdown
          </span>
          <TrendingUp className="h-5 w-5 text-slate-400" />
        </summary>
        <div className="px-4 pb-4 space-y-2">
          {Object.entries(categoryStats).map(([cat, data]) => (
            <div key={cat} className="flex items-center justify-between py-2">
              <span className="text-slate-300">{cat}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-400">{data.correct}/{data.total}</span>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: data.total ? `${(data.correct/data.total)*100}%` : '0%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* Daily Goal */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Daily Goal
          </span>
          <span className="text-sm text-slate-400">{stats.correct}/{dailyGoal} questions</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min((stats.correct / dailyGoal) * 100, 100)}%` }} />
        </div>
        {stats.correct >= dailyGoal && (
          <p className="text-green-400 text-sm mt-2">🎉 Daily goal achieved! +50 XP bonus</p>
        )}
      </div>
    </div>
  );
}