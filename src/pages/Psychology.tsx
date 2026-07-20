// ════════════════════════════════════════════════════
// PULSE — Psychology Optional Page (Tutor Agent OC)
// ════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useUIStore } from '../store';
import { Brain, BookOpen, CheckCircle, ChevronRight, Star, Target, Users, BarChart3, Lightbulb, Activity, Fingerprint, Eye, Heart, Sigma, FileText, TrendingUp } from 'lucide-react';
import { cn } from '../utils';

// ─── Data ──────────────────────────────────────────

const PAPERS = [
  {
    id: 'paper1',
    label: 'Paper I: Foundations',
    color: 'from-purple-600 to-indigo-700',
    units: [
      { id: 1, name: 'Introduction to Psychology', theorists: 'Wundt, James, Freud', status: 'done' },
      { id: 2, name: 'Methods of Psychology', theorists: 'Ebbinghaus, Pavlov, Skinner', status: 'done' },
      { id: 3, name: 'Biological Basis of Behaviour', theorists: 'Hebb, Lashley, Sperry', status: 'in_progress' },
      { id: 4, name: 'Sensation, Attention & Perception', theorists: 'Gibson, Gregory, Wertheimer', status: 'pending' },
      { id: 5, name: 'Learning', theorists: 'Pavlov, Skinner, Bandura, Tolman', status: 'pending' },
      { id: 6, name: 'Memory', theorists: 'Atkinson-Shiffrin, Baddeley, Tulving', status: 'pending' },
      { id: 7, name: 'Thinking & Problem Solving', theorists: 'Kohler, Newell, Simon, Kahneman', status: 'intake' },
      { id: 8, name: 'Motivation & Emotion', theorists: 'Maslow, Cannon-Bard, Schachter-Singer', status: 'pending' },
      { id: 9, name: 'Intelligence & Aptitude', theorists: 'Spearman, Thurstone, Gardner, Sternberg', status: 'pending' },
      { id: 10, name: 'Personality', theorists: 'Freud, Allport, Eysenck, Cattell, Rogers', status: 'intake' },
      { id: 11, name: 'Language & Communication', theorists: 'Chomsky, Whorf, Vygotsky', status: 'pending' },
    ],
  },
  {
    id: 'paper2',
    label: 'Paper II: Applications',
    color: 'from-emerald-600 to-teal-700',
    units: [
      { id: 12, name: 'Psychological Testing', theorists: 'Binet, Wechsler, MMPI, TAT', status: 'pending' },
      { id: 13, name: 'Applied Psychology to Organisations', theorists: 'Taylor, Mayo, Herzberg', status: 'pending' },
      { id: 14, name: 'Educational Psychology', theorists: 'Piaget, Vygotsky, Montessori', status: 'pending' },
      { id: 15, name: 'Clinical Psychology', theorists: 'Freud, Beck, Ellis, Rogers', status: 'pending' },
      { id: 16, name: 'Social Psychology', theorists: 'Festinger, Asch, Milgram, Zimbardo', status: 'pending' },
      { id: 17, name: 'Community Psychology', theorists: 'Rappaport, Kelly', status: 'pending' },
    ],
  },
];

