/**
 * Local API Layer - Primary development database with full persistence
 * Uses localStorage for data persistence and offline capability
 */

// Initial data generation for first-time setup
const generateMockThoughts = () => {
  const templates = [
    {
      content: 'Had a great breakthrough with the new project architecture today. The team really came together.',
      emotion: 'excited',
      intensity: 8,
      tags: ['work', 'achievement', 'team']
    },
    {
      content: 'Feeling a bit overwhelmed with the upcoming deadline. Need to prioritize better.',
      emotion: 'anxious',
      intensity: 6,
      tags: ['work', 'stress', 'deadline']
    },
    {
      content: 'Morning meditation really helped center my thoughts. Starting the day with clarity.',
      emotion: 'calm',
      intensity: 3,
      tags: ['wellness', 'meditation', 'morning']
    },
    {
      content: 'Completed the feature ahead of schedule! The client was really impressed with the UI.',
      emotion: 'proud',
      intensity: 9,
      tags: ['work', 'achievement', 'client']
    },
    {
      content: 'Thinking about trying a new approach to the data visualization. Current charts feel too static.',
      emotion: 'curious',
      intensity: 5,
      tags: ['ideas', 'visualization', 'improvement']
    },
    {
      content: 'The presentation went well, but I wish I had prepared more for the Q&A session.',
      emotion: 'nervous',
      intensity: 4,
      tags: ['presentation', 'work', 'learning']
    },
    {
      content: 'Finally fixed that bug that was bothering me for days! Persistence pays off.',
      emotion: 'relieved',
      intensity: 7,
      tags: ['coding', 'problem-solving', 'achievement']
    },
    {
      content: 'Coffee with Sarah was exactly what I needed. Great conversation about future plans.',
      emotion: 'happy',
      intensity: 6,
      tags: ['social', 'friends', 'planning']
    },
    {
      content: 'Feeling frustrated with the slow progress on the redesign. Maybe I need a new perspective.',
      emotion: 'frustrated',
      intensity: 5,
      tags: ['work', 'design', 'creativity']
    },
    {
      content: 'The new team member is fitting in well. Their fresh ideas are really valuable.',
      emotion: 'optimistic',
      intensity: 7,
      tags: ['team', 'work', 'growth']
    },
    {
      content: 'Had an amazing workout session today. Physical activity really clears my mind.',
      emotion: 'energized',
      intensity: 8,
      tags: ['fitness', 'health', 'wellness']
    },
    {
      content: 'Missing the old team dynamic. Change is hard but necessary for growth.',
      emotion: 'nostalgic',
      intensity: 4,
      tags: ['work', 'team', 'change']
    },
    {
      content: 'The client feedback was surprisingly positive! They loved the new features.',
      emotion: 'excited',
      intensity: 9,
      tags: ['work', 'client', 'success']
    },
    {
      content: 'Late night coding session was productive. Sometimes the best ideas come after midnight.',
      emotion: 'focused',
      intensity: 6,
      tags: ['coding', 'productivity', 'late-night']
    },
    {
      content: 'Feeling grateful for the support from my team during this challenging project.',
      emotion: 'grateful',
      intensity: 7,
      tags: ['work', 'team', 'appreciation']
    },
    {
      content: 'The new framework is taking longer to learn than expected, but it will be worth it.',
      emotion: 'determined',
      intensity: 6,
      tags: ['learning', 'technology', 'growth']
    },
    {
      content: 'Weekend hike helped me disconnect and recharge. Nature is the best therapy.',
      emotion: 'refreshed',
      intensity: 8,
      tags: ['wellness', 'nature', 'weekend']
    },
    {
      content: 'Imposter syndrome is hitting hard today. Need to remember my accomplishments.',
      emotion: 'insecure',
      intensity: 5,
      tags: ['mental-health', 'work', 'self-doubt']
    },
    {
      content: 'Successfully negotiated the contract terms! Business skills are improving.',
      emotion: 'confident',
      intensity: 8,
      tags: ['business', 'negotiation', 'growth']
    },
    {
      content: 'The system architecture review revealed some important optimizations we need to make.',
      emotion: 'analytical',
      intensity: 5,
      tags: ['architecture', 'optimization', 'planning']
    },
    {
      content: 'Family dinner was lovely. Sometimes I forget to disconnect from work.',
      emotion: 'content',
      intensity: 7,
      tags: ['family', 'balance', 'personal']
    },
    {
      content: 'The user testing session revealed some unexpected insights. Always listen to users!',
      emotion: 'surprised',
      intensity: 6,
      tags: ['user-research', 'testing', 'insights']
    },
    {
      content: 'Feeling burnt out. Maybe I should take a mental health day tomorrow.',
      emotion: 'exhausted',
      intensity: 7,
      tags: ['burnout', 'mental-health', 'self-care']
    },
    {
      content: 'The mentoring session with junior developers was rewarding. Teaching reinforces learning.',
      emotion: 'fulfilled',
      intensity: 8,
      tags: ['mentoring', 'team', 'growth']
    },
    {
      content: 'Stuck on a complex algorithm problem. Time to step away and come back fresh.',
      emotion: 'stuck',
      intensity: 4,
      tags: ['problem-solving', 'algorithms', 'coding']
    }
  ];

  // Generate 25 thoughts with varied timestamps over the past month
  const thoughts = [];
  const now = Date.now();
  
  for (let i = 0; i < 25; i++) {
    const template = templates[i % templates.length];
    const daysAgo = Math.floor(i / 2); // Spread over ~12 days
    const hoursAgo = (i % 2) * 12; // Alternate AM/PM
    const timestamp = now - (daysAgo * 86400000) - (hoursAgo * 3600000);
    
    thoughts.push({
      id: Date.now() - timestamp + i, // Unique numeric ID
      userId: 'mock-user-mindtrace-dev',
      content: template.content,
      emotion: template.emotion,
      intensity: template.intensity,
      tags: template.tags,
      createdAt: new Date(timestamp).toISOString(),
      updatedAt: new Date(timestamp).toISOString(),
      // Add some cognitive warnings for negative emotions
      cognitiveWarning: ['anxious', 'frustrated', 'insecure', 'exhausted', 'stuck'].includes(template.emotion) 
        ? 'Consider taking a break or talking to someone about these feelings.' 
        : undefined
    });
  }
  
  return thoughts;
};

