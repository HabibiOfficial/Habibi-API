import { Github, Instagram, MessageCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Sosmed() {
  const links = [
    {
      title: "GitHub",
      username: "@HabibiTzy",
      icon: Github,
      url: "https://github.com",
      color: "hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black",
      description: "Check out my open source projects and contributions."
    },
    {
      title: "Instagram",
      username: "@habibitzy_",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white hover:border-transparent",
      description: "Follow me for updates, behind the scenes, and daily life."
    },
    {
      title: "WhatsApp",
      username: "Contact me",
      icon: MessageCircle,
      url: "https://wa.me",
      color: "hover:bg-green-500 hover:text-white hover:border-green-600",
      description: "For business inquiries, collaborations, or urgent matters."
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Connect with me</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find me around the web. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {links.map((link) => (
          <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className={`transition-all duration-300 border-border/50 bg-card ${link.color}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{link.title}</h2>
                    <p className="text-sm opacity-80">{link.username}</p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
