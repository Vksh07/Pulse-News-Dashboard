// ════════════════════════════════════════════════════
// PULSE — Analytics Page
// ════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../store';
import { useGamificationStore } from '../store';
import { useArticlesStore } from '../store';
import { useUIStore } from '../store';
import { BarChart, LineChart, PieChart, TrendingUp, Target, Award, Brain, Calendar, Clock, Zap, Flame, BookOpen } from 'lucide-react';
import { formatRelativeTime, cn, formatNumber } from '../utils';
import { formatISTTime } from '../utils/date';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const COLORS = {
  primary: '#eab308',
  secondary: '#22c55e',
  danger: '#f87171',
  info: '#60a5fa',
  purple: '#a78bfa',
  orange: '#fb923c',
};

export function Analytics() {
  const { setCurrentPage } = useUIStore();
  const { dailyHistory, achievements } = useProgressStore();
  const { streak, xp, level, articlesRead } = useGamificationStore();
  const { filteredArticles } = useArticlesStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    setCurrentPage('analytics');
    // Generate chart data from history
    const history = dailyHistory.slice(0, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90).reverse();
    
    setChartData({
      labels: history.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Articles Read',
          data: history.map(d => d.articlesRead),
          borderColor: COLORS.primary,
          backgroundColor: COLORS.primary + '20',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'XP Earned',
          data: history.map(d => d.xpEarned),
          borderColor: COLORS.secondary,
          backgroundColor: COLORS.secondary + '20',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Focus Minutes',
          data: history.map(d => d.focusMinutes),
          borderColor: COLORS.info,
          backgroundColor: COLORS.info + '20',
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [timeRange, dailyHistory]);

  // Category distribution from articles
  const categoryData = filteredArticles.reduce((acc, a) => {
    const cat = a.topic || 'india';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalArticles = filteredArticles.length;

  const streakHistory = dailyHistory.slice(-30).map(d => d.articlesRead > 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-yellow-500" />
            Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Your learning journey visualized</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as typeof timeRange)}
            className="input px-3 py-1.5 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <MetricCard
          icon={<Target className="h-5 w-5" />}
          label="Articles Read"
          value={formatNumber(articlesRead)}
          trend={trendCalc(dailyHistory.slice(-7), dailyHistory.slice(-14, -7), 'articlesRead')}
          color="primary"
        />
        <MetricCard
          icon={<Award className="h-5 w-5" />}
          label="Total XP"
          value={formatNumber(xp)}
          trend={trendCalc(dailyHistory.slice(-7), dailyHistory.slice(-14, -7), 'xpEarned')}
          color="secondary"
        />
        <MetricCard
          icon={<Flame className="h-5 w-5" />}
          label="Current Streak"
          value={`${streak}d`}
          trend={streak > 3 ? '+3' : streak > 0 ? '+1' : '0'}
          color="danger"
        />
        <MetricCard
          icon={<Brain className="h-5 w-5" />}
          label="Level"
          value={String(level)}
          trend={level > 1 ? '+1' : '0'}
          color="purple"
        />
        <MetricCard
          icon={<Clock className="h-5 w-5" />}
          label="Focus Time"
          value={`${dailyHistory.slice(-1)[0]?.focusMinutes || 0}m avg`}
          trend={trendCalc(dailyHistory.slice(-7), dailyHistory.slice(-14, -7), 'focusMinutes')}
          color="info"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Trend */}
        <ChartCard title="Activity Trends" subtitle={`${timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} day rolling window`}>
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, labels: { color: '#8b95a5', font: { size: 12 } } },
                  tooltip: { backgroundColor: '#1a1f29', titleColor: '#f2f4f7', bodyColor: '#f2f4f7', borderColor: '#262c36', borderWidth: 1 },
                },
                scales: {
                  x: { grid: { color: '#262c36' }, ticks: { color: '#8b95a5' } },
                  y: { grid: { color: '#262c36' }, ticks: { color: '#8b95a5' }, beginAtZero: true },
                },
                interaction: { mode: 'index', intersect: false },
              }}
            />
          )}
        </ChartCard>

        {/* Category Distribution */}
        <ChartCard title="Reading Distribution" subtitle="By topic category">
          {totalArticles > 0 ? (
            <Doughnut
              data={{
                labels: Object.keys(categoryData),
                datasets: [{
                  data: Object.values(categoryData),
                  backgroundColor: [
                    '#eab308', '#22c55e', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#34d399', '#f472b6', '#38bdf8', '#fde047'
                  ],
                  borderWidth: 0,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#8b95a5', font: { size: 11 } } },
                  tooltip: { backgroundColor: '#1a1f29', titleColor: '#f2f4f7', bodyColor: '#f2f4f7', borderColor: '#262c36', borderWidth: 1 },
                },
                cutout: '60%',
              }}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">No articles to display</div>
          )}
        </ChartCard>

        {/* Weekly Heatmap */}
        <ChartCard title="Weekly Consistency" subtitle="Green = active day" className="lg:col-span-2">
          <WeeklyHeatmap history={dailyHistory.slice(-84)} />
        </ChartCard>

        {/* XP Breakdown */}
        <ChartCard title="XP Sources (Last 30 Days)" subtitle="Where your points come from">
          <XPBreakdown history={dailyHistory.slice(-30)} />
        </ChartCard>
      </div>

      {/* Achievements */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { id: 'first_article', name: 'First Steps', desc: 'Read your first article', icon: '📖', unlocked: articlesRead > 0, rarity: 'common' },
            { id: 'streak_3', name: 'Getting Started', desc: '3-day streak', icon: '🔥', unlocked: streak >= 3, rarity: 'common' },
            { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak', icon: '🗓️', unlocked: streak >= 7, rarity: 'rare' },
            { id: 'streak_30', name: 'Month Master', desc: '30-day streak', icon: '🏆', unlocked: streak >= 30, rarity: 'epic' },
            { id: 'articles_10', name: 'Bookworm', desc: 'Read 10 articles', icon: '📚', unlocked: articlesRead >= 10, rarity: 'common' },
            { id: 'articles_100', name: 'Scholar', desc: 'Read 100 articles', icon: '🎓', unlocked: articlesRead >= 100, rarity: 'rare' },
            { id: 'csat_5', name: 'CSAT Starter', desc: 'Complete 5 CSAT questions', icon: '✏️', unlocked: false, rarity: 'common' },
            { id: 'sr_10', name: 'Memory Keeper', desc: 'Review 10 cards', icon: '🧠', unlocked: false, rarity: 'rare' },
            { id: 'level_5', name: 'Rising Star', desc: 'Reach Level 5', icon: '⭐', unlocked: level >= 5, rarity: 'rare' },
            { id: 'level_10', name: 'Master', desc: 'Reach Level 10', icon: '👑', unlocked: level >= 10, rarity: 'epic' },
            { id: 'focus_60', name: 'Deep Focus', desc: '60 min focus session', icon: '⏱️', unlocked: false, rarity: 'rare' },
            { id: 'perfect_week', name: 'Perfect Week', desc: 'Active all 7 days', icon: '✨', unlocked: streakHistory.filter(Boolean).length === 7, rarity: 'epic' },
          ].map(ach => (
            <AchievementCard key={ach.id} {...ach} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }: { icon: React.ReactNode; label: string; value: string; trend: string; color: keyof typeof COLORS }) {
  const trendPositive = trend.startsWith('+') || trend.startsWith('📈');
  
  return (
    <div className="card p-4 border-l-4" style={{ borderColor: COLORS[color] }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS[color] + '20' }}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className={cn('text-xs font-medium', trendPositive ? 'text-green-400' : 'text-slate-500')}>
        {trend} vs prev period
      </p>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('card p-4', className)}>
      <div className="mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

function WeeklyHeatmap({ history }: { history: any[] }) {
  const weeks = 12;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getDayData = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return history.find(h => h.date === key);
  };

  const grid = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (date.getDay() + 7 * w - d));
      const data = getDayData(date);
      week.push({
        date: date.toISOString().split('T')[0],
        active: data ? data.articlesRead > 0 : false,
        count: data?.articlesRead || 0,
      });
    }
    grid.push(week);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="w-10">Week</span>
        {days.map(d => <span key={d} className="w-8 text-center">{d}</span>)}
      </div>
      <div className="flex flex-col gap-1">
        {grid.map((week, w) => (
          <div key={w} className="flex items-center gap-1">
            <span className="w-10 text-right text-xs text-slate-500">{weeks - w}w</span>
            {week.map((day, d) => (
              <button
                key={`${w}-${d}`}
                className={cn('w-8 h-8 rounded transition-all', 
                  day.active ? 'bg-green-500' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                )}
                title={`${day.date}: ${day.count} articles`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function XPBreakdown({ history }: { history: any[] }) {
  const xpSources = {
    articles: history.reduce((a, b) => a + (b.articlesRead || 0) * 5, 0),
    csat: history.reduce((a, b) => a + (b.csatDone || 0) * 10, 0),
    focus: history.reduce((a, b) => a + Math.floor((b.focusMinutes || 0) / 15) * 20, 0),
    microGoals: history.reduce((a, b) => a + (b.microGoalsCompleted || 0) * 5, 0),
  };

  const total = Object.values(xpSources).reduce((a, b) => a + b, 0);
  const items = Object.entries(xpSources).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percent: total > 0 ? Math.round((value / total) * 100) : 0,
  }));

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="w-24 text-sm text-slate-300">{item.name}</span>
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${item.percent}%` }} />
          </div>
          <span className="w-16 text-right text-sm font-mono text-yellow-500">{item.percent}%</span>
          <span className="w-16 text-right text-xs text-slate-500">{item.value} XP</span>
        </div>
      ))}
      <div className="pt-2 border-t border-slate-700 flex justify-between text-sm">
        <span className="text-slate-400">Total XP</span>
        <span className="font-bold text-yellow-500">{total} XP</span>
      </div>
    </div>
  );
}

function AchievementCard({ name, desc, icon, unlocked, rarity }: { name: string; desc: string; icon: string; unlocked: boolean; rarity: string }) {
  const rarityColors = {
    common: 'bg-slate-700 border-slate-600',
    rare: 'bg-blue-500/20 border-blue-500/30',
    epic: 'bg-purple-500/20 border-purple-500/30',
    legendary: 'bg-yellow-500/20 border-yellow-500/30',
  };

  return (
    <div className={cn('card p-4 text-center transition-all', unlocked ? rarityColors[rarity as keyof typeof rarityColors] : 'bg-slate-800/50 border-slate-700 opacity-50')}>
      <div className="text-4xl mb-2">{unlocked ? icon : '🔒'}</div>
      <h4 className="font-semibold text-white mb-1">{unlocked ? name : '???'}</h4>
      <p className="text-xs text-slate-400">{unlocked ? desc : 'Locked'}</p>
      {unlocked && <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">{rarity}</span>}
    </div>
  );
}

function trendCalc(current: any[], previous: any[], field: string): string {
  if (!current.length || !previous.length) return '0';
  const currAvg = current.reduce((a, b) => a + (b[field] || 0), 0) / current.length;
  const prevAvg = previous.reduce((a, b) => a + (b[field] || 0), 0) / previous.length;
  if (prevAvg === 0) return currAvg > 0 ? '📈 New' : '0';
  const change = ((currAvg - prevAvg) / prevAvg) * 100;
  return change > 0 ? `📈 +${Math.round(change)}%` : change < 0 ? `📉 ${Math.round(change)}%` : '➡️ 0%';
}