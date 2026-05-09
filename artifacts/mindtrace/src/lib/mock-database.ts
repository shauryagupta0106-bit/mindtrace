/**
 * Working Mock Database with localStorage persistence
 * Provides full CRUD functionality for development
 */

export interface Thought {
  id: string;
  userId: string;
  content: string;
  emotion: string;
  intensity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalThoughts: number;
  averageIntensity: number;
  topEmotion: string;
  recentThoughts: Thought[];
  emotionCounts: Record<string, number>;
}

export interface TimelineEntry {
  id: string;
  thoughtId: string;
  userId: string;
  content: string;
  emotion: string;
  intensity: number;
  tags: string[];
  createdAt: string;
}

class MockDatabase {
  private readonly STORAGE_KEY = 'mindtrace_mock_db';
  private data: {
    thoughts: Thought[];
    users: Array<{ id: string; createdAt: string }>;
  };

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): typeof this.data {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load mock database, using fresh data:', error);
    }

    // Return fresh data with sample content
    return {
      thoughts: this.generateSampleThoughts(),
      users: [{ id: 'mock-user-mindtrace-dev', createdAt: new Date().toISOString() }]
    };
  }

  private saveData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save mock database:', error);
    }
  }

  private generateSampleThoughts(): Thought[] {
    const sampleThoughts: Thought[] = [
      {
        id: 'thought-1',
        userId: 'mock-user-mindtrace-dev',
        content: 'Had a great breakthrough with the new project architecture today. The team really came together.',
        emotion: 'excited',
        intensity: 8,
        tags: ['work', 'achievement', 'team'],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'thought-2',
        userId: 'mock-user-mindtrace-dev',
        content: 'Feeling a bit overwhelmed with the upcoming deadline. Need to prioritize better.',
        emotion: 'anxious',
        intensity: 6,
        tags: ['work', 'stress', 'deadline'],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'thought-3',
        userId: 'mock-user-mindtrace-dev',
        content: 'Morning meditation really helped center my thoughts. Starting the day with clarity.',
        emotion: 'calm',
        intensity: 3,
        tags: ['wellness', 'meditation', 'morning'],
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 'thought-4',
        userId: 'mock-user-mindtrace-dev',
        content: 'Completed the feature ahead of schedule! The client was really impressed with the UI.',
        emotion: 'proud',
        intensity: 9,
        tags: ['work', 'achievement', 'client'],
        createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        updatedAt: new Date(Date.now() - 21600000).toISOString()
      },
      {
        id: 'thought-5',
        userId: 'mock-user-mindtrace-dev',
        content: 'Thinking about trying a new approach to the data visualization. Current charts feel too static.',
        emotion: 'curious',
        intensity: 5,
        tags: ['ideas', 'visualization', 'improvement'],
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    return sampleThoughts;
  }

  // CRUD Operations for Thoughts
  async getThoughts(userId: string): Promise<Thought[]> {
    return this.data.thoughts
      .filter(thought => thought.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getThought(id: string): Promise<Thought | null> {
    return this.data.thoughts.find(thought => thought.id === id) || null;
  }

  async createThought(thought: Omit<Thought, 'id' | 'createdAt' | 'updatedAt'>): Promise<Thought> {
    const newThought: Thought = {
      ...thought,
      id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.thoughts.push(newThought);
    this.saveData();
    return newThought;
  }

  async updateThought(id: string, updates: Partial<Thought>): Promise<Thought | null> {
    const index = this.data.thoughts.findIndex(thought => thought.id === id);
    if (index === -1) return null;

    this.data.thoughts[index] = {
      ...this.data.thoughts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    return this.data.thoughts[index];
  }

  async deleteThought(id: string): Promise<boolean> {
    const index = this.data.thoughts.findIndex(thought => thought.id === id);
    if (index === -1) return false;

    this.data.thoughts.splice(index, 1);
    this.saveData();
    return true;
  }

  async clearAllThoughts(userId: string): Promise<boolean> {
    const initialCount = this.data.thoughts.length;
    this.data.thoughts = this.data.thoughts.filter(thought => thought.userId !== userId);
    this.saveData();
    return this.data.thoughts.length < initialCount;
  }

  // Analytics and Summary
  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const thoughts = await this.getThoughts(userId);
    
    if (thoughts.length === 0) {
      return {
        totalThoughts: 0,
        averageIntensity: 0,
        topEmotion: 'none',
        recentThoughts: [],
        emotionCounts: {}
      };
    }

    const totalIntensity = thoughts.reduce((sum, thought) => sum + thought.intensity, 0);
    const averageIntensity = totalIntensity / thoughts.length;
    
    const emotionCounts: Record<string, number> = {};
    thoughts.forEach(thought => {
      emotionCounts[thought.emotion] = (emotionCounts[thought.emotion] || 0) + 1;
    });

    const topEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';

    const recentThoughts = thoughts.slice(0, 5);

    return {
      totalThoughts: thoughts.length,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      topEmotion,
      recentThoughts,
      emotionCounts
    };
  }

  async getTimeline(userId: string): Promise<TimelineEntry[]> {
    const thoughts = await this.getThoughts(userId);
    return thoughts.map(thought => ({
      id: `timeline-${thought.id}`,
      thoughtId: thought.id,
      userId: thought.userId,
      content: thought.content,
      emotion: thought.emotion,
      intensity: thought.intensity,
      tags: thought.tags,
      createdAt: thought.createdAt
    }));
  }

  // Utility methods
  async getEmotionStats(userId: string): Promise<Record<string, number>> {
    const thoughts = await this.getThoughts(userId);
    const stats: Record<string, number> = {};
    
    thoughts.forEach(thought => {
      stats[thought.emotion] = (stats[thought.emotion] || 0) + 1;
    });

    return stats;
  }

  async searchThoughts(userId: string, query: string): Promise<Thought[]> {
    const thoughts = await this.getThoughts(userId);
    const lowercaseQuery = query.toLowerCase();
    
    return thoughts.filter(thought => 
      thought.content.toLowerCase().includes(lowercaseQuery) ||
      thought.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      thought.emotion.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Reset database (for testing)
  async reset(): Promise<void> {
    this.data = {
      thoughts: this.generateSampleThoughts(),
      users: [{ id: 'mock-user-mindtrace-dev', createdAt: new Date().toISOString() }]
    };
    this.saveData();
  }
}

// Singleton instance
export const mockDatabase = new MockDatabase();

// Export API functions that match the expected interface
export const api = {
  thoughts: {
    list: (userId: string) => mockDatabase.getThoughts(userId),
    get: (id: string) => mockDatabase.getThought(id),
    create: (thought: Omit<Thought, 'id' | 'createdAt' | 'updatedAt'>) => mockDatabase.createThought(thought),
    update: (id: string, updates: Partial<Thought>) => mockDatabase.updateThought(id, updates),
    delete: (id: string) => mockDatabase.deleteThought(id),
    clear: (userId: string) => mockDatabase.clearAllThoughts(userId),
    search: (userId: string, query: string) => mockDatabase.searchThoughts(userId, query)
  },
  analytics: {
    dashboard: (userId: string) => mockDatabase.getDashboardSummary(userId),
    timeline: (userId: string) => mockDatabase.getTimeline(userId),
    emotions: (userId: string) => mockDatabase.getEmotionStats(userId)
  },
  reset: () => mockDatabase.reset()
};
