import { useState } from "react";
import { useListEndpoints, getListEndpointsQueryKey } from "@workspace/api-client-react";
import { Search, ChevronRight, Play, Terminal, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const STATIC_CATEGORIES = ["Downloader", "Tools", "AI", "Search", "Islam"];

const FALLBACK_ENDPOINTS = [
  { name: "TikTok Downloader", path: "/api/habibi/downloader/tiktok", method: "GET", category: "Downloader", description: "Download video TikTok tanpa watermark", params: ["url"], status: "active", requiresApikey: true },
  { name: "Instagram Downloader", path: "/api/habibi/downloader/instagram", method: "GET", category: "Downloader", description: "Download foto dan video Instagram", params: ["url"], status: "active", requiresApikey: true },
  { name: "Facebook Downloader", path: "/api/habibi/downloader/facebook", method: "GET", category: "Downloader", description: "Download video Facebook", params: ["url"], status: "active", requiresApikey: true },
  { name: "YouTube Audio", path: "/api/habibi/downloader/youtube", method: "GET", category: "Downloader", description: "Download audio dari YouTube", params: ["url"], status: "active", requiresApikey: true },
  { name: "Mediafire Downloader", path: "/api/habibi/downloader/mediafire", method: "GET", category: "Downloader", description: "Download file dari Mediafire", params: ["url"], status: "active", requiresApikey: true },
  { name: "Pinterest Downloader", path: "/api/habibi/downloader/pinterest", method: "GET", category: "Downloader", description: "Download gambar dan video Pinterest", params: ["url"], status: "active", requiresApikey: true },
  { name: "CapCut Downloader", path: "/api/habibi/downloader/capcut", method: "GET", category: "Downloader", description: "Download template dan video CapCut", params: ["url"], status: "active", requiresApikey: true },
  { name: "Snackvideo Downloader", path: "/api/habibi/downloader/snackvideo", method: "GET", category: "Downloader", description: "Download video Snackvideo tanpa watermark", params: ["url"], status: "active", requiresApikey: true },
  { name: "Google Drive Downloader", path: "/api/habibi/downloader/gdrive", method: "GET", category: "Downloader", description: "Ambil link download langsung dari Google Drive", params: ["url"], status: "active", requiresApikey: true },
  { name: "Twitter/X Downloader", path: "/api/habibi/downloader/twitter", method: "GET", category: "Downloader", description: "Download video dari Twitter/X", params: ["url"], status: "active", requiresApikey: true },
  { name: "Spotify Downloader", path: "/api/habibi/downloader/spotify", method: "GET", category: "Downloader", description: "Download lagu dari Spotify", params: ["url"], status: "active", requiresApikey: true },
  { name: "Text-to-Speech", path: "/api/habibi/tools/tts", method: "GET", category: "Tools", description: "Ubah teks menjadi suara (audio)", params: ["text", "lang"], status: "active", requiresApikey: true },
  { name: "Remove Background", path: "/api/habibi/tools/removebg", method: "GET", category: "Tools", description: "Hapus background gambar secara otomatis", params: ["url"], status: "active", requiresApikey: true },
  { name: "Screenshot Website", path: "/api/habibi/tools/screenshot", method: "GET", category: "Tools", description: "Ambil screenshot dari URL website", params: ["url"], status: "active", requiresApikey: true },
  { name: "Emoji Mix", path: "/api/habibi/tools/emojimix", method: "GET", category: "Tools", description: "Gabungkan dua emoji menjadi satu gambar unik", params: ["emoji1", "emoji2"], status: "active", requiresApikey: true },
  { name: "Brat Sticker", path: "/api/habibi/tools/brat", method: "GET", category: "Tools", description: "Buat stiker brat dengan teks custom", params: ["text"], status: "active", requiresApikey: true },
  { name: "IQ Card", path: "/api/habibi/tools/iqcard", method: "GET", category: "Tools", description: "Buat kartu IQ random dengan nama", params: ["name"], status: "active", requiresApikey: true },
  { name: "Meme Generator", path: "/api/habibi/tools/meme", method: "GET", category: "Tools", description: "Buat meme dengan teks atas dan bawah", params: ["template", "top", "bottom"], status: "active", requiresApikey: true },
  { name: "iPhone Chat Maker", path: "/api/habibi/tools/iphonechat", method: "GET", category: "Tools", description: "Buat screenshot percakapan ala iPhone", params: ["sender", "message", "time"], status: "active", requiresApikey: true },
  { name: "Quote Card", path: "/api/habibi/tools/quote", method: "GET", category: "Tools", description: "Buat kartu kutipan yang estetik", params: ["text", "author"], status: "active", requiresApikey: true },
  { name: "Translate", path: "/api/habibi/tools/translate", method: "GET", category: "Tools", description: "Terjemahkan teks ke bahasa apapun", params: ["text", "from", "to"], status: "active", requiresApikey: true },
  { name: "Cuaca / Weather", path: "/api/habibi/tools/weather", method: "GET", category: "Tools", description: "Cek cuaca berdasarkan nama kota", params: ["city"], status: "active", requiresApikey: true },
  { name: "Sticker Maker", path: "/api/habibi/tools/sticker", method: "GET", category: "Tools", description: "Ubah gambar menjadi stiker WhatsApp (webp)", params: ["url"], status: "active", requiresApikey: true },
  { name: "Watermark", path: "/api/habibi/tools/wm", method: "GET", category: "Tools", description: "Tambahkan teks watermark ke gambar", params: ["url", "text"], status: "active", requiresApikey: true },
  { name: "AI Chat (Gemini)", path: "/api/habibi/ai/chat", method: "GET", category: "AI", description: "Chat dengan AI menggunakan Google Gemini", params: ["text"], status: "active", requiresApikey: true },
  { name: "AI Image Generate", path: "/api/habibi/ai/image", method: "GET", category: "AI", description: "Generate gambar dari deskripsi teks", params: ["prompt"], status: "active", requiresApikey: true },
  { name: "YouTube Search", path: "/api/habibi/search/youtube", method: "GET", category: "Search", description: "Cari video YouTube berdasarkan kata kunci", params: ["query"], status: "active", requiresApikey: true },
  { name: "Lirik Lagu", path: "/api/habibi/search/lyrics", method: "GET", category: "Search", description: "Cari lirik lagu berdasarkan judul dan artis", params: ["title", "artist"], status: "active", requiresApikey: true },
  { name: "Spotify Search", path: "/api/habibi/search/spotify", method: "GET", category: "Search", description: "Cari lagu di Spotify berdasarkan kata kunci", params: ["query"], status: "active", requiresApikey: true },
  { name: "Jadwal Sholat", path: "/api/habibi/islam/sholat", method: "GET", category: "Islam", description: "Jadwal waktu sholat berdasarkan kota", params: ["city"], status: "active", requiresApikey: true },
  { name: "Al-Quran", path: "/api/habibi/islam/quran", method: "GET", category: "Islam", description: "Baca ayat Al-Quran berdasarkan surah dan ayat", params: ["surah", "ayat"], status: "active", requiresApikey: true },
  { name: "Daftar Surah", path: "/api/habibi/islam/surah", method: "GET", category: "Islam", description: "Daftar semua surah dalam Al-Quran", params: [], status: "active", requiresApikey: true },
  { name: "Hadits", path: "/api/habibi/islam/hadits", method: "GET", category: "Islam", description: "Ambil hadits acak dari berbagai kitab", params: ["kitab"], status: "active", requiresApikey: true },
  { name: "Asmaul Husna", path: "/api/habibi/islam/asmaul", method: "GET", category: "Islam", description: "99 Asmaul Husna dengan arti dan penjelasan", params: [], status: "active", requiresApikey: true },
  { name: "Doa Harian", path: "/api/habibi/islam/doa", method: "GET", category: "Islam", description: "Doa-doa harian dengan Arab, latin, dan artinya", params: [], status: "active", requiresApikey: true },
  { name: "Arah Kiblat", path: "/api/habibi/islam/kiblat", method: "GET", category: "Islam", description: "Hitung arah kiblat berdasarkan koordinat", params: ["lat", "lng"], status: "active", requiresApikey: true },
  { name: "Kalkulator Zakat", path: "/api/habibi/islam/zakat", method: "GET", category: "Islam", description: "Hitung zakat mal berdasarkan total harta", params: ["amount"], status: "active", requiresApikey: true },
];

export function Docs() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(STATIC_CATEGORIES[0]);
  const [testApikey, setTestApikey] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const { data: endpointData, isLoading } = useListEndpoints({ 
    query: { queryKey: getListEndpointsQueryKey() } 
  });

  const endpoints = (endpointData?.endpoints && endpointData.endpoints.length > 0)
    ? endpointData.endpoints
    : FALLBACK_ENDPOINTS;
  
  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch = ep.name.toLowerCase().includes(search.toLowerCase()) || 
                          ep.path.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = ep.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTest = async (endpoint: any) => {
    if (endpoint.requiresApikey && !testApikey) {
      setTestResult({ error: "API Key required" });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    try {
      const url = new URL(endpoint.path, window.location.origin);
      if (endpoint.requiresApikey) {
        url.searchParams.append("apikey", testApikey);
      }
      
      const res = await fetch(url.toString(), {
        method: endpoint.method,
      });
      
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message || "Failed to fetch" });
    } finally {
      setIsTesting(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "POST": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">API Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Explore all available endpoints. Requires an API key for most requests.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold mb-3 px-2 text-sm uppercase tracking-wider text-muted-foreground">Categories</h3>
            {STATIC_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted text-foreground/80"
                }`}
              >
                {category}
                <ChevronRight className={`h-4 w-4 ${activeCategory === category ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border mt-8">
            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4" /> Global Settings
            </h4>
            <div className="space-y-3 mt-4">
              <div className="space-y-1.5">
                <Label htmlFor="test-apikey" className="text-xs">Test API Key</Label>
                <Input
                  id="test-apikey"
                  placeholder="Enter API key for testing"
                  className="h-8 text-xs font-mono"
                  value={testApikey}
                  onChange={(e) => setTestApikey(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {isLoading && endpoints.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEndpoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border rounded-xl border-dashed">
              <Search className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No endpoints found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or category</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">{activeCategory}</h2>
              
              {filteredEndpoints.map((ep, i) => (
                <Card key={i} className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`${getMethodColor(ep.method)} uppercase`}>
                          {ep.method}
                        </Badge>
                        <CardTitle className="text-lg font-mono text-primary/90">{ep.path}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {ep.requiresApikey && (
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground gap-1">
                            <Lock className="h-3 w-3" /> Auth
                          </Badge>
                        )}
                        <Badge variant={ep.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                          {ep.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base mt-2 text-foreground/80">{ep.name}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">{ep.description}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="params" className="w-full">
                      <div className="border-b px-4 bg-muted/10">
                        <TabsList className="bg-transparent">
                          <TabsTrigger value="params" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Parameters</TabsTrigger>
                          <TabsTrigger value="test" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Test</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="params" className="p-4 m-0">
                        {ep.params && ep.params.length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold mb-3">Query Parameters</h4>
                            <ul className="space-y-2">
                              {ep.params.map((param, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm border p-2 rounded-md bg-muted/20">
                                  <code className="font-mono text-primary bg-primary/10 px-1 rounded">{param}</code>
                                  <span className="text-muted-foreground">- Required string parameter</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No parameters required.</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="test" className="p-4 m-0 space-y-4">
                        <div className="flex items-center gap-4">
                          <Button 
                            onClick={() => handleTest(ep)} 
                            disabled={isTesting || ep.status !== 'active'}
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" /> Run Request
                          </Button>
                          {ep.requiresApikey && !testApikey && (
                            <span className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Set API key in Global Settings
                            </span>
                          )}
                        </div>
                        
                        {testResult && (
                          <div className="mt-4 rounded-md bg-zinc-950 p-4 overflow-x-auto border border-zinc-800">
                            <pre className="text-xs text-zinc-300 font-mono">
                              {JSON.stringify(testResult, null, 2)}
                            </pre>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
