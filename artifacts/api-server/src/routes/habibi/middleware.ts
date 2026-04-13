import { Request, Response, NextFunction } from "express";
import { db, apikeysTable, requestLogsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function validateApikey(req: Request, res: Response, next: NextFunction) {
  const apikey = (req.query.apikey || req.headers["x-api-key"]) as string | undefined;

  if (!apikey) {
    res.status(401).json({ status: false, creator: "HabibiTzy", message: "Apikey diperlukan. Dapatkan apikey di /apikey" });
    return;
  }

  const found = await db.select().from(apikeysTable).where(eq(apikeysTable.apikey, apikey)).limit(1);
  if (!found.length || !found[0].isValid) {
    res.status(403).json({ status: false, creator: "HabibiTzy", message: "Apikey tidak valid atau sudah dinonaktifkan." });
    return;
  }

  await db.update(apikeysTable).set({ requestCount: found[0].requestCount + 1 }).where(eq(apikeysTable.apikey, apikey));

  try {
    await db.insert(requestLogsTable).values({ endpoint: req.path, apikey, status: 200 });
  } catch (_) {}

  next();
}

export function successResponse(data: unknown, source?: string) {
  return { status: true, creator: "HabibiTzy", ...(source ? { source } : {}), result: data };
}

export function errorResponse(message: string) {
  return { status: false, creator: "HabibiTzy", message };
}