const THEORISTS = [
  { name: 'Sigmund Freud', school: 'Psychoanalysis', concepts: 'Id/Ego/Superego, Psychosexual stages, Defence mechanisms', paper: 'I & II' },
  { name: 'B.F. Skinner', school: 'Behaviourism', concepts: 'Operant conditioning, Reinforcement schedules', paper: 'I' },
  { name: 'Albert Bandura', school: 'Social Learning', concepts: 'Observational learning, Self-efficacy, Reciprocal determinism', paper: 'I & II' },
  { name: 'Jean Piaget', school: 'Cognitive Development', concepts: 'Stages of development, Schemas, Assimilation/Accommodation', paper: 'II' },
  { name: 'Abraham Maslow', school: 'Humanistic', concepts: 'Hierarchy of needs, Self-actualization, Peak experiences', paper: 'I & II' },
  { name: 'Carl Rogers', school: 'Humanistic', concepts: 'Unconditional positive regard, Self-concept, Client-centred therapy', paper: 'I & II' },
  { name: 'John B. Watson', school: 'Behaviourism', concepts: 'Classical conditioning adaptation, Little Albert', paper: 'I' },
  { name: 'Ivan Pavlov', school: 'Behaviourism', concepts: 'Classical conditioning, Conditioned reflexes', paper: 'I' },
  { name: 'Wilhelm Wundt', school: 'Structuralism', concepts: 'Introspection, Experimental psychology, Voluntarism', paper: 'I' },
  { name: 'William James', school: 'Functionalism', concepts: 'Stream of consciousness, James-Lange theory of emotion', paper: 'I' },
  { name: 'Lev Vygotsky', school: 'Sociocultural', concepts: 'ZPD, Scaffolding, Language & thought', paper: 'I & II' },
  { name: 'Leon Festinger', school: 'Social Psychology', concepts: 'Cognitive dissonance, Social comparison', paper: 'II' },
  { name: 'Solomon Asch', school: 'Social Psychology', concepts: 'Conformity experiments, Group pressure', paper: 'II' },
  { name: 'Stanley Milgram', school: 'Social Psychology', concepts: 'Obedience to authority, Milgram experiment', paper: 'II' },
  { name: 'Hans Eysenck', school: 'Trait Theory', concepts: 'PEN model (Psychoticism, Extraversion, Neuroticism)', paper: 'I' },
  { name: 'Aaron Beck', school: 'Cognitive Therapy', concepts: 'Cognitive triad, Cognitive distortions, CT for depression', paper: 'II' },
  { name: 'Howard Gardner', school: 'Multiple Intelligences', concepts: '8 types of intelligence, MI theory', paper: 'I' },
  { name: 'Robert Sternberg', school: 'Triarchic Theory', concepts: 'Analytical, Creative, Practical intelligence', paper: 'I' },
  { name: 'Noam Chomsky', school: 'Psycholinguistics', concepts: 'LAD, Universal grammar, Surface vs deep structure', paper: 'I' },
  { name: 'Martin Seligman', school: 'Positive Psychology', concepts: 'Learned helplessness, PERMA, Authentic happiness', paper: 'I & II' },
];

const STATUS_LABELS: Record<string, string> = {
  done: 'Completed',
  in_progress: 'In Progress',
  pending: 'Pending',
  intake: 'Intake Ready',
};

const STATUS_COLORS: Record<string, string> = {
  done: 'bg-green-500/20 text-green-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-slate-500/20 text-slate-400',
  intake: 'bg-yellow-500/20 text-yellow-400',
};

// ─── Components ────────────────────────────────────

