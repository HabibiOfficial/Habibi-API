import { Router } from "express";
import metaRouter from "./meta.js";
import apikeyRouter from "./apikey.js";
import downloaderRouter from "./downloader.js";
import toolsRouter from "./tools.js";
import aiRouter from "./ai.js";
import searchRouter from "./search.js";
import islamRouter from "./islam.js";

const router = Router();

router.use("/", metaRouter);
router.use("/apikey", apikeyRouter);
router.use("/downloader", downloaderRouter);
router.use("/tools", toolsRouter);
router.use("/ai", aiRouter);
router.use("/search", searchRouter);
router.use("/islam", islamRouter);

export default router;
