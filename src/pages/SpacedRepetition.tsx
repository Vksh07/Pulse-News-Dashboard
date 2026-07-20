// ════════════════════════════════════════════════════
// PULSE — Spaced Repetition Page
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store';
import { useSRStore } from '../store';
import { useGamificationStore } from '../store';
import { Brain, RotateCcw, CheckCircle, XCircle, Clock, Plus, BookOpen, TrendingUp, Target, Zap } from 'lucide-react';
import { formatRelativeTime, cn } from '../utils';
import { formatISTTime } from '../utils/date';

interface SRCard {
  id: string;
  question: string;
  answer: string;
  category: 'csat' | 'pyq' | 'concept';
  subCategory: string;
  difficulty: number;
  interval: number;
  nextReview: string;
  easeFactor: number;
  repetitions: number;
  lastReviewed?: string;
  createdAt: string;
}

const CATEGORY_COLORS = {
  csat: 'bg-blue-500/20 text-blue-400',
  pyq: 'bg-green-500/20 text-green-400',
  concept: 'bg-purple-500/20 text-purple-400',
};

const CATEGORY_LABELS = {
  csat: 'CSAT',
  pyq: 'PYQ',
  concept: 'Concept',
};

export function SpacedRepetition() {
  const { setCurrentPage } = useUIStore();
  const { awardXP } = useGamificationStore();
  const { cards, dueToday, addCard, reviewCard, getDueCards } = useSRStore();

  const [showAdd, setShowAdd] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    category: 'csat' as 'csat' | 'pyq' | 'concept',
    subCategory: '',
    difficulty: 2,
  });
  const [stats, setStats] = useState({ total: 0, due: 0, reviewed: 0, mastery: 0 });

  useEffect(() => {
    setCurrentPage('sr');
    const due = getDueCards();
    const reviewed = cards.filter(c => c.lastReviewed).length;
    const mastery = cards.length > 0 
      ? Math.round(cards.reduce((a, b) => a + b.easeFactor, 0) / cards.length * 20) 
      : 0;
    setStats({ 
      total: cards.length, 
      due: due.length, 
      reviewed, 
      mastery 
    });
  }, [cards, getDueCards, setCurrentPage]);

  const handleAddCard = () => {
    if (!newCard.question || !newCard.answer || !newCard.subCategory) return;
    addCard({
      ...newCard,
      interval: 1,
      nextReview: new Date().toISOString(),
      easeFactor: 2.5,
      repetitions: 0,
    });
    setNewCard({ question: '', answer: '', category: 'csat', subCategory: '', difficulty: 2 });
    setShowAdd(false);
    awardXP(5);
  };

  const startReview = (cardId: string) => {
    setReviewing(cardId);
    setShowAnswer(false);
  };

  const handleQuality = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!reviewing) return;
    reviewCard(reviewing, quality);
    awardXP(quality >= 3 ? 10 : 5);
    setReviewing(null);
    setShowAnswer(false);
  };

  const dueCards = dueToday || getDueCards();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7 text-purple-500" />
            Spaced Repetition
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Smart review scheduling • Remember forever</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary btn-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-4 border-l-4 border-purple-500">
          <p className="text-xs text-slate-500 mb-1">Total Cards</p>
          <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
        </div>
        <div className="card p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-slate-500 mb-1">Due Today</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.due}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-xs text-slate-500 mb-1">Reviewed</p>
          <p className="text-2xl font-bold text-green-400">{stats.reviewed}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-500">
          <p className="text-xs text-slate-500 mb-1">Mastery</p>
          <p className="text-2xl font-bold text-blue-400">{stats.mastery}%</p>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAdd && (
        <div className="dialog-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="dialog max-w-md">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Review Card
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Question</label>
                <textarea
                  value={newCard.question}
                  onChange={e => setNewCard({...newCard, question: e.target.value})}
                  className="input min-h-[100px]"
                  placeholder="What is the capital of France?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Answer</label>
                <textarea
                  value={newCard.answer}
                  onChange={e => setNewCard({...newCard, answer: e.target.value})}
                  className="input min-h-[80px]"
                  placeholder="Paris"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select
                    value={newCard.category}
                    onChange={e => setNewCard({...newCard, category: e.target.value as 'csat' | 'pyq' | 'concept'})}
                    className="input"
                  >
                    <option value="csat">CSAT Practice</option>
                    <option value="pyq">PYQ</option>
                    <option value="concept">Concept</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Sub-category</label>
                  <input
                    value={newCard.subCategory}
                    onChange={e => setNewCard({...newCard, subCategory: e.target.value})}
                    className="input"
                    placeholder="Percentages, Polity, etc."
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Difficulty: {newCard.difficulty}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newCard.difficulty}
                  onChange={e => setNewCard({...newCard, difficulty: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleAddCard} className="flex-1 btn-primary">Add Card</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Due Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Due for Review ({dueCards.length})
          </h2>
          {dueCards.length > 0 && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">
              Review now → +{dueCards.length * 10} XP
            </span>
          )}
        </div>

        {dueCards.length === 0 ? (
          <div className="card p-8 text-center">
            <Brain className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">All caught up! 🎉</p>
            <p className="text-sm text-slate-500">No cards due for review right now.</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 btn-primary btn-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add a card
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dueCards.map(card => (
              <ReviewCard
                key={card.id}
                card={card}
                onReview={startReview}
                isReviewing={reviewing === card.id}
                showAnswer={showAnswer}
              />
            ))}
          </div>
        )}

        {/* All Cards List */}
        <details className="card mt-6">
          <summary className="p-4 cursor-pointer flex items-center justify-between">
            <span className="font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Cards ({cards.length})
            </span>
          </summary>
          <div className="px-4 pb-4">
            {cards.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No cards yet. Add your first card!</p>
            ) : (
              <div className="space-y-2">
                {cards.map((card: SRCard) => (
                  <div key={card.id} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CATEGORY_COLORS[card.category])}>
                          {CATEGORY_LABELS[card.category]}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">{card.subCategory}</span>
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Ease: {card.easeFactor.toFixed(1)}</span>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">Reps: {card.repetitions}</span>
                      </div>
                      <p className="text-white truncate">{card.question}</p>
                      <p className="text-slate-500 text-sm truncate mt-1">{card.answer}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Next: {formatRelativeTime(card.nextReview)}</span>
                      <span>Interval: {card.interval}d</span>
                      <button
                        onClick={() => startReview(card.id)}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </details>
      </section>

      {/* Review Modal */}
      {reviewing && (
        <div className="dialog-overlay" onClick={e => e.target === e.currentTarget && (setShowAnswer(false), setReviewing(null))}>
          <div className="dialog max-w-2xl">
            {showAnswer ? (
              <ReviewAnswerCard
                card={cards.find(c => c.id === reviewing)!}
                onQuality={handleQuality}
              />
            ) : (
              <ReviewQuestionCard
                card={cards.find(c => c.id === reviewing)!}
                onShowAnswer={() => setShowAnswer(true)}
                onCancel={() => { setShowAnswer(false); setReviewing(null); }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ card, onReview, isReviewing, showAnswer }: { card: SRCard; onReview: (id: string) => void; isReviewing: boolean; showAnswer: boolean }) {
  return (
    <div className={cn('card p-4 relative', isReviewing && 'ring-2 ring-purple-500')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CATEGORY_COLORS[card.category])}>
              {CATEGORY_LABELS[card.category]}
            </span>
            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">{card.subCategory}</span>
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Ease: {card.easeFactor.toFixed(1)}</span>
            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">Reps: {card.repetitions}</span>
          </div>
          <p className="text-white font-medium">{card.question}</p>
          <p className="text-slate-500 text-sm mt-1 line-clamp-2">{card.answer}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs text-slate-400">
            <p>Next: {formatRelativeTime(card.nextReview)}</p>
            <p>Interval: {card.interval}d</p>
          </div>
          <button
            onClick={() => onReview(card.id)}
            disabled={isReviewing}
            className={cn('px-3 py-2 rounded-lg font-medium text-sm transition-all',
              isReviewing ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            )}
          >
            {isReviewing ? 'Reviewing…' : 'Review Now'}
          </button>
        </div>
      </div>
      {showAnswer && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 animate-fade-slide-up">
          <p className="text-sm text-slate-400 mb-1">Answer:</p>
          <p className="text-white">{card.answer}</p>
        </div>
      )}
    </div>
  );
}

function ReviewQuestionCard({ card, onShowAnswer, onCancel }: { card: SRCard; onShowAnswer: () => void; onCancel: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Review Card</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-white font-medium mb-2">{card.question}</p>
        <p className="text-slate-500">Click "Show Answer" when ready</p>
      </div>
      <button onClick={onShowAnswer} className="w-full btn-primary btn-lg">
        Show Answer
      </button>
    </div>
  );
}

function ReviewAnswerCard({ card, onQuality }: { card: SRCard; onQuality: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void }) {
  const labels = ['Again', 'Hard', 'Good', 'Easy'];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Rate Your Recall</h3>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-white font-medium mb-2">{card.question}</p>
        <p className="text-green-400 font-medium mt-2">{card.answer}</p>
      </div>
      <p className="text-sm text-slate-400 text-center">How well did you remember?</p>
      <div className="grid grid-cols-4 gap-2">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => onQuality(i as 0 | 1 | 2 | 3 | 4 | 5)}
            className={cn('py-3 px-2 rounded-lg font-medium text-sm transition-all',
              i === 0 && 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
              i === 1 && 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30',
              i === 2 && 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
              i === 3 && 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            )}
          >
            <span className="block text-xs text-slate-500 mb-1">{i}s</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}