// localStorage persistence keys
const STORAGE_KEY = 'mindtrace-data';
const STORAGE_VERSION = '1.1';

// Initialize thoughts with localStorage persistence
const initializeThoughts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version === STORAGE_VERSION && Array.isArray(data.thoughts)) {
        return data.thoughts;
      }
    }
  } catch (error) {
    console.warn('Failed to load thoughts from localStorage:', error);
  }
  
  // Generate fresh data if nothing stored
  const freshThoughts = generateMockThoughts();
  saveToLocalStorage(freshThoughts);
  return freshThoughts;
};

// Save thoughts to localStorage
const saveToLocalStorage = (thoughtsData: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      thoughts: thoughtsData,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Failed to save thoughts to localStorage:', error);
  }
};

// Data storage with persistence
let thoughts = initializeThoughts();

// Local API response structure
interface LocalApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Development user ID - dynamic for multi-tenancy
export let DEV_USER_ID = 'anonymous';

export function setMockUserId(userId: string) {
  DEV_USER_ID = userId;
  console.log(`🔄 Mock API: User ID set to ${userId}`);
}

// Parse URL to extract endpoint and parameters
function parseUrl(url: string): { endpoint: string; params: Record<string, string> } {
  // Use a dummy base for relative URLs to avoid TypeError: Invalid URL
  const urlObj = new URL(url, window.location?.origin || 'http://localhost');
  const pathname = urlObj.pathname;
  const params: Record<string, string> = {};
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return { endpoint: pathname, params };
}

// Simple mock database operations with localStorage persistence
interface Thought {
  id: number;
  userId: string;
  content: string;
  emotion: string;
  intensity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  title?: string;
  context?: string;
  cognitiveWarning?: string;
}

function getThoughts(): Thought[] {
  return thoughts.filter((t: Thought) => t.userId === DEV_USER_ID);
}

