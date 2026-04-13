# Habibi API Platform

## Overview
Full-stack REST API platform built by HabibiTzy. Self-hosted API service with website UI, API key management, and 31+ endpoints across 5 categories.

## Architecture
- **Frontend**: React + Vite (`artifacts/habibi-api/`) — runs at `/` (port 25072)
- **Backend**: Express.js TypeScript (`artifacts/api-server/`) — runs at `/api` (port 8080)
- **Database**: PostgreSQL via Replit built-in database (Drizzle ORM)
- **Monorepo**: pnpm workspace

## Key Files
- `artifacts/habibi-api/src/` — React frontend (pages: Home, Docs, API Key, Donasi, Sosmed)
- `artifacts/api-server/src/routes/habibi/` — All API route handlers
  - `meta.ts` — Stats + endpoint list endpoints
  - `apikey.ts` — API key generation + validation
  - `downloader.ts` — TikTok, Instagram, Facebook, YouTube, Mediafire, Pinterest, CapCut, Snackvideo, GDrive
  - `tools.ts` — TTS, RemoveBG, Screenshot, EmojiMix, Brat, IQCard, Meme, iPhone Chat, Quote
  - `ai.ts` — AI Chat (Gemini), AI Image Generate (Pollinations)
  - `search.ts` — YouTube Search, Lyrics, Spotify Search
  - `islam.ts` — Jadwal Sholat, Quran, Surah, Hadits, Asmaul Husna, Doa Harian, Kiblat, Zakat
  - `middleware.ts` — API key validation middleware
- `lib/db/src/schema/apikeys.ts` — DB schema: apikeys table + request_logs table
- `lib/api-spec/openapi.yaml` — OpenAPI spec for meta/apikey endpoints

## API Endpoints
All scraper endpoints require apikey. Format: `/api/habibi/{category}/{name}?apikey=xxx`

### Downloader (9 endpoints)
TikTok, Instagram, Facebook, YouTube, Mediafire, Pinterest, CapCut, Snackvideo, GDrive

### Tools (9 endpoints)
TTS, RemoveBG, Screenshot, EmojiMix, Brat Sticker, IQ Card, Meme, iPhone Chat, Quote Card

### AI (2 endpoints)
AI Chat (Gemini fallback: Meta Llama), AI Image (Pollinations.ai)

### Search (3 endpoints)
YouTube Search, Lyrics, Spotify Search

### Islam (8 endpoints)
Jadwal Sholat, Al-Quran, Daftar Surah, Hadits, Asmaul Husna, Doa Harian, Kiblat, Zakat

### Meta (no apikey required)
- `GET /api/habibi/stats` — platform stats
- `GET /api/habibi/endpoints` — list all endpoints

### API Key Management
- `POST /api/habibi/apikey/generate` — generate new apikey (body: name, email)
- `GET /api/habibi/apikey/check?apikey=xxx` — check key status

## External API Dependencies
- `api.siputzx.my.id` — most scraper endpoints
- `tikwm.com` — TikTok downloader
- `aladhan.com` — prayer times
- `equran.id / quran.gading.dev` — Al-Quran
- `hadith.gading.dev` — Hadith
- `microlink.io` — website screenshots
- `pollinations.ai` — AI image generation
- `memegen.link` — meme generator

## Database Tables
- `apikeys` — stores API keys with name, email, request count
- `request_logs` — logs every authenticated request

## Deployment
Deploy backend to Railway, frontend to Vercel or both on Replit.
