import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, desc } from "drizzle-orm";
import { db, thoughtsTable } from "@workspace/db";

const router: IRouter = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
};

const POSITIVE_EMOTIONS = new Set(["joy", "calm", "focused", "excited", "hopeful"]);

router.get("/analytics", requireAuth, async (req: any, res): Promise<void> => {
  const thoughts = await db
    .select()
    .from(thoughtsTable)
    .where(eq(thoughtsTable.userId, req.userId))
    .orderBy(desc(thoughtsTable.createdAt));

  const totalThoughts = thoughts.length;
  const avgIntensity =
    totalThoughts > 0
      ? thoughts.reduce((acc, t) => acc + t.intensity, 0) / totalThoughts
      : 0;

  const emotionMap = new Map<string, { count: number; totalIntensity: number }>();
  for (const t of thoughts) {
    const key = t.emotion.toLowerCase();
    const existing = emotionMap.get(key) || { count: 0, totalIntensity: 0 };
    emotionMap.set(key, {
      count: existing.count + 1,
      totalIntensity: existing.totalIntensity + t.intensity,
    });
  }

  const emotionBreakdown = Array.from(emotionMap.entries()).map(
    ([emotion, data]) => ({
      emotion,
      count: data.count,
      avgIntensity: data.totalIntensity / data.count,
    }),
  );

  const dailyMap = new Map<string, { count: number; totalIntensity: number }>();
  for (const t of thoughts) {
    const date = new Date(t.createdAt).toISOString().split("T")[0];
    const existing = dailyMap.get(date) || { count: 0, totalIntensity: 0 };
    dailyMap.set(date, {
      count: existing.count + 1,
      totalIntensity: existing.totalIntensity + t.intensity,
    });
  }

  const dailyActivity = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      count: data.count,
      avgIntensity: data.totalIntensity / data.count,
    }));

  const tagMap = new Map<string, number>();
  for (const t of thoughts) {
    for (const tag of t.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  const topTags = Array.from(tagMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);

  let streak = 0;
  const uniqueDays = new Set(
    thoughts.map((t) => new Date(t.createdAt).toISOString().split("T")[0]),
  );
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (uniqueDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  const dayCounts = new Map<string, number>();
  for (const t of thoughts) {
    const day = new Date(t.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
    });
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  }
  let mostActiveDay: string | null = null;
  let maxCount = 0;
  for (const [day, count] of dayCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostActiveDay = day;
    }
  }

  const positiveCount = thoughts.filter((t) =>
    POSITIVE_EMOTIONS.has(t.emotion.toLowerCase()),
  ).length;
  const cognitiveScore =
    totalThoughts > 0 ? (positiveCount / totalThoughts) * 100 : 50;

  res.json({
    totalThoughts,
    avgIntensity,
    emotionBreakdown,
    dailyActivity,
    topTags,
    streak,
    mostActiveDay,
    cognitiveScore,
  });
});

router.get("/analytics/dashboard", requireAuth, async (req: any, res): Promise<void> => {
  const thoughts = await db
    .select()
    .from(thoughtsTable)
    .where(eq(thoughtsTable.userId, req.userId))
    .orderBy(desc(thoughtsTable.createdAt));

  const totalThoughts = thoughts.length;
  const recentThoughts = thoughts.slice(0, 5);
  const avgEmotionIntensity =
    totalThoughts > 0
      ? thoughts.reduce((acc, t) => acc + t.intensity, 0) / totalThoughts
      : 0;

  const emotionMap = new Map<string, number>();
  for (const t of thoughts) {
    const key = t.emotion.toLowerCase();
    emotionMap.set(key, (emotionMap.get(key) || 0) + 1);
  }
  let dominantEmotion: string | null = null;
  let maxEmo = 0;
  for (const [emo, count] of emotionMap.entries()) {
    if (count > maxEmo) {
      maxEmo = count;
      dominantEmotion = emo;
    }
  }

  let streak = 0;
  const uniqueDays = new Set(
    thoughts.map((t) => new Date(t.createdAt).toISOString().split("T")[0]),
  );
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (uniqueDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentNegative = thoughts.filter(
    (t) =>
      new Date(t.createdAt) > last24h &&
      !POSITIVE_EMOTIONS.has(t.emotion.toLowerCase()),
  );
  const cognitiveLoad =
    recentNegative.length >= 5
      ? "high"
      : recentNegative.length >= 3
        ? "moderate"
        : "low";

  res.json({
    totalThoughts,
    recentThoughts,
    streak,
    avgEmotionIntensity,
    dominantEmotion,
    cognitiveLoad,
  });
});

export default router;
