import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EnergyLevel = 'high' | 'medium' | 'low' | 'rest';

const API_BASE = window.location.origin;

async function fetchJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface ArticlesState {
  articles: any[];
  breaking: any[];
  filteredArticles: any[];
  activeTopics: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  lastRefreshedAt: string | null;
  previousArticleCount: number;
  previousBreakingCount: number;
  newArticleCount: number;
  isFocusMode: boolean;
  isUPSCLens: boolean;
  setArticles: (articles: any[]) => void;
  setBreaking: (breaking: any[]) => void;
  toggleTopic: (topicId: string) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  refresh: (opts?: { force?: boolean; retryOnFail?: boolean }) => Promise<{ newArticles: number; newBreaking: number } | void>;
  resetRefreshError: () => void;
  clearNewCounts: () => void;
  setUPSCLens: (v: boolean) => void;
}

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set, get) => ({
      articles: [],
      breaking: [],
      filteredArticles: [],
      activeTopics: new Set(['india', 'tamilnadu', 'andhra', 'world', 'governance', 'ethics', 'ir_security', 'education', 'economy_industry', 'environment_science', 'society_media', 'sports', 'national_sports', 'international_sports', 'tech_ai', 'health_medicine', 'psychology', 'sexology', 'finance', 'earnings']),
      searchQuery: '',
      isLoading: false,
      error: null,
      lastUpdated: null,
      lastRefreshedAt: null,
      previousArticleCount: 0,
      previousBreakingCount: 0,
      newArticleCount: 0,
      isFocusMode: false,
      isUPSCLens: false,
      setArticles: (articles) => set({ articles, filteredArticles: articles }),
      setBreaking: (breaking) => set({ breaking }),
      toggleTopic: (topicId) =>
        set((state) => {
          const next = new Set(state.activeTopics);
          if (next.has(topicId)) {
            next.delete(topicId);
          } else {
            next.add(topicId);
          }
          return { activeTopics: next };
        }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setLoading: (isLoading) => set({ isLoading }),
      resetRefreshError: () => set({ error: null }),
      clearNewCounts: () => set({ newArticleCount: 0 }),
      refresh: async (opts = {}) => {
        const { force = false, retryOnFail = true } = opts;
        const current = get();
        const shouldRefresh = force || current.lastRefreshedAt === null || current.error !== null || current.isLoading === false;
        if (!shouldRefresh) return;

        const prevArticles = current.previousArticleCount;
        const prevBreaking = current.previousBreakingCount;
        set({ isLoading: true, error: null });
        try {
          const data = await fetchJSON('/status.json');
          const articles = data.articles || [];
          const breaking = data.breaking || [];
          const newArticles = articles.length - prevArticles;
          const newBreaking = breaking.length - prevBreaking;
          const newArticleCount = Math.max(0, articles.length - prevArticles);

          set({
            articles,
            breaking,
            filteredArticles: articles,
            lastUpdated: data.updatedAt || new Date().toISOString(),
            lastRefreshedAt: new Date().toISOString(),
            previousArticleCount: articles.length,
            previousBreakingCount: breaking.length,
            newArticleCount,
            isLoading: false,
          });

          return { newArticles, newBreaking };
        } catch (err: any) {
          const message = err.message || 'Failed to fetch';
          set({ error: message, isLoading: false });
          if (retryOnFail) {
            setTimeout(() => get().refresh({ force: true, retryOnFail: false }), 15000);
          }
          return;
        }
      },
      setUPSCLens: (v) => set({ isUPSCLens: v }),
    }),
    {
      name: 'pulse-articles',
      // Only persist user preferences (activeTopics, searchQuery), not server data (articles, breaking, etc.)
      partialize: (state) => ({
        activeTopics: state.activeTopics,
        searchQuery: state.searchQuery,
        isUPSCLens: state.isUPSCLens,
      }),
      merge: (persisted, current) => {
        const currentIds = new Set(
          (Array.from(current.activeTopics || [])).map(String)
        );
        const persistedActive = (persisted as any)?.activeTopics;
        const mergedActive = persistedActive
          ? new Set([...persistedActive, ...currentIds])
          : new Set(currentIds);
        return {
          ...current,
          activeTopics: mergedActive,
          searchQuery: (persisted as any)?.searchQuery ?? current.searchQuery,
          isUPSCLens: (persisted as any)?.isUPSCLens ?? current.isUPSCLens,
        };
      },
    }
  )
);

