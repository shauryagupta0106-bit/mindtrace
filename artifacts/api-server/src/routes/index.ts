import { Router, type IRouter } from "express";
import healthRouter from "./health";
import thoughtsRouter from "./thoughts";
import analyticsRouter from "./analytics";
import timelineRouter from "./timeline";
import predictRouter from "./predict";

const router: IRouter = Router();

router.use(healthRouter);
router.use(thoughtsRouter);
router.use(analyticsRouter);
router.use(timelineRouter);
router.use(predictRouter);

export default router;
