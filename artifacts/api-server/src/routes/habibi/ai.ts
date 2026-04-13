import { Router } from "express";
import axios from "axios";
import { validateApikey, successResponse, errorResponse } from "./middleware.js";

const router = Router();
const http = axios.create({ timeout: 30000, headers: { "User-Agent": "Mozilla/5.0" } });

router.get("/chat", validateApikey, async (req, res) => {
  const { text } = req.query as { text?: string };
  if (!text) { res.status(400).json(errorResponse("Parameter text diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal mendapatkan respons AI.")); return; }
    res.json(successResponse({ question: text, answer: data.data }, "Google Gemini"));
  } catch (e) {
    try {
      const { data } = await http.get(`https://api.siputzx.my.id/api/ai/meta-llama?content=${encodeURIComponent(text)}`);
      res.json(successResponse({ question: text, answer: data?.data || "Maaf, AI sedang tidak tersedia." }, "Meta Llama"));
    } catch {
      res.status(500).json(errorResponse("AI sedang tidak tersedia. Coba lagi nanti."));
    }
  }
});

router.get("/image", validateApikey, async (req, res) => {
  const { prompt } = req.query as { prompt?: string };
  if (!prompt) { res.status(400).json(errorResponse("Parameter prompt diperlukan.")); return; }
  try {
    const { data } = await http.get(`https://api.siputzx.my.id/api/ai/txt2img?prompt=${encodeURIComponent(prompt)}`);
    if (!data?.status) { res.status(500).json(errorResponse("Gagal generate gambar.")); return; }
    res.json(successResponse({ prompt, image_url: data.data }, "api.siputzx.my.id"));
  } catch (e) {
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
      res.json(successResponse({ prompt, image_url: imageUrl }, "pollinations.ai"));
    } catch {
      res.status(500).json(errorResponse("Gagal generate gambar. Coba lagi nanti."));
    }
  }
});

export default router;