export interface UIState {
  currentPage: string;
  theme: string;
  isFocusMode: boolean;
  isUPSCLens: boolean;
  shieldActive: boolean;
  focusShield: boolean;
  bookmarksPanelOpen: boolean;
  socialPanelOpen: boolean;
  feedPanelOpen: boolean;
  pomodoroPanelOpen: boolean;
  tutorPanelOpen: boolean;
  language: string;
  fontSize: string;
  readingSpeed: number;
  autoRefresh: boolean;
  refreshInterval: number;
  focusMode: boolean;
  upscLens: boolean;
  energyMode: boolean;
  energyData: { level: EnergyLevel; percentage: number; recommendation: string; nextTransition: string };
  notifications: any[];
  setCurrentPage: (page: string) => void;
  toggleShield: () => void;
  toggleBookmarks: () => void;
  toggleSocial: () => void;
  toggleFeed: () => void;
  togglePomodoro: () => void;
  setPreferences: (prefs: Partial<UIState>) => void;
  addNotification: (n: any) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updateEnergy: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currentPage: '/',
      theme: 'dark',
      isFocusMode: false,
      isUPSCLens: false,
      shieldActive: false,
      focusShield: false,
      bookmarksPanelOpen: false,
      socialPanelOpen: false,
      feedPanelOpen: false,
      pomodoroPanelOpen: false,
      tutorPanelOpen: false,
      language: 'en',
      fontSize: 'md',
      readingSpeed: 200,
      autoRefresh: true,
      refreshInterval: 300000,
      focusMode: false,
      upscLens: false,
      energyMode: false,
      energyData: { level: 'medium' as EnergyLevel, percentage: 60, recommendation: 'Take a short break', nextTransition: '2h' },
      notifications: [],
      setCurrentPage: (currentPage) => set({ currentPage }),
      toggleShield: () => set((s) => ({ shieldActive: !s.shieldActive, focusShield: !s.focusShield })),
      toggleBookmarks: () => set((s) => ({ bookmarksPanelOpen: !s.bookmarksPanelOpen })),
      toggleSocial: () => set((s) => ({ socialPanelOpen: !s.socialPanelOpen })),
      toggleFeed: () => set((s) => ({ feedPanelOpen: !s.feedPanelOpen })),
      togglePomodoro: () => set((s) => ({ pomodoroPanelOpen: !s.pomodoroPanelOpen })),
      setPreferences: (prefs) => set(prefs),
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n: any) => n.id === id ? { ...n, read: true } : n) })),
      clearNotifications: () => set({ notifications: [] }),
      updateEnergy: () => {
        const h = new Date().getHours();
        let level: EnergyLevel = 'medium';
        let percentage = 60;
        if (h < 6 || h >= 22) { level = 'rest'; percentage = 20; }
        else if (h < 9) { level = 'high'; percentage = 90; }
        else if (h < 12) { level = 'medium'; percentage = 65; }
        else if (h < 15) { level = 'low'; percentage = 40; }
        else if (h < 18) { level = 'medium'; percentage = 55; }
        else { level = 'low'; percentage = 35; }
        set({
          energyData: {
            level,
            percentage,
            recommendation: level === 'high' ? 'Peak focus time!' : level === 'rest' ? 'Time to rest' : 'Pace yourself',
            nextTransition: level === 'high' ? '2h' : '3h',
          },
        });
      },
    }),
    { name: 'pulse-ui' }
  )
);

export interface GamificationState {
  streak: number;
  xp: number;
  articlesRead: number;
  dailyCount: number;
  dailyGoal: number;
  level: number;
  awardXP: (amount: number) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      streak: 0,
      xp: 0,
      articlesRead: 0,
      dailyCount: 0,
      dailyGoal: 10,
      level: 1,
      awardXP: (amount) => set((s) => {
        const newXp = s.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return { xp: newXp, level: newLevel, dailyCount: s.dailyCount + 1 };
      }),
    }),
    { name: 'pulse-gamification' }
  )
);

export interface DailyEntry {
  date: string;
  articlesRead: number;
  xpEarned: number;
  focusMinutes: number;
  csatDone: number;
  microGoalsCompleted: number;
}

