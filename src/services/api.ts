// ════════════════════════════════════════════════════
// PULSE — API Service
// ════════════════════════════════════════════════════

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  Article,
  BreakingArticle,
  StatusResponse,
  Topic,
  RSSFeed,
  GamificationState,
  UserProgress,
  SpacedRepetitionCard,
  FocusSession,
  SubscriptionTier,
  OnboardingState,
  APIResponse,
  APIError,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('pulse_auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('pulse_auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ─── Articles ───
  async getStatus(): Promise<StatusResponse> {
    const { data } = await this.client.get<StatusResponse>('/status.json');
    return data;
  }

  async getArticles(params?: { topic?: string; limit?: number }): Promise<Article[]> {
    const status = await this.getStatus();
    let articles = status.articles;

    if (params?.topic && params.topic !== 'all') {
      articles = articles.filter(a => a.topic === params.topic);
    }

    if (params?.limit) {
      articles = articles.slice(0, params.limit);
    }

    return articles;
  }

  async getBreaking(): Promise<BreakingArticle[]> {
    const { data } = await this.client.get<{ breaking: BreakingArticle[] }>('/breaking.json');
    return data.breaking;
  }

  async rescan(): Promise<void> {
    await this.client.post('/rescan');
  }

  // ─── Topics & Feeds ───
  async getFeeds(): Promise<{ topics: Topic[]; rss_feeds: RSSFeed[] }> {
    const { data } = await this.client.get<{ topics: Topic[]; rss_feeds: RSSFeed[] }>('/feeds.json');
    return data;
  }

  async updateFeeds(feeds: { rss_feeds?: RSSFeed[]; topics?: Topic[] }): Promise<void> {
    await this.client.post('/feeds.json', { action: 'save_all', ...feeds });
  }

  async addRSSFeed(feed: Omit<RSSFeed, 'enabled'>): Promise<void> {
    await this.client.post('/feeds.json', { action: 'add_rss', ...feed, enabled: true });
  }

  async removeRSSFeed(id: string): Promise<void> {
    await this.client.post('/feeds.json', { action: 'remove_rss', id });
  }

  async toggleRSSFeed(id: string, enabled: boolean): Promise<void> {
    await this.client.post('/feeds.json', { action: 'toggle_rss', id, enabled });
  }

  async addTopic(topic: Omit<Topic, 'enabled'>): Promise<void> {
    await this.client.post('/feeds.json', { action: 'add_topic', ...topic, enabled: true });
  }

  async removeTopic(id: string): Promise<void> {
    await this.client.post('/feeds.json', { action: 'remove_topic', id });
  }

  async toggleTopic(id: string, enabled: boolean): Promise<void> {
    await this.client.post('/feeds.json', { action: 'toggle_topic', id, enabled });
  }

  async resetFeeds(): Promise<void> {
    await this.client.post('/feeds.json', { action: 'reset' });
  }

  // ─── UPSC Feed ───
  async getUPSCFeed(limit = 20): Promise<Article[]> {
    const { data } = await this.client.get<{ articles: Article[] }>('/upsc-feed.json');
    return data.articles.slice(0, limit);
  }

  async getDigest(): Promise<DigestResponse> {
    const { data } = await this.client.get<DigestResponse>('/breaking-digest.json');
    return data;
  }

  async getEarnings(): Promise<{ daily_goal: number; daily_progress: number; lanes: unknown[] }> {
    const { data } = await this.client.get('/api/earnings.json');
    return data;
  }

  async getPipelineHealth(): Promise<{ zfinance: unknown; economy_brief: unknown }> {
    const { data } = await this.client.get('/api/pipeline-health.json');
    return data;
  }

  // ─── Bookmarks ───
  async getBookmarks(): Promise<Article[]> {
    const { data } = await this.client.get<{ bookmarks: Article[] }>('/bookmarks.json');
    return data.bookmarks;
  }

  async addBookmark(article: Article): Promise<void> {
    await this.client.post('/bookmarks.json', { action: 'add', ...article });
  }

  async removeBookmark(url: string): Promise<void> {
    await this.client.post('/bookmarks.json', { action: 'remove', url });
  }

  async clearBookmarks(): Promise<void> {
    await this.client.post('/bookmarks.json', { action: 'clear' });
  }

  // ─── Auth (placeholder for future backend) ───
  async login(email: string, password: string): Promise<{ token: string; user: UserProgress }> {
    // Simulated for now
    const token = 'simulated-jwt-token';
    localStorage.setItem('pulse_auth_token', token);
    return { token, user: {} as UserProgress };
  }

  async register(email: string, password: string, name: string): Promise<{ token: string; user: UserProgress }> {
    const token = 'simulated-jwt-token';
    localStorage.setItem('pulse_auth_token', token);
    return { token, user: {} as UserProgress };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('pulse_auth_token');
  }

  // ─── User Progress ───
  async getUserProgress(): Promise<UserProgress> {
    const { data } = await this.client.get<APIResponse<UserProgress>>('/api/user/progress');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    const { data } = await this.client.patch<APIResponse<UserProgress>>('/api/user/progress', updates);
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  // ─── Spaced Repetition ───
  async getSRCards(): Promise<SpacedRepetitionCard[]> {
    const { data } = await this.client.get<APIResponse<SpacedRepetitionCard[]>>('/api/sr/cards');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async addSRCard(card: Omit<SpacedRepetitionCard, 'id' | 'createdAt'>): Promise<SpacedRepetitionCard> {
    const { data } = await this.client.post<APIResponse<SpacedRepetitionCard>>('/api/sr/cards', card);
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async reviewSRCard(cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5): Promise<SpacedRepetitionCard> {
    const { data } = await this.client.post<APIResponse<SpacedRepetitionCard>>(`/api/sr/cards/${cardId}/review`, { quality });
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  // ─── Focus Sessions ───
  async getFocusSessions(): Promise<FocusSession[]> {
    const { data } = await this.client.get<APIResponse<FocusSession[]>>('/api/focus/sessions');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async createFocusSession(session: Omit<FocusSession, 'id'>): Promise<FocusSession> {
    const { data } = await this.client.post<APIResponse<FocusSession>>('/api/focus/sessions', session);
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async updateFocusSession(id: string, updates: Partial<FocusSession>): Promise<FocusSession> {
    const { data } = await this.client.patch<APIResponse<FocusSession>>(`/api/focus/sessions/${id}`, updates);
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  // ─── Subscription ───
  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    const { data } = await this.client.get<APIResponse<SubscriptionTier[]>>('/api/subscription/tiers');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async getCurrentSubscription(): Promise<SubscriptionTier> {
    const { data } = await this.client.get<APIResponse<SubscriptionTier>>('/api/subscription/current');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async upgradeSubscription(tierId: 'pro' | 'team'): Promise<SubscriptionTier> {
    const { data } = await this.client.post<APIResponse<SubscriptionTier>>('/api/subscription/upgrade', { tierId });
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  // ─── Onboarding ───
  async getOnboarding(): Promise<OnboardingState> {
    const { data } = await this.client.get<APIResponse<OnboardingState>>('/api/onboarding');
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async updateOnboarding(updates: Partial<OnboardingState>): Promise<OnboardingState> {
    const { data } = await this.client.patch<APIResponse<OnboardingState>>('/api/onboarding', updates);
    if (data.error) throw new Error(data.error.message);
    return data.data!;
  }

  async completeOnboarding(): Promise<void> {
    await this.client.post('/api/onboarding/complete');
  }

  // ─── Health Check ───
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const { data } = await this.client.get('/healthz');
    return data;
  }
}

export const api = new APIService();

// ─── React Query-style hooks (using simple fetch for now) ───
export const createApiHooks = () => {
  return {
    useStatus: () => {
      // Will be implemented with TanStack Query or SWR
      return { data: null, isLoading: false, error: null, refetch: () => {} };
    },
    useArticles: (topic?: string) => {
      return { data: [], isLoading: false, error: null, refetch: () => {} };
    },
    useBreaking: () => {
      return { data: [], isLoading: false, error: null, refetch: () => {} };
    },
  };
};