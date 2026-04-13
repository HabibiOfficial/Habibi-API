import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import habibiRouter from "./habibi/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/habibi", habibiRouter);

export default router;
