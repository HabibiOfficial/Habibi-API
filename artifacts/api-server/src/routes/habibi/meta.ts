import { Router } from "express";
import { db, apikeysTable, requestLogsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

const ENDPOINTS = [
  { name: "TikTok Downloader", path: "/api/habibi/downloader/tiktok", method: "GET", category: "Downloader", description: "Download video TikTok tanpa watermark", params: ["url"], status: "active", requiresApikey: true },
  { name: "Instagram Downloader", path: "/api/habibi/downloader/instagram", method: "GET", category: "Downloader", description: "Download foto dan video Instagram", params: ["url"], status: "active", requiresApikey: true },
  { name: "Facebook Downloader", path: "/api/habibi/downloader/facebook", method: "GET", category: "Downloader", description: "Download video Facebook", params: ["url"], status: "active", requiresApikey: true },
  { name: "YouTube Audio", path: "/api/habibi/downloader/youtube", method: "GET", category: "Downloader", description: "Download audio dari YouTube", params: ["url"], status: "active", requiresApikey: true },
  { name: "Mediafire Downloader", path: "/api/habibi/downloader/mediafire", method: "GET", category: "Downloader", description: "Download file dari Mediafire", params: ["url"], status: "active", requiresApikey: true },
  { name: "Pinterest Downloader", path: "/api/habibi/downloader/pinterest", method: "GET", category: "Downloader", description: "Download gambar dan video Pinterest", params: ["url"], status: "active", requiresApikey: true },
  { name: "CapCut Downloader", path: "/api/habibi/downloader/capcut", method: "GET", category: "Downloader", description: "Download template dan video CapCut", params: ["url"], status: "active", requiresApikey: true },
  { name: "Snackvideo Downloader", path: "/api/habibi/downloader/snackvideo", method: "GET", category: "Downloader", description: "Download video Snackvideo tanpa watermark", params: ["url"], status: "active", requiresApikey: true },
  { name: "Google Drive Downloader", path: "/api/habibi/downloader/gdrive", method: "GET", category: "Downloader", description: "Ambil link download langsung dari Google Drive", params: ["url"], status: "active", requiresApikey: true },
  { name: "Text-to-Speech", path: "/api/habibi/tools/tts", method: "GET", category: "Tools", description: "Ubah teks menjadi suara (audio)", params: ["text", "lang"], status: "active", requiresApikey: true },
  { name: "Remove Background", path: "/api/habibi/tools/removebg", method: "GET", category: "Tools", description: "Hapus background gambar secara otomatis", params: ["url"], status: "active", requiresApikey: true },
  { name: "Screenshot Website", path: "/api/habibi/tools/screenshot", method: "GET", category: "Tools", description: "Ambil screenshot dari URL website", params: ["url"], status: "active", requiresApikey: true },
  { name: "Emoji Mix", path: "/api/habibi/tools/emojimix", method: "GET", category: "Tools", description: "Gabungkan dua emoji menjadi satu gambar unik", params: ["emoji1", "emoji2"], status: "active", requiresApikey: true },
  { name: "Brat Sticker", path: "/api/habibi/tools/brat", method: "GET", category: "Tools", description: "Buat stiker brat dengan teks custom", params: ["text"], status: "active", requiresApikey: true },
  { name: "IQ Card", path: "/api/habibi/tools/iqcard", method: "GET", category: "Tools", description: "Buat kartu IQ random dengan nama", params: ["name"], status: "active", requiresApikey: true },
  { name: "Meme Generator", path: "/api/habibi/tools/meme", method: "GET", category: "Tools", description: "Buat meme dengan teks atas dan bawah", params: ["template", "top", "bottom"], status: "active", requiresApikey: true },
  { name: "iPhone Chat Maker", path: "/api/habibi/tools/iphonechat", method: "GET", category: "Tools", description: "Buat screenshot percakapan ala iPhone", params: ["sender", "message", "time"], status: "active", requiresApikey: true },
  { name: "Quote Card", path: "/api/habibi/tools/quote", method: "GET", category: "Tools", description: "Buat kartu kutipan yang estetik", params: ["text", "author"], status: "active", requiresApikey: true },
  { name: "AI Chat (Gemini)", path: "/api/habibi/ai/chat", method: "GET", category: "AI", description: "Chat dengan AI menggunakan Google Gemini", params: ["text"], status: "active", requiresApikey: true },
  { name: "AI Image Generate", path: "/api/habibi/ai/image", method: "GET", category: "AI", description: "Generate gambar dari deskripsi teks", params: ["prompt"], status: "active", requiresApikey: true },
  { name: "YouTube Search", path: "/api/habibi/search/youtube", method: "GET", category: "Search", description: "Cari video YouTube berdasarkan kata kunci", params: ["query"], status: "active", requiresApikey: true },
  { name: "Lirik Lagu", path: "/api/habibi/search/lyrics", method: "GET", category: "Search", description: "Cari lirik lagu berdasarkan judul dan artis", params: ["title", "artist"], status: "active", requiresApikey: true },
  { name: "Spotify Search", path: "/api/habibi/search/spotify", method: "GET", category: "Search", description: "Cari lagu di Spotify berdasarkan kata kunci", params: ["query"], status: "active", requiresApikey: true },
  { name: "Twitter/X Downloader", path: "/api/habibi/downloader/twitter", method: "GET", category: "Downloader", description: "Download video dari Twitter/X", params: ["url"], status: "active", requiresApikey: true },
  { name: "Spotify Downloader", path: "/api/habibi/downloader/spotify", method: "GET", category: "Downloader", description: "Download lagu dari Spotify", params: ["url"], status: "active", requiresApikey: true },
  { name: "Translate", path: "/api/habibi/tools/translate", method: "GET", category: "Tools", description: "Terjemahkan teks ke bahasa apapun", params: ["text", "from", "to"], status: "active", requiresApikey: true },
  { name: "Cuaca / Weather", path: "/api/habibi/tools/weather", method: "GET", category: "Tools", description: "Cek cuaca berdasarkan nama kota", params: ["city"], status: "active", requiresApikey: true },
  { name: "Sticker Maker", path: "/api/habibi/tools/sticker", method: "GET", category: "Tools", description: "Ubah gambar menjadi stiker WhatsApp (webp)", params: ["url"], status: "active", requiresApikey: true },
  { name: "Watermark", path: "/api/habibi/tools/wm", method: "GET", category: "Tools", description: "Tambahkan teks watermark ke gambar", params: ["url", "text"], status: "active", requiresApikey: true },
  { name: "Jadwal Sholat", path: "/api/habibi/islam/sholat", method: "GET", category: "Islam", description: "Jadwal waktu sholat berdasarkan kota", params: ["city"], status: "active", requiresApikey: true },
  { name: "Al-Quran", path: "/api/habibi/islam/quran", method: "GET", category: "Islam", description: "Baca ayat Al-Quran berdasarkan surah dan ayat", params: ["surah", "ayat"], status: "active", requiresApikey: true },
  { name: "Daftar Surah", path: "/api/habibi/islam/surah", method: "GET", category: "Islam", description: "Daftar semua surah dalam Al-Quran", params: [], status: "active", requiresApikey: true },
  { name: "Hadits", path: "/api/habibi/islam/hadits", method: "GET", category: "Islam", description: "Ambil hadits acak dari berbagai kitab", params: ["kitab"], status: "active", requiresApikey: true },
  { name: "Asmaul Husna", path: "/api/habibi/islam/asmaul", method: "GET", category: "Islam", description: "99 Asmaul Husna dengan arti dan penjelasan", params: [], status: "active", requiresApikey: true },
  { name: "Doa Harian", path: "/api/habibi/islam/doa", method: "GET", category: "Islam", description: "Doa-doa harian dengan Arab, latin, dan artinya", params: [], status: "active", requiresApikey: true },
  { name: "Arah Kiblat", path: "/api/habibi/islam/kiblat", method: "GET", category: "Islam", description: "Hitung arah kiblat berdasarkan koordinat", params: ["lat", "lng"], status: "active", requiresApikey: true },
  { name: "Kalkulator Zakat", path: "/api/habibi/islam/zakat", method: "GET", category: "Islam", description: "Hitung zakat mal berdasarkan total harta", params: ["amount"], status: "active", requiresApikey: true },
];

const START_TIME = Date.now();

router.get("/stats", async (_req, res) => {
  try {
    const [totalApikeys] = await db.select({ count: sql<number>`count(*)` }).from(apikeysTable);
    const [totalRequests] = await db.select({ count: sql<number>`count(*)` }).from(requestLogsTable);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayRequests] = await db.select({ count: sql<number>`count(*)` }).from(requestLogsTable).where(sql`created_at >= ${today.toISOString()}`);

    const uptimeMs = Date.now() - START_TIME;
    const hours = Math.floor(uptimeMs / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);

    res.json({
      totalEndpoints: ENDPOINTS.length,
      activeEndpoints: ENDPOINTS.filter(e => e.status === "active").length,
      totalRequests: Number(totalRequests?.count ?? 0),
      requestsToday: Number(todayRequests?.count ?? 0),
      totalApikeys: Number(totalApikeys?.count ?? 0),
      uptime: `${hours}h ${minutes}m`,
      creator: "HabibiTzy",
      version: "1.0.0",
    });
  } catch (_e) {
    res.json({
      totalEndpoints: ENDPOINTS.length,
      activeEndpoints: ENDPOINTS.length,
      totalRequests: 0,
      requestsToday: 0,
      totalApikeys: 0,
      uptime: "0h 0m",
      creator: "HabibiTzy",
      version: "1.0.0",
    });
  }
});

router.get("/endpoints", (_req, res) => {
  const categories = [...new Set(ENDPOINTS.map(e => e.category))];
  res.json({
    total: ENDPOINTS.length,
    categories,
    endpoints: ENDPOINTS,
  });
});

export { ENDPOINTS };
export default router;
