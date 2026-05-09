/**
 * Local Analytics System
 * Provides full analytics functionality with localStorage persistence
 */

export interface AnalyticsEvent {
  event: string;
  parameters?: Record<string, any>;
  timestamp: number;
  userId?: string;
}

class LocalAnalytics {
  private enabled: boolean;
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = 'mindtrace_analytics';
  private readonly MAX_EVENTS = 1000;

  constructor(enabled: boolean) {
    this.enabled = enabled;
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      // Silent fallback for analytics loading
    }
  }

  private saveEvents(): void {
    try {
      // Keep only the most recent events
      if (this.events.length > this.MAX_EVENTS) {
        this.events = this.events.slice(-this.MAX_EVENTS);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      // Silent fallback for analytics saving
    }
  }

  private addEvent(event: string, parameters?: Record<string, any>, userId?: string): void {
    if (!this.enabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      parameters,
      timestamp: Date.now(),
      userId
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // Log in development for debugging
    if (import.meta.env.DEV ?? false) {
      console.log(`📊 Analytics Event: ${event}`, parameters || {});
    }
  }

  // Page tracking
  trackPageView(page: string, userId?: string): void {
    this.addEvent('page_view', { page }, userId);
  }

  // User interactions
  trackClick(element: string, userId?: string): void {
    this.addEvent('click', { element }, userId);
  }

  trackFormSubmit(formName: string, userId?: string): void {
    this.addEvent('form_submit', { formName }, userId);
  }

  // Feature usage
  trackFeature(feature: string, action: string, userId?: string): void {
    this.addEvent('feature_usage', { feature, action }, userId);
  }

  // Thought-related events
  trackThoughtCreated(emotion: string, intensity: number, userId?: string): void {
    this.addEvent('thought_created', { emotion, intensity }, userId);
  }

  trackThoughtUpdated(emotion: string, userId?: string): void {
    this.addEvent('thought_updated', { emotion }, userId);
  }

  trackThoughtDeleted(userId?: string): void {
    this.addEvent('thought_deleted', {}, userId);
  }

  trackThoughtSearched(query: string, resultCount: number, userId?: string): void {
    this.addEvent('thought_searched', { query, resultCount }, userId);
  }

  // Authentication events
  trackSignIn(method: string, userId?: string): void {
    this.addEvent('sign_in', { method }, userId);
  }

  trackSignOut(userId?: string): void {
    this.addEvent('sign_out', {}, userId);
  }

  trackSignUp(method: string, userId?: string): void {
    this.addEvent('sign_up', { method }, userId);
  }

  // Error tracking
  trackError(error: string, context?: string, userId?: string): void {
    this.addEvent('error', { error, context }, userId);
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, userId?: string): void {
    this.addEvent('performance', { metric, value }, userId);
  }

  // Custom events
  track(event: string, parameters?: Record<string, any>, userId?: string): void {
    this.addEvent(event, parameters, userId);
  }

  // Analytics data access
  getEvents(userId?: string, limit?: number): AnalyticsEvent[] {
    let filteredEvents = userId 
      ? this.events.filter(event => event.userId === userId)
      : this.events;

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);

    return limit ? filteredEvents.slice(0, limit) : filteredEvents;
  }

  getEventCounts(userId?: string): Record<string, number> {
    const events = userId 
      ? this.events.filter(event => event.userId === userId)
      : this.events;

    const counts: Record<string, number> = {};
    events.forEach(event => {
      counts[event.event] = (counts[event.event] || 0) + 1;
    });

    return counts;
  }

  getPopularPages(userId?: string, limit: number = 10): Array<{ page: string; views: number }> {
    const events = userId 
      ? this.events.filter(event => event.userId === userId && event.event === 'page_view')
      : this.events.filter(event => event.event === 'page_view');

    const pageViews: Record<string, number> = {};
    events.forEach(event => {
      const page = event.parameters?.page || 'unknown';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });

    return Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  getFeatureUsage(userId?: string): Record<string, number> {
    const events = userId 
      ? this.events.filter(event => event.userId === userId && event.event === 'feature_usage')
      : this.events.filter(event => event.event === 'feature_usage');

    const usage: Record<string, number> = {};
    events.forEach(event => {
      const feature = event.parameters?.feature || 'unknown';
      usage[feature] = (usage[feature] || 0) + 1;
    });

    return usage;
  }

  // Utility methods
  clearEvents(): void {
    this.events = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportEvents(userId?: string): string {
    const events = this.getEvents(userId);
    return JSON.stringify(events, null, 2);
  }

  isAnalyticsEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global analytics instance
let analytics: LocalAnalytics | null = null;

// Initialize analytics system
export function initializeAnalytics(enabled: boolean): void {
  analytics = new LocalAnalytics(enabled);
}

// Get analytics instance
export function getAnalytics(): LocalAnalytics | null {
  return analytics;
}

// Local analytics hook
export function useAnalytics(userId?: string) {
  const analytics = getAnalytics();
  
  const track = (event: string, parameters?: Record<string, any>) => {
    if (analytics) {
      analytics.track(event, parameters, userId);
    }
  };
  
  const trackPageView = (page: string) => {
    if (analytics) {
      analytics.trackPageView(page, userId);
    }
  };
  
  const getEvents = (limit?: number) => {
    return analytics ? analytics.getEvents(userId, limit) : [];
  };
  
  const clearEvents = () => {
    if (analytics) {
      analytics.clearEvents();
    }
  };
  
  const isEnabled = () => {
    return analytics ? analytics.isAnalyticsEnabled() : false;
  };
  
  return {
    track,
    trackPageView,
    getEvents,
    clearEvents,
    isEnabled,
    trackClick: (element: string) => analytics?.trackClick(element, userId),
    trackFormSubmit: (formName: string) => analytics?.trackFormSubmit(formName, userId),
    trackFeature: (feature: string, action: string) => analytics?.trackFeature(feature, action, userId),
    trackThoughtCreated: (emotion: string, intensity: number) => analytics?.trackThoughtCreated(emotion, intensity, userId),
    trackThoughtUpdated: (emotion: string) => analytics?.trackThoughtUpdated(emotion, userId),
    trackThoughtDeleted: () => analytics?.trackThoughtDeleted(userId),
    trackThoughtSearched: (query: string, resultCount: number) => analytics?.trackThoughtSearched(query, resultCount, userId),
    trackSignIn: (method: string) => analytics?.trackSignIn(method, userId),
    trackSignOut: () => analytics?.trackSignOut(userId),
    trackSignUp: (method: string) => analytics?.trackSignUp(method, userId),
    trackError: (error: string, context?: string) => analytics?.trackError(error, context, userId),
    trackPerformance: (metric: string, value: number) => analytics?.trackPerformance(metric, value, userId),
    getEventCounts: () => analytics?.getEventCounts(userId),
    getPopularPages: (limit?: number) => analytics?.getPopularPages(userId, limit),
    getFeatureUsage: () => analytics?.getFeatureUsage(userId)
  };
}
