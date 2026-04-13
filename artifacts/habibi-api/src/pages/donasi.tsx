import { Heart, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Donasi() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Support Habibi API</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Habibi API is built and maintained by a single developer. 
          If you find this service useful for your projects, consider supporting to help keep the servers running.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-primary/20 shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" /> Buy me a coffee
            </CardTitle>
            <CardDescription>A small donation to keep me awake coding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start h-14 text-lg font-medium hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/50 transition-colors">
              GoPay (via QRIS)
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 text-lg font-medium hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/50 transition-colors">
              Dana
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 text-lg font-medium hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/50 transition-colors">
              OVO
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle>A Note from HabibiTzy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Halo! Terima kasih sudah menggunakan Habibi API. Saya membangun project ini karena ingin menyediakan layanan API yang cepat, gratis, dan mudah digunakan untuk developer di Indonesia.
            </p>
            <p>
              Menjalankan server dan infrastruktur membutuhkan biaya setiap bulannya. Dukungan kalian, berapapun jumlahnya, sangat berarti untuk memastikan layanan ini tetap hidup dan terus diupdate dengan fitur-fitur baru.
            </p>
            <p className="font-semibold text-foreground">
              Terima kasih banyak atas supportnya! 🙏
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
