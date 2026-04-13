import { Router } from "express";
import axios from "axios";
import { validateApikey, successResponse, errorResponse } from "./middleware.js";

const router = Router();
const http = axios.create({ timeout: 20000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });

router.get("/tts", validateApikey, async (req, res) => {
  const { text, lang = "id" } = req.query as { text?: string; lang?: string };
  if (!text) { res.status(400).json(errorResponse("Parameter text diperlukan.")); return; }
  try {
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    res.json(successResponse({ audio_url: audioUrl, text, lang }, "Google TTS"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal membuat audio TTS."));
  }
});

router.get("/removebg", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/tools/removebg?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal menghapus background gambar.")); return; }
    res.json(successResponse(data.data || data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menghubungi server. Coba lagi."));
  }
});

router.get("/screenshot", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url diperlukan.")); return; }
  try {
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
    const { data } = await http.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`);
    res.json(successResponse({ screenshot_url: data?.data?.screenshot?.url || screenshotUrl, url }, "microlink.io"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mengambil screenshot website."));
  }
});

router.get("/emojimix", validateApikey, async (req, res) => {
  const { emoji1, emoji2 } = req.query as { emoji1?: string; emoji2?: string };
  if (!emoji1 || !emoji2) { res.status(400).json(errorResponse("Parameter emoji1 dan emoji2 diperlukan.")); return; }
  try {
    const toCodepoint = (emoji: string) => [...emoji].map(c => c.codePointAt(0)!.toString(16)).join("-");
    const cp1 = toCodepoint(emoji1);
    const cp2 = toCodepoint(emoji2);
    const imageUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/20230301/u${cp1}/u${cp1}_u${cp2}.png`;
    res.json(successResponse({ emoji1, emoji2, mixed_url: imageUrl }, "emojikitchen.dev"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menggabungkan emoji."));
  }
});

router.get("/brat", validateApikey, async (req, res) => {
  const { text } = req.query as { text?: string };
  if (!text) { res.status(400).json(errorResponse("Parameter text diperlukan.")); return; }
  try {
    const imageUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;
    res.json(successResponse({ image_url: imageUrl, text }, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal membuat brat stiker."));
  }
});

router.get("/iqcard", validateApikey, async (req, res) => {
  const { name } = req.query as { name?: string };
  if (!name) { res.status(400).json(errorResponse("Parameter name diperlukan.")); return; }
  const iq = Math.floor(Math.random() * 80) + 70;
  const level = iq < 90 ? "Dibawah Rata-rata" : iq < 110 ? "Rata-rata" : iq < 130 ? "Di atas Rata-rata" : "Jenius";
  res.json(successResponse({ name, iq, level, message: `${name} memiliki IQ ${iq} - ${level}` }, "HabibiAPI"));
});

router.get("/meme", validateApikey, async (req, res) => {
  const { template, top, bottom } = req.query as { template?: string; top?: string; bottom?: string };
  if (!template || !top || !bottom) { res.status(400).json(errorResponse("Parameter template, top, dan bottom diperlukan.")); return; }
  const cleanTop = top.replace(/\s+/g, "_").replace(/[?&%]/g, "~p");
  const cleanBottom = bottom.replace(/\s+/g, "_").replace(/[?&%]/g, "~p");
  const memeUrl = `https://api.memegen.link/images/${template}/${cleanTop}/${cleanBottom}.jpg`;
  res.json(successResponse({ image_url: memeUrl, template, top, bottom }, "memegen.link"));
});

router.get("/iphonechat", validateApikey, async (req, res) => {
  const { sender, message, time = "12:00" } = req.query as { sender?: string; message?: string; time?: string };
  if (!sender || !message) { res.status(400).json(errorResponse("Parameter sender dan message diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/m/iphonechat?sender=${encodeURIComponent(sender)}&message=${encodeURIComponent(message)}&time=${encodeURIComponent(time)}`);
    res.json(successResponse(data?.data || { image_url: data }, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal membuat iPhone chat."));
  }
});

router.get("/quote", validateApikey, async (req, res) => {
  const { text, author } = req.query as { text?: string; author?: string };
  if (!text) { res.status(400).json(errorResponse("Parameter text diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/m/quotly?text=${encodeURIComponent(text)}&author=${encodeURIComponent(author || "Anonim")}`);
    res.json(successResponse(data?.data || data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal membuat quote card."));
  }
});

router.get("/translate", validateApikey, async (req, res) => {
  const { text, from = "auto", to = "id" } = req.query as { text?: string; from?: string; to?: string };
  if (!text) { res.status(400).json(errorResponse("Parameter text diperlukan.")); return; }
  try {
    const { data } = await http.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    );
    const translated = Array.isArray(data) && Array.isArray(data[0])
      ? data[0].map((x: string[]) => x[0]).join("")
      : "";
    res.json(successResponse({ original: text, translated, from, to }, "Google Translate"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menerjemahkan teks. Coba lagi."));
  }
});

router.get("/weather", validateApikey, async (req, res) => {
  const { city = "Jakarta" } = req.query as { city?: string };
  try {
    const { data } = await http.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { headers: { Accept: "application/json" } }
    );
    const current = data?.current_condition?.[0];
    if (!current) { res.status(404).json(errorResponse("Kota tidak ditemukan.")); return; }
    res.json(successResponse({
      city,
      temp_c: current.temp_C,
      temp_f: current.temp_F,
      feels_like_c: current.FeelsLikeC,
      humidity: current.humidity,
      wind_kmph: current.windspeedKmph,
      wind_dir: current.winddir16Point,
      condition: current.weatherDesc?.[0]?.value,
      visibility_km: current.visibility,
      uv_index: current.uvIndex,
    }, "wttr.in"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mengambil data cuaca. Coba lagi."));
  }
});

router.get("/sticker", validateApikey, async (req, res) => {
  const { url } = req.query as { url?: string };
  if (!url) { res.status(400).json(errorResponse("Parameter url (link gambar) diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/tools/sticker?url=${encodeURIComponent(url)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal membuat stiker.")); return; }
    res.json(successResponse(data.data || data, "api.siputzx.my.id"));
  } catch (e) {
    const stickerUrl = `https://api.siputzx.my.id/api/tools/sticker?url=${encodeURIComponent(url)}`;
    res.json(successResponse({ sticker_url: stickerUrl, format: "webp", note: "Gunakan URL ini langsung sebagai stiker WhatsApp" }, "api.siputzx.my.id"));
  }
});

router.get("/wm", validateApikey, async (req, res) => {
  const { url, text } = req.query as { url?: string; text?: string };
  if (!url || !text) { res.status(400).json(errorResponse("Parameter url dan text diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/tools/watermark?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    res.json(successResponse(data?.data || data, "api.siputzx.my.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal menambahkan watermark."));
  }
});

export default router;
