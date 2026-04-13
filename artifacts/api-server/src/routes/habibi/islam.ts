import { Router } from "express";
import axios from "axios";
import { validateApikey, successResponse, errorResponse } from "./middleware.js";

const router = Router();
const http = axios.create({ timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } });

router.get("/sholat", validateApikey, async (req, res) => {
  const { city = "Jakarta" } = req.query as { city?: string };
  try {
    const { data: geoData } = await http.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=ID&method=11`);
    if (geoData?.code !== 200) { res.status(500).json(errorResponse("Gagal mendapatkan jadwal sholat.")); return; }
    const t = geoData.data.timings;
    res.json(successResponse({
      city,
      date: geoData.data.date.readable,
      timings: { Subuh: t.Fajr, Dzuhur: t.Dhuhr, Ashar: t.Asr, Maghrib: t.Maghrib, Isya: t.Isha, Imsak: t.Imsak },
      hijri: geoData.data.date.hijri.date,
    }, "aladhan.com"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mendapatkan jadwal sholat. Coba lagi."));
  }
});

router.get("/quran", validateApikey, async (req, res) => {
  const { surah = "1", ayat = "1" } = req.query as { surah?: string; ayat?: string };
  try {
    const { data } = await http.get(`https://api.quran.gading.dev/surah/${surah}/${ayat}`);
    if (!data?.data) { res.status(404).json(errorResponse("Ayat tidak ditemukan.")); return; }
    res.json(successResponse(data.data, "quran.gading.dev"));
  } catch (e) {
    try {
      const { data } = await http.get(`https://equran.id/api/v2/surat/${surah}`);
      const ayatNum = parseInt(ayat);
      const ayatData = data?.data?.ayat?.find((a: Record<string, unknown>) => a.nomorAyat === ayatNum);
      res.json(successResponse(ayatData || data?.data, "equran.id"));
    } catch {
      res.status(500).json(errorResponse("Gagal mengambil data Al-Quran."));
    }
  }
});

