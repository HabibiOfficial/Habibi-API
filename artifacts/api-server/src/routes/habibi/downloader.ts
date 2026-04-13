import { Router } from "express";
import axios from "axios";
import { validateApikey, successResponse, errorResponse } from "./middleware.js";

const router = Router();
const http = axios.create({ timeout: 20000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });

router.get("/tiktok", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
    if (!data?.data) { res.status(500).json(errorResponse("Gagal mengambil data TikTok.")); return; }
    const d = data.data;
    res.json(successResponse({
      id: d.id,
      title: d.title,
      duration: d.duration,
      author: { name: d.author?.nickname, username: d.author?.unique_id, avatar: d.author?.avatar },
      thumbnail: d.cover,
      video_hd: `https://www.tikwm.com/video/media/hdplay/${d.id}.mp4`,
      video_wm: `https://www.tikwm.com/video/media/play/${d.id}.mp4`,
      video_nowm: d.play,
      music: d.music,
      stats: { likes: d.digg_count, comments: d.comment_count, shares: d.share_count, views: d.play_count },
    }, "tikwm.com"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/instagram", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil data Instagram.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    try {
      const { data } = await http.post("https://v3.saveig.app/api/ajaxSearch", new URLSearchParams({ q: url, t: "media", lang: "id" }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      res.json(successResponse({ raw: data }, "saveig.app"));
    } catch {
      res.status(500).json(errorResponse("Gagal mengambil data Instagram. Coba lagi."));
    }
  }
});

router.get("/facebook", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/fbdl?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil data Facebook.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/youtube", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil audio YouTube.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/mediafire", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil link Mediafire.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/pinterest", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil data Pinterest.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/capcut", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil data CapCut.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/snackvideo", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil data Snackvideo.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/gdrive", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mengambil link Google Drive.")); return; }
    res.json(successResponse(data.data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

export default router;