function createThought(thought: Partial<Thought>): Thought {
  const newThought: Thought = {
    content: thought.context || '', // Fallback for backwards compatibility
    context: '',
    title: '',
    emotion: 'neutral',
    intensity: 5,
    tags: [],
    ...thought,
    id: Date.now() + Math.floor(Math.random() * 10000),
    userId: thought.userId || DEV_USER_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  thoughts.unshift(newThought);
  saveToLocalStorage(thoughts);
  return newThought;
}

function getThought(id: number | string): Thought | null {
  const numericId = typeof id === 'string' ? Number(id) : id;
  return thoughts.find((t: Thought) => t.id === numericId) || null;
}

function updateThought(id: number | string, updates: Partial<Thought>): Thought | null {
  const numericId = typeof id === 'string' ? Number(id) : id;
  const index = thoughts.findIndex((t: Thought) => t.id === numericId);
  if (index === -1) return null;
  
  thoughts[index] = {
    ...thoughts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveToLocalStorage(thoughts);
  return thoughts[index];
}

function deleteThought(id: number | string): boolean {
  const numericId = typeof id === 'string' ? Number(id) : id;
  const index = thoughts.findIndex((t: Thought) => t.id === numericId);
  if (index === -1) return false;
  
  thoughts.splice(index, 1);
  saveToLocalStorage(thoughts);
  return true;
}

function clearAllThoughts(): boolean {
  const initialCount = thoughts.length;
  thoughts = thoughts.filter((t: Thought) => t.userId !== DEV_USER_ID);
  saveToLocalStorage(thoughts);
  return thoughts.length < initialCount;
}

function searchThoughts(query: string): Thought[] {
  const lowercaseQuery = query.toLowerCase();
  return getThoughts().filter((thought: Thought) => 
    thought.content.toLowerCase().includes(lowercaseQuery) ||
    thought.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)) ||
    thought.emotion.toLowerCase().includes(lowercaseQuery)
  );
}

