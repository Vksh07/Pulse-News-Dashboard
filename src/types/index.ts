// ════════════════════════════════════════════════════
// PULSE — Core Types
// ════════════════════════════════════════════════════

export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  topic: string;
  published: string;
  snippet?: string;
  fetchSource?: string;
  published_dt?: string;
  image?: string;
  upsc?: UPSCData;
  intensityScore?: number;
  economy_score?: number;
  read?: boolean;
  bookmarked?: boolean;
}

export interface UPSCData {
  tags: string[];
  papers: string[];
  score: number;
}

export interface Topic {
  id: string;
  label: string;
  query?: string;
  enabled?: boolean;
}

export interface RSSFeed {
  id: string;
  url: string;
  enabled: boolean;
}

export interface BreakingArticle extends Article {
  intensityScore: number;
}

export interface StatusResponse {
  windowHours: number;
  count: number;
  articles: Article[];
  breaking: BreakingArticle[];
  updatedAt: string;
}

export interface GamificationState {
  streak: number;
  xp: number;
  articlesRead: number;
  lastDate: string | null;
  dailyCount: number;
  dailyGoal: number;
  level: number;
  streakDate?: string;
}

export interface MicroGoal {
  id: string;
  label: string;
  xp: number;
}

export interface MicroGoalState {
  active: string | null;
  chain: number;
  completed: number;
  date: string;
  elapsed?: number;
}

export interface UserPreferences {
  focusMode: boolean;
  upscLens: boolean;
  energyMode: boolean;
  focusShield: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string;
  fontSize: 'sm' | 'md' | 'lg';
  readingSpeed: number; // words per minute
  autoRefresh: boolean;
  refreshInterval: number; // ms
}

export interface UserProgress {
  userId: string;
  totalArticlesRead: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  csatStats: CSATStats;
  pyqStats: PYQStats;
  topicCoverage: Record<string, number>;
  dailyHistory: DailyProgress[];
  achievements: Achievement[];
  lastActive: string;
  joinedAt: string;
}

export interface CSATStats {
  totalAttempted: number;
  correct: number;
  accuracy: number;
  byCategory: Record<string, { attempted: number; correct: number }>;
  averageTime: number; // seconds
  streak: number;
}

export interface PYQStats {
  totalAttempted: number;
  answered: number;
  reviewed: number;
  byPaper: Record<string, number>;
}

export interface DailyProgress {
  date: string;
  articlesRead: number;
  xpEarned: number;
  csatDone: number;
  focusMinutes: number;
  microGoalsCompleted: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SpacedRepetitionCard {
  id: string;
  userId: string;
  question: string;
  answer: string;
  category: 'csat' | 'pyq' | 'concept';
  subCategory: string;
  difficulty: number; // 0-5
  interval: number; // days
  nextReview: string;
  easeFactor: number;
  repetitions: number;
  lastReviewed?: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  type: 'pomodoro' | 'custom' | 'sprint';
  duration: number; // minutes
  completed: boolean;
  startedAt: string;
  endedAt?: string;
  articleId?: string;
  topicId?: string;
}

export interface SubscriptionTier {
  id: 'free' | 'pro' | 'team';
  name: string;
  price: number; // INR per month
  features: string[];
  limits: {
    articlesPerDay: number;
    csatQuestions: number;
    pyqAccess: boolean;
    analytics: boolean;
    exportData: boolean;
    prioritySupport: boolean;
    teamMembers: number;
  };
}

export interface OnboardingState {
  step: number;
  completed: boolean;
  preferences: Partial<UserPreferences>;
  selectedTopics: string[];
  goals: {
    targetArticlesPerDay: number;
    targetCSATPerDay: number;
    targetFocusMinutes: number;
  };
  timezone: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

export interface DigestItem {
  rank: number;
  title: string;
  summary: string;
  source: string;
  published: string;
  url: string;
}

export interface DigestResponse {
  generatedAt: string;
  items: DigestItem[];
}

export interface WebsocketMessage {
  type: 'breaking' | 'article' | 'sync' | 'notification';
  payload: unknown;
  timestamp: string;
}

export type EnergyLevel = 'high' | 'medium' | 'low' | 'rest';

export interface EnergyData {
  level: EnergyLevel;
  percentage: number;
  recommendation: string;
  nextTransition: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}