import { Link } from "wouter";
import { TerminalSquare, Activity, ArrowRight, Zap, Code, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats, getGetStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";

export function Home() {
  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
          <Activity className="mr-2 h-4 w-4" />
          <span>v{stats?.version || "1.0.0"} is live now</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          The <span className="text-gradient">REST API</span> for Indonesian Developers
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          A powerful, self-hosted API service crafted by HabibiTzy. High performance, zero bloat, completely free for the community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/docs">
            <Button size="lg" className="font-semibold px-8 h-12">
              Explore Docs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/apikey">
            <Button size="lg" variant="outline" className="font-semibold px-8 h-12">
              Get API Key
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats?.totalEndpoints || "100+"}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Endpoints</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats?.totalRequests ? new Intl.NumberFormat().format(stats.totalRequests) : "1M+"}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Total Requests</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats?.totalApikeys || "500+"}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Active Keys</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats?.uptime || "99.9%"}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why use Habibi API?</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized endpoints running on high-performance infrastructure to ensure the lowest latency possible.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <Code className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Developer First</h3>
              <p className="text-muted-foreground">
                Clear documentation, simple parameters, and predictable JSON responses. Built by developers, for developers.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Reliable</h3>
              <p className="text-muted-foreground">
                High uptime with constant monitoring. We treat our free tier with the same respect as a paid enterprise API.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Downloader", "Tools", "AI", "Search", "Islam"].map((category) => (
            <Link key={category} href={`/docs`}>
              <Card className="bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <h3 className="font-bold">{category}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