function getDashboardSummary() {
  const thoughts = getThoughts();
  
  if (thoughts.length === 0) {
    return {
      totalThoughts: 0,
      averageIntensity: 0,
      topEmotion: 'none',
      recentThoughts: [],
      emotionCounts: {},
      cognitiveWarnings: 0,
      streakDays: 0,
      topTags: []
    };
  }

  const totalIntensity = thoughts.reduce((sum: number, thought: Thought) => sum + thought.intensity, 0);
  const averageIntensity = Math.round((totalIntensity / thoughts.length) * 10) / 10;
  
  const emotionCounts: Record<string, number> = {};
  thoughts.forEach((thought: Thought) => {
    emotionCounts[thought.emotion] = (emotionCounts[thought.emotion] || 0) + 1;
  });

  const topEmotion = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';

  const recentThoughts = thoughts.slice(0, 5);

  // Calculate additional metrics
  const cognitiveWarnings = thoughts.filter((t: Thought) => t.cognitiveWarning).length;
  
  // Calculate true streak (consecutive days up to today)
  const uniqueDaysArray = Array.from(new Set(thoughts.map((t: Thought) => new Date(t.createdAt).toDateString())))
    .map(dateStr => new Date(dateStr).setHours(0,0,0,0))
    .sort((a, b) => b - a);

  let currentStreak = 0;
  const today = new Date().setHours(0,0,0,0);
  const yesterday = today - 86400000;

  if (uniqueDaysArray.length > 0) {
    if (uniqueDaysArray[0] === today || uniqueDaysArray[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDaysArray.length; i++) {
        const diff = Math.round((uniqueDaysArray[i - 1] - uniqueDaysArray[i]) / 86400000);
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }
  
  // Get top tags
  const tagCounts: Record<string, number> = {};
  thoughts.forEach((thought: Thought) => {
    thought.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalThoughts: thoughts.length,
    averageIntensity, // kept for backward compatibility if used elsewhere
    avgEmotionIntensity: averageIntensity,
    topEmotion,
    recentThoughts,
    emotionCounts,
    cognitiveWarnings,
    streakDays: currentStreak, // kept for backward compatibility
    streak: currentStreak,
    topTags
  };
}

function getTimeline() {
  return getThoughts().map((thought: Thought) => ({
    id: thought.id,
    userId: thought.userId,
    content: thought.content,
    emotion: thought.emotion,
    emotionValence: getEmotionValence(thought.emotion),
    intensity: thought.intensity,
    tags: thought.tags,
    createdAt: thought.createdAt,
    cognitiveWarning: thought.cognitiveWarning
  }));
}

// Helper function to determine emotion valence
function getEmotionValence(emotion: string): 'positive' | 'negative' | 'neutral' {
  const positiveEmotions = ['excited', 'proud', 'happy', 'optimistic', 'energized', 'confident', 'refreshed', 'fulfilled', 'content', 'relieved'];
  const negativeEmotions = ['anxious', 'nervous', 'frustrated', 'nostalgic', 'insecure', 'exhausted', 'stuck', 'burnout'];
  
  if (positiveEmotions.includes(emotion)) return 'positive';
  if (negativeEmotions.includes(emotion)) return 'negative';
  return 'neutral';
}

function getEmotionStats() {
  const thoughts = getThoughts();
  const stats: Record<string, number> = {};
  
  thoughts.forEach((thought: Thought) => {
    stats[thought.emotion] = (stats[thought.emotion] || 0) + 1;
  });

  return stats;
}

function getAnalytics() {
  const thoughts = getThoughts();
  
  // Emotion breakdown for pie chart
  const emotionCounts: Record<string, number> = {};
  thoughts.forEach((thought: Thought) => {
    emotionCounts[thought.emotion] = (emotionCounts[thought.emotion] || 0) + 1;
  });
  
  const emotionBreakdown = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: Math.round((count / thoughts.length) * 100)
  }));

  // Daily intensity trend for line chart
  const dailyIntensity: Array<{ date: string; intensity: number; count: number }> = [];
  const dailyMap: Record<string, { totalIntensity: number; count: number }> = {};
  
  thoughts.forEach((thought: Thought) => {
    const date = new Date(thought.createdAt).toLocaleDateString();
    if (!dailyMap[date]) {
      dailyMap[date] = { totalIntensity: 0, count: 0 };
    }
    dailyMap[date].totalIntensity += thought.intensity;
    dailyMap[date].count += 1;
  });
  
  Object.entries(dailyMap).forEach(([date, data]) => {
    dailyIntensity.push({
      date,
      intensity: Math.round((data.totalIntensity / data.count) * 10) / 10,
      count: data.count
    });
  });
  
  dailyIntensity.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Weekly pattern for bar chart
  const weeklyPattern: Array<{ day: string; count: number; avgIntensity: number }> = [];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMap: Record<string, { totalIntensity: number; count: number }> = {};
  
  thoughts.forEach((thought: Thought) => {
    const day = weekDays[new Date(thought.createdAt).getDay()];
    if (!weeklyMap[day]) {
      weeklyMap[day] = { totalIntensity: 0, count: 0 };
    }
    weeklyMap[day].totalIntensity += thought.intensity;
    weeklyMap[day].count += 1;
  });
  
  weekDays.forEach(day => {
    const data = weeklyMap[day] || { totalIntensity: 0, count: 0 };
    weeklyPattern.push({
      day,
      count: data.count,
      avgIntensity: data.count > 0 ? Math.round((data.totalIntensity / data.count) * 10) / 10 : 0
    });
  });

  // Top tags
  const tagCounts: Record<string, number> = {};
  thoughts.forEach((thought: Thought) => {
    thought.tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Cognitive score
  const positiveEmotions = ['excited', 'proud', 'happy', 'optimistic', 'energized', 'confident', 'refreshed', 'fulfilled', 'content', 'relieved'];
  const negativeEmotions = ['anxious', 'nervous', 'frustrated', 'nostalgic', 'insecure', 'exhausted', 'stuck', 'burnout'];
  
  const positiveCount = thoughts.filter((t: Thought) => positiveEmotions.includes(t.emotion)).length;
  const negativeCount = thoughts.filter((t: Thought) => negativeEmotions.includes(t.emotion)).length;
  const cognitiveScore = thoughts.length === 0 ? 0 : Math.round(thoughts.reduce((acc: number, t: Thought) => acc + (t.intensity || 0), 0) / thoughts.length);

  // Formulate daily activity to match schema
  const dailyActivity = dailyIntensity.slice(-14).map(d => ({
    date: d.date,
    count: d.count,
    avgIntensity: d.intensity
  }));

  // Calculate streak (consecutive days)
  const uniqueDays = new Set(thoughts.map((t: Thought) => new Date(t.createdAt).toDateString()));
  const streak = uniqueDays.size;

  // Calculate most active day
  const mostActiveDay = weeklyPattern.sort((a, b) => b.count - a.count)[0]?.day || "—";

  // Map topTags to simple string array to match schema
  const tagStrings = topTags.map(t => t.tag);

  return {
    totalThoughts: thoughts.length,
    avgIntensity: Math.round((thoughts.reduce((sum: number, t: Thought) => sum + t.intensity, 0) / thoughts.length) * 10) / 10,
    emotionBreakdown,
    dailyActivity,
    topTags: tagStrings,
    streak,
    mostActiveDay,
    cognitiveScore,
    cognitiveWarnings: thoughts.filter((t: Thought) => t.cognitiveWarning).length
  };
}

// Local API handler
export async function mockApiHandler(url: string, options: RequestInit = {}): Promise<LocalApiResponse> {
  const { endpoint, params } = parseUrl(url);
  const method = options.method || 'GET';
  
  // Only log errors, not every API call for cleaner console
  
  try {
    // Thoughts endpoints
    if (endpoint === '/api/thoughts') {
      if (method === 'GET') {
        const thoughts = getThoughts();
        return { data: thoughts, status: 200 };
      }
      
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        const thought = createThought({
          ...body,
          userId: DEV_USER_ID
        });
        return { data: thought, status: 201 };
      }
    }
    
    // Individual thought endpoints
    if (endpoint === '/api/predict' && method === 'POST') {
      const body = JSON.parse(options.body as string);
      
      const { context = "", emotion = "neutral", intensity = 5, tags = [] } = body;
      
      const wordCount = context.split(/\s+/).length;
      let baseConfidence = 70 + Math.min(25, wordCount);
      if (tags.length > 0) baseConfidence += 2;
      
      const isPositive = ['excited', 'proud', 'happy', 'optimistic', 'energized', 'confident', 'refreshed', 'fulfilled', 'content', 'relieved'].includes(emotion);
      const isNegative = ['anxious', 'nervous', 'frustrated', 'nostalgic', 'insecure', 'exhausted', 'stuck', 'burnout'].includes(emotion);
      
      const generatePrediction = (thoughtText: string) => {
        const prompt = `Analyze this thought: ${thoughtText}`;
        const excerpt = thoughtText.length > 30 ? thoughtText.substring(0, 30) + "..." : thoughtText;
        const textHash = thoughtText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const dynamicScore = Math.min(99, Math.max(50, 50 + (textHash % 49)));
        
        let pred, reas;
        if (isPositive) {
          pred = `Based on your thought "${excerpt}", you are processing this constructively. Your mindset is primed for forward momentum.`;
          reas = `Your feeling of "${emotion}" at intensity ${intensity}/10 indicates an engaged mental state. Dynamic analysis of your input confirms active progression.`;
        } else if (isNegative) {
          pred = `Regarding "${excerpt}", you appear to be experiencing a period of cognitive load. Taking a step back may unlock new clarity.`;
          reas = `The emotion "${emotion}" at intensity ${intensity}/10 points to potential overwhelm. Dynamic text analysis suggests a need for decompression.`;
        } else {
          pred = `Your thought "${excerpt}" shows a balanced, analytical processing state. Maintaining this equilibrium will help in problem-solving.`;
          reas = `A neutral emotion ("${emotion}") at intensity ${intensity}/10 reflects stability. Dynamic analysis confirms steady cognitive processing.`;
        }
        return { pred, reas, score: dynamicScore, prompt };
      };
      
      const predictionObj = generatePrediction(context);
      const predictionText = predictionObj.pred;
      const reasoningText = predictionObj.reas;
      baseConfidence = predictionObj.score;
      
      const mockResult = {
        prediction: predictionText,
        confidence: Math.min(99, baseConfidence),
        reasoning: reasoningText,
        steps: [
          "Parsing emotional context from semantics...",
          `Mapping cognitive patterns based on ${tags.length} markers...`,
          "Applying psychological and valence models...",
          "Generating trajectory prediction...",
          "Calculating heuristic confidence..."
        ],
        timestamp: Date.now()
      };
      
      return { data: mockResult, status: 200 };
    }

    if (endpoint.startsWith('/api/thoughts/') && method === 'GET') {

      const thoughtId = endpoint.split('/').pop();
      const thought = getThought(thoughtId!);
      if (thought) {
        return { data: thought, status: 200 };
      } else {
        return { error: 'Thought not found', status: 404 };
      }
    }
    
    if (endpoint.startsWith('/api/thoughts/') && method === 'PUT') {
      const thoughtId = endpoint.split('/').pop();
      const body = JSON.parse(options.body as string);
      const thought = updateThought(thoughtId!, body);
      if (thought) {
        return { data: thought, status: 200 };
      } else {
        return { error: 'Thought not found', status: 404 };
      }
    }
    
    if (endpoint.startsWith('/api/thoughts/') && method === 'DELETE') {
      const thoughtId = endpoint.split('/').pop();
      const success = deleteThought(thoughtId!);
      if (success) {
        return { data: { success: true }, status: 200 };
      } else {
        return { error: 'Thought not found', status: 404 };
      }
    }
    
    // Analytics endpoints
    if (endpoint === '/api/analytics/dashboard' && method === 'GET') {
      const summary = getDashboardSummary();
      return { data: summary, status: 200 };
    }
    
    if (endpoint === '/api/timeline' && method === 'GET') {
      const timeline = getTimeline();
      return { data: timeline, status: 200 };
    }
    
    if (endpoint === '/api/analytics/emotions' && method === 'GET') {
      const emotions = getEmotionStats();
      return { data: emotions, status: 200 };
    }
    
    if (endpoint === '/api/analytics' && method === 'GET') {
      const analytics = getAnalytics();
      return { data: analytics, status: 200 };
    }
    
    // Search endpoint
    if (endpoint === '/api/thoughts/search' && method === 'GET') {
      const query = params.q || '';
      const thoughts = searchThoughts(query);
      return { data: thoughts, status: 200 };
    }
    
    // Clear all thoughts endpoint
    if (endpoint === '/api/memory' && method === 'DELETE') {
      const success = clearAllThoughts();
      return { data: { success }, status: 200 };
    }
    
    // Health check
    if (endpoint === '/api/health' && method === 'GET') {
      return { 
        data: { 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          mockMode: true,
          user: DEV_USER_ID
        }, 
        status: 200 
      };
    }
    
    // Default response for unhandled endpoints
    console.warn(`🔄 Local API: Unhandled endpoint ${method} ${endpoint}`);
    return { 
      error: `Endpoint not implemented: ${method} ${endpoint}`, 
      status: 404 
    };
    
  } catch (error) {
    console.error(`🔄 Local API Error:`, error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error', 
      status: 500 
    };
  }
}

// Local fetch function that intercepts API calls
export function createLocalFetch(originalFetch: typeof fetch) {
  return async function localFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : input.url);
    
    // Only intercept local API calls
    const isLocalApi = url.startsWith('/api/') || (url.startsWith(window.location.origin) && url.includes('/api/'));
    if (isLocalApi) {
      const mockResponse = await mockApiHandler(url, init);
      
      return new Response(JSON.stringify(mockResponse.data || { error: mockResponse.error }), {
        status: mockResponse.status,
        statusText: mockResponse.status === 200 ? 'OK' : 'Error',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // For non-API calls, use the real fetch
    return originalFetch(input, init);
  };
}

// Initialize mock API
export function initializeMockApi() {
  // Replace the global fetch with our mock version
  const originalFetch = window.fetch;
  window.fetch = createLocalFetch(originalFetch);
  
  // Return a cleanup function
  return () => {
    window.fetch = originalFetch;
  };
}
