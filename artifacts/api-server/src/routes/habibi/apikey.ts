import { Router } from "express";
import { db, apikeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { errorResponse } from "./middleware.js";

const router = Router();

router.post("/generate", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json(errorResponse("Nama dan email wajib diisi."));
    return;
  }

  if (!email.includes("@")) {
    res.status(400).json(errorResponse("Format email tidak valid."));
    return;
  }

  const existing = await db.select().from(apikeysTable).where(eq(apikeysTable.email, email)).limit(1);
  if (existing.length) {
    const row = existing[0];
    res.json({
      apikey: row.apikey,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt.toISOString(),
      requestCount: row.requestCount,
      isValid: row.isValid,
    });
    return;
  }

  const apikey = `habibi-${uuidv4().replace(/-/g, "").slice(0, 24)}`;
  const [inserted] = await db.insert(apikeysTable).values({ apikey, name, email }).returning();

  res.json({
    apikey: inserted.apikey,
    name: inserted.name,
    email: inserted.email,
    createdAt: inserted.createdAt.toISOString(),
    requestCount: inserted.requestCount,
    isValid: inserted.isValid,
  });
});

router.get("/check", async (req, res) => {
  const { apikey } = req.query as { apikey?: string };

  if (!apikey) {
    res.status(400).json(errorResponse("Parameter apikey diperlukan."));
    return;
  }

  const found = await db.select().from(apikeysTable).where(eq(apikeysTable.apikey, apikey)).limit(1);
  if (!found.length) {
    res.status(404).json(errorResponse("Apikey tidak ditemukan."));
    return;
  }

  const row = found[0];
  res.json({
    apikey: row.apikey,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
    requestCount: row.requestCount,
    isValid: row.isValid,
  });
});

export default router;