function UnitCard({ unit }: { unit: typeof PAPERS[0]['units'][0] }) {
  return (
    <div className="card flex items-center justify-between hover:border-purple-500/40 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={cn('p-1.5 rounded-lg', STATUS_COLORS[unit.status])}>
          {unit.status === 'done' ? <CheckCircle className="h-4 w-4" /> :
           unit.status === 'in_progress' ? <Activity className="h-4 w-4" /> :
           unit.status === 'intake' ? <Star className="h-4 w-4" /> :
           <ChevronRight className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white">Unit {unit.id}: {unit.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{unit.theorists}</p>
        </div>
      </div>
      <span className={cn('text-xs px-2 py-0.5 rounded-full', STATUS_COLORS[unit.status])}>
        {STATUS_LABELS[unit.status]}
      </span>
    </div>
  );
}

function TheoristCard({ t, index }: { t: typeof THEORISTS[0]; index: number }) {
  return (
    <div className="card flex items-start gap-3 hover:border-purple-500/30 transition-colors" style={{ animationDelay: `${index * 30}ms` }}>
      <div className="p-2 bg-purple-500/10 rounded-lg mt-0.5 shrink-0">
        <Users className="h-4 w-4 text-purple-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{t.name}</p>
        <p className="text-xs text-purple-400">{t.school}</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.concepts}</p>
        <span className="inline-block text-[10px] text-slate-500 mt-1.5 bg-slate-800 px-2 py-0.5 rounded-full">
          Paper {t.paper}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────

export function Psychology() {
  const { setCurrentPage } = useUIStore();
  const [activeTab, setActiveTab] = useState<'units' | 'theorists' | 'progress'>('units');

  React.useEffect(() => {
    setCurrentPage('psychology');
  }, [setCurrentPage]);

  const totalUnits = PAPERS.flatMap(p => p.units).length;
  const doneUnits = PAPERS.flatMap(p => p.units).filter(u => u.status === 'done').length;
  const inProgressUnits = PAPERS.flatMap(p => p.units).filter(u => u.status === 'in_progress' || u.status === 'intake').length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 rounded-xl">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Psychology Optional</h1>
            <p className="text-xs text-slate-400">UPSC CSE — Paper I & II</p>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-full">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
            <span className="text-green-400 font-semibold">{doneUnits}/{totalUnits}</span>
            <span className="text-slate-400">units</span>
          </div>
          {inProgressUnits > 0 && (
            <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-full">
              <Activity className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-blue-400 font-semibold">{inProgressUnits}</span>
              <span className="text-slate-400">active</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Overall Progress</span>
          <span className="text-xs text-slate-400">{Math.round((doneUnits / totalUnits) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(doneUnits / totalUnits) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'units', label: 'Units', icon: BookOpen },
          { id: 'theorists', label: 'Key Theorists', icon: Users },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          {PAPERS.map(paper => (
            <div key={paper.id}>
              <div className={cn('bg-gradient-to-r p-3 rounded-xl mb-3', paper.color)}>
                <h2 className="text-sm font-bold text-white">{paper.label}</h2>
                <p className="text-xs text-white/70 mt-0.5">{paper.units.length} units · {
                  paper.units.filter(u => u.status === 'done').length
                } completed</p>
              </div>
              <div className="space-y-2">
                {paper.units.map(u => <UnitCard key={u.id} unit={u} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'theorists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THEORISTS.map((t, i) => <TheoristCard key={t.name} t={t} index={i} />)}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              Paper I Coverage
            </h3>
            <div className="space-y-2">
              {PAPERS[0].units.map(u => (
                <div key={u.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Unit {u.id}: {u.name}</span>
                  <span className={cn('px-2 py-0.5 rounded-full', STATUS_COLORS[u.status])}>
                    {STATUS_LABELS[u.status]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                {PAPERS[0].units.filter(u => u.status === 'done').length}/{PAPERS[0].units.length} units
                ({Math.round((PAPERS[0].units.filter(u => u.status === 'done').length / PAPERS[0].units.length) * 100)}%)
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Paper II Coverage
            </h3>
            <div className="space-y-2">
              {PAPERS[1].units.map(u => (
                <div key={u.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Unit {u.id}: {u.name}</span>
                  <span className={cn('px-2 py-0.5 rounded-full', STATUS_COLORS[u.status])}>
                    {STATUS_LABELS[u.status]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                {PAPERS[1].units.filter(u => u.status === 'done').length}/{PAPERS[1].units.length} units
                ({Math.round((PAPERS[1].units.filter(u => u.status === 'done').length / PAPERS[1].units.length) * 100)}%)
              </p>
            </div>
          </div>

          <div className="md:col-span-2 card">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              Study Strategy
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Focus on Units 7 (Thinking) & 10 (Personality) — intake stage, convert to notes</li>
              <li>Prioritize Paper II applied units — connect current affairs (e.g., NEP for Educational Psychology)</li>
              <li>Cross-link theorists to PYQs — 70% of questions name-specific</li>
              <li>Use UPSC Lens (filter Optional: Psychology) for current affairs tagged to Psych syllabus</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
