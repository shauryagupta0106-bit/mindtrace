import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, desc, gte, lte, and } from "drizzle-orm";
import { db, thoughtsTable } from "@workspace/db";
import { GetTimelineQueryParams } from "@workspace/api-zod";

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

router.get("/timeline", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = GetTimelineQueryParams.safeParse(req.query);
  const { startDate, endDate, emotion } = parsed.success ? parsed.data : {};

  let thoughts = await db
    .select()
    .from(thoughtsTable)
    .where(eq(thoughtsTable.userId, req.userId))
    .orderBy(desc(thoughtsTable.createdAt));

  if (startDate) {
    thoughts = thoughts.filter(
      (t) => new Date(t.createdAt) >= new Date(startDate),
    );
  }
  if (endDate) {
    thoughts = thoughts.filter(
      (t) => new Date(t.createdAt) <= new Date(endDate),
    );
  }
  if (emotion) {
    thoughts = thoughts.filter(
      (t) => t.emotion.toLowerCase() === emotion.toLowerCase(),
    );
  }

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let negativeCountLast24h = 0;

  const entries = thoughts.map((t) => {
    const isNegative = !POSITIVE_EMOTIONS.has(t.emotion.toLowerCase());
    if (isNegative && new Date(t.createdAt) > last24h) {
      negativeCountLast24h++;
    }
    return {
      ...t,
      emotionValence: POSITIVE_EMOTIONS.has(t.emotion.toLowerCase())
        ? "positive"
        : "negative",
      cognitiveWarning: false,
    };
  });

  if (negativeCountLast24h >= 5) {
    entries.forEach((e) => {
      if (new Date(e.createdAt) > last24h) {
        e.cognitiveWarning = true;
      }
    });
  }

  res.json(entries);
});

export default router;