export interface ProgressState {
  totalRead: number;
  dailyHistory: DailyEntry[];
  achievements: any[];
  subscriptionTier: { id: string; name: string; price: number };
  addDailyEntry: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      totalRead: 0,
      dailyHistory: [] as DailyEntry[],
      achievements: [],
      subscriptionTier: { id: 'free', name: 'Free', price: 0 },
      addDailyEntry: () => set((s) => {
        const today = new Date().toISOString().slice(0, 10);
        const existing = s.dailyHistory.findIndex((d: DailyEntry) => d.date === today);
        if (existing >= 0) {
          const updated = [...s.dailyHistory];
          updated[existing] = { ...updated[existing], articlesRead: updated[existing].articlesRead + 1 };
          return { totalRead: s.totalRead + 1, dailyHistory: updated };
        }
        return {
          totalRead: s.totalRead + 1,
          dailyHistory: [...s.dailyHistory, { date: today, articlesRead: 1, xpEarned: 0, focusMinutes: 0, csatDone: 0, microGoalsCompleted: 0 }],
        };
      }),
    }),
    { name: 'pulse-progress' }
  )
);

export interface SRState {
  cards: any[];
  due: any[];
  dueToday: any[];
  addCard: (card: any) => void;
  reviewCard: (id: string, quality: number) => void;
  getDueCards: () => any[];
}

export const useSRStore = create<SRState>()(
  persist(
    (set, get) => ({
      cards: [] as any[],
      due: [] as any[],
      dueToday: [] as any[],
      addCard: (card) => set((s) => {
        const newCard = { ...card, id: Date.now().toString(), createdAt: new Date().toISOString(), nextReview: new Date().toISOString() };
        return { cards: [...s.cards, newCard] };
      }),
      reviewCard: (id, quality) => set((s) => {
        const cards = s.cards.map((c: any) =>
          c.id === id ? { ...c, easeFactor: (c.easeFactor || 2.5) + (0.1 * (quality - 2.5)), lastReviewed: new Date().toISOString(), repetitions: (c.repetitions || 0) + 1 } : c
        );
        return { cards };
      }),
      getDueCards: () => {
        const now = new Date().toISOString();
        const due = get().cards.filter((c: any) => c.nextReview <= now);
        set({ due, dueToday: due });
        return due;
      },
    }),
    { name: 'pulse-sr' }
  )
);

export interface MicroGoalsState {
  goals: any[];
  active: string | null;
  chain: number;
  completed: number;
  date: string;
  doneGoals: Set<string>;
  setActiveGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  cancelGoal: () => void;
  resetDaily: () => void;
}

export const useMicroGoalsStore = create<MicroGoalsState>()(
  persist(
    (set, get) => ({
      goals: [] as any[],
      active: null,
      chain: 0,
      completed: 0,
      date: new Date().toISOString().slice(0, 10),
      doneGoals: new Set<string>(),
      setActiveGoal: (id) => set({ active: id }),
      completeGoal: (id) => set((s) => {
        const newDone = new Set(s.doneGoals);
        newDone.add(id);
        return { active: null, doneGoals: newDone, completed: s.completed + 1, chain: s.chain + 1 };
      }),
      cancelGoal: () => set({ active: null, chain: 0 }),
      resetDaily: () => set({ doneGoals: new Set(), completed: 0, active: null, date: new Date().toISOString().slice(0, 10) }),
    }),
    {
      name: 'pulse-microgoals',
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<MicroGoalsState>),
        doneGoals: (persisted as any)?.doneGoals ? new Set((persisted as any).doneGoals) : current.doneGoals,
      }),
    }
  )
);

export interface EnergyStoreState {
  history: { ts: string; level: EnergyLevel }[];
  energyData: { level: EnergyLevel; percentage: number; recommendation: string; nextTransition: string };
  updateEnergy: () => void;
}

export const useEnergyStore = create<EnergyStoreState>()(
  persist(
    (set, get) => ({
      history: [] as any[],
      energyData: { level: 'medium' as EnergyLevel, percentage: 60, recommendation: 'Take a short break', nextTransition: '2h' },
      updateEnergy: () => {
        const h = new Date().getHours();
        let level: EnergyLevel = 'medium';
        let percentage = 60;
        if (h < 6 || h >= 22) { level = 'rest'; percentage = 20; }
        else if (h < 9) { level = 'high'; percentage = 90; }
        else if (h < 12) { level = 'medium'; percentage = 65; }
        else if (h < 15) { level = 'low'; percentage = 40; }
        else if (h < 18) { level = 'medium'; percentage = 55; }
        else { level = 'low'; percentage = 35; }
        const current = get();
        set({
          energyData: {
            level,
            percentage,
            recommendation: level === 'high' ? 'Peak focus time!' : level === 'rest' ? 'Time to rest' : 'Pace yourself',
            nextTransition: level === 'high' ? '2h' : '3h',
          },
          history: [...(current.history || []), { ts: new Date().toISOString(), level }].slice(-96),
        });
      },
    }),
    { name: 'pulse-energy' }
  )
);