router.get("/surah", validateApikey, async (req, res) => {
  try {
    const { data } = await http.get("https://equran.id/api/v2/surat");
    if (!data?.data) { res.status(500).json(errorResponse("Gagal mengambil daftar surah.")); return; }
    res.json(successResponse(data.data, "equran.id"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mengambil daftar surah. Coba lagi."));
  }
});

router.get("/hadits", validateApikey, async (req, res) => {
  const { kitab = "bukhari" } = req.query as { kitab?: string };
  const validKitab = ["abu-dawud", "ahmad", "bukhari", "darimi", "ibnu-majah", "malik", "muslim", "nasai", "tirmidzi"];
  const k = validKitab.includes(kitab) ? kitab : "bukhari";
  try {
    const { data } = await http.get(`https://api.hadith.gading.dev/books/${k}?range=1-10`);
    if (!data?.data) { res.status(500).json(errorResponse("Gagal mengambil hadits.")); return; }
    const hadiths = data.data.hadiths;
    const random = hadiths[Math.floor(Math.random() * hadiths.length)];
    res.json(successResponse({ kitab: k, hadits: random }, "hadith.gading.dev"));
  } catch (e) {
    res.status(500).json(errorResponse("Gagal mengambil hadits. Coba lagi."));
  }
});

const ASMAUL_HUSNA = [
  { no: 1, arab: "الرَّحْمَنُ", latin: "Ar-Rahman", arti: "Yang Maha Pengasih" },
  { no: 2, arab: "الرَّحِيمُ", latin: "Ar-Rahim", arti: "Yang Maha Penyayang" },
  { no: 3, arab: "الْمَلِكُ", latin: "Al-Malik", arti: "Yang Maha Merajai" },
  { no: 4, arab: "الْقُدُّوسُ", latin: "Al-Quddus", arti: "Yang Maha Suci" },
  { no: 5, arab: "السَّلَامُ", latin: "As-Salam", arti: "Yang Memberi Kesejahteraan" },
  { no: 6, arab: "الْمُؤْمِنُ", latin: "Al-Mumin", arti: "Yang Memberi Keamanan" },
  { no: 7, arab: "الْمُهَيْمِنُ", latin: "Al-Muhaymin", arti: "Yang Maha Memelihara" },
  { no: 8, arab: "الْعَزِيزُ", latin: "Al-Aziz", arti: "Yang Memiliki Mutlak Kegagahan" },
  { no: 9, arab: "الْجَبَّارُ", latin: "Al-Jabbar", arti: "Yang Maha Perkasa" },
  { no: 10, arab: "الْمُتَكَبِّرُ", latin: "Al-Mutakabbir", arti: "Yang Maha Megah" },
];

router.get("/asmaul", validateApikey, async (req, res) => {
  try {
    const { data } = await http.get("https://api.siputzx.my.id/api/r/asmaul-husna");
    if (data?.status) {
      res.json(successResponse(data.data, "api.siputzx.my.id"));
      return;
    }
  } catch (_) {}
  res.json(successResponse(ASMAUL_HUSNA, "HabibiAPI"));
});

const DOA_HARIAN = [
  { nama: "Doa Sebelum Tidur", arab: "بِسْمِكَ اللّٰهُمَّ أَحْيَا وَبِسْمِكَ أَمُوتُ", latin: "Bismika Allahumma ahya wa bismika amut", arti: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati" },
  { nama: "Doa Bangun Tidur", arab: "اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ", latin: "Alhamdu lillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur", arti: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali" },
  { nama: "Doa Makan", arab: "اَللّٰهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ", latin: "Allaahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar", arti: "Ya Allah berkahilah kami dalam rizki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka" },
  { nama: "Doa Sesudah Makan", arab: "اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ", latin: "Alhamdulillahil ladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin", arti: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang Islam" },
  { nama: "Doa Masuk Kamar Mandi", arab: "اَللّٰهُمَّ إِنِّيْ أَعُوذُبِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ", latin: "Allaahumma innii a'uudzubika minal khubutsi wal khabaa-its", arti: "Ya Allah sesungguhnya aku berlindung kepada-Mu dari kotoran dan hal-hal yang menjijikkan" },
];

router.get("/doa", validateApikey, async (req, res) => {
  try {
    const { data } = await http.get("https://api.siputzx.my.id/api/r/doa");
    if (data?.status) {
      res.json(successResponse(data.data, "api.siputzx.my.id"));
      return;
    }
  } catch (_) {}
  res.json(successResponse(DOA_HARIAN, "HabibiAPI"));
});

router.get("/kiblat", validateApikey, async (req, res) => {
  const { lat, lng } = req.query as { lat?: string; lng?: string };
  if (!lat || !lng) { res.status(400).json(errorResponse("Parameter lat dan lng diperlukan.")); return; }
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (isNaN(latitude) || isNaN(longitude)) { res.status(400).json(errorResponse("Nilai lat/lng tidak valid.")); return; }
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;
  const dLng = (KAABA_LNG - longitude) * (Math.PI / 180);
  const lat1 = latitude * (Math.PI / 180);
  const lat2 = KAABA_LAT * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  bearing = (bearing + 360) % 360;
  res.json(successResponse({ lat: latitude, lng: longitude, arah_kiblat: bearing.toFixed(2), satuan: "derajat dari Utara", keterangan: `Kiblat berada di ${bearing.toFixed(1)} derajat dari arah Utara` }, "HabibiAPI"));
});

router.get("/zakat", validateApikey, async (req, res) => {
  const { amount } = req.query as { amount?: string };
  if (!amount) { res.status(400).json(errorResponse("Parameter amount (jumlah harta dalam rupiah) diperlukan.")); return; }
  const harta = parseFloat(amount);
  if (isNaN(harta)) { res.status(400).json(errorResponse("Nilai amount tidak valid.")); return; }
  const NISAB_GRAM_EMAS = 85;
  const HARGA_EMAS_PER_GRAM = 1000000;
  const nisab = NISAB_GRAM_EMAS * HARGA_EMAS_PER_GRAM;
  const wajibZakat = harta >= nisab;
  const zakatAmount = wajibZakat ? harta * 0.025 : 0;
  res.json(successResponse({
    jumlah_harta: harta,
    nisab,
    wajib_zakat: wajibZakat,
    zakat_2_5_persen: zakatAmount,
    keterangan: wajibZakat
      ? `Harta Anda melebihi nisab. Zakat yang harus dibayar: Rp ${zakatAmount.toLocaleString("id-ID")}`
      : `Harta Anda belum mencapai nisab (Rp ${nisab.toLocaleString("id-ID")}). Belum wajib zakat.`,
  }, "HabibiAPI"));
});

export default router;
