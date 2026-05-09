import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { eq, and, desc } from "drizzle-orm";
import { db, thoughtsTable } from "@workspace/db";
import {
  CreateThoughtBody,
  UpdateThoughtBody,
  UpdateThoughtParams,
  GetThoughtParams,
  DeleteThoughtParams,
  ListThoughtsQueryParams,
} from "@workspace/api-zod";

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

router.get("/thoughts", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = ListThoughtsQueryParams.safeParse(req.query);
  const emotion = parsed.success ? parsed.data.emotion : undefined;
  const limit = parsed.success ? parsed.data.limit : undefined;

  let query = db
    .select()
    .from(thoughtsTable)
    .where(eq(thoughtsTable.userId, req.userId))
    .orderBy(desc(thoughtsTable.createdAt));

  const thoughts = await (limit ? query.limit(limit) : query);

  const filtered = emotion
    ? thoughts.filter((t) => t.emotion === emotion)
    : thoughts;

  res.json(filtered);
});

router.post("/thoughts", requireAuth, async (req: any, res): Promise<void> => {
  const parsed = CreateThoughtBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [thought] = await db
    .insert(thoughtsTable)
    .values({ ...parsed.data, userId: req.userId })
    .returning();

  res.status(201).json(thought);
});

router.get("/thoughts/:id", requireAuth, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetThoughtParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [thought] = await db
    .select()
    .from(thoughtsTable)
    .where(
      and(
        eq(thoughtsTable.id, params.data.id),
        eq(thoughtsTable.userId, req.userId),
      ),
    );

  if (!thought) {
    res.status(404).json({ error: "Thought not found" });
    return;
  }

  res.json(thought);
});

router.put("/thoughts/:id", requireAuth, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateThoughtParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateThoughtBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [thought] = await db
    .update(thoughtsTable)
    .set(parsed.data)
    .where(
      and(
        eq(thoughtsTable.id, params.data.id),
        eq(thoughtsTable.userId, req.userId),
      ),
    )
    .returning();

  if (!thought) {
    res.status(404).json({ error: "Thought not found" });
    return;
  }

  res.json(thought);
});

router.delete("/thoughts/:id", requireAuth, async (req: any, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteThoughtParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [thought] = await db
    .delete(thoughtsTable)
    .where(
      and(
        eq(thoughtsTable.id, params.data.id),
        eq(thoughtsTable.userId, req.userId),
      ),
    )
    .returning();

  if (!thought) {
    res.status(404).json({ error: "Thought not found" });
    return;
  }

  res.sendStatus(204);
});

router.delete("/memory", requireAuth, async (req: any, res): Promise<void> => {
  await db
    .delete(thoughtsTable)
    .where(eq(thoughtsTable.userId, req.userId));

  res.sendStatus(204);
});

export default router;
