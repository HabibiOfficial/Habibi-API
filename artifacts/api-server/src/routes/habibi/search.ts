import { Router } from "express";
import axios from "axios";
import { validateApikey, successResponse, errorResponse } from "./middleware.js";

const router = Router();
const http = axios.create({ timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } });

router.get("/youtube", validateApikey, async (req, res) => {
  const { query } = req.query as { query?: string };
  if (!query) { res.status(400).json(errorResponse("Parameter query diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/s/yta?query=${encodeURIComponent(query)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mencari video YouTube.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    try {
      const { data } = await http.get(`https://invidious.nikkosphere.com/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
      const results = Array.isArray(data) ? data.slice(0, 10).map((v: Record<string, unknown>) => ({
        title: v.title,
        videoId: v.videoId,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: v.lengthSeconds,
        views: v.viewCount,
        author: v.author,
      })) : [];
      res.json(successResponse(results, "invidious"));
    } catch {
      res.status(500).json(errorResponse("Gagal mencari video YouTube. Coba lagi."));
    }
  }
});

router.get("/lyrics", validateApikey, async (req, res) => {
  const { title, artist } = req.query as { title?: string; artist?: string };
  if (!title) { res.status(400).json(errorResponse("Parameter title diperlukan.")); return; }
  try {
    const query = artist ? `${title} ${artist}` : title;
    const { data } = await http.get(`https://api.siputzx.my.id/api/s/lirik?judul=${encodeURIComponent(query)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Lirik tidak ditemukan.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    try {
      const { data } = await http.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist || "")}/${encodeURIComponent(title)}`);
      res.json(successResponse({ title, artist, lyrics: data.lyrics }, "lyrics.ovh"));
    } catch {
      res.status(500).json(errorResponse("Lirik tidak ditemukan. Coba lagi."));
    }
  }
});

router.get("/spotify", validateApikey, async (req, res) => {
  const { query } = req.query as { query?: string };
  if (!query) { res.status(400).json(errorResponse("Parameter query diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/s/spotify?query=${encodeURIComponent(query)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mencari di Spotify.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mencari di Spotify. Coba lagi."));
  }
});

export default router;
