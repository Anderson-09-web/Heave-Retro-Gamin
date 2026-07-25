import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Gamepad2, Layers, Cpu, Server, Activity, ArrowRight, Zap, Code, Shield } from "lucide-react";
import { useGetPublicStats, useGetPublicCategories } from "@workspace/api-client-react";

export default function Landing() {
  const { data: stats } = useGetPublicStats();
  const { data: categories } = useGetPublicCategories();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <Gamepad2 className="w-6 h-6" />
            <span>Heave Games</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#games" className="hover:text-foreground transition-colors">Games</a>
            <a href="#api" className="hover:text-foreground transition-colors">API Reference</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors">
              Developer Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Activity className="w-4 h-4" />
            <span>API v1.0 is now live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Power your Discord bot <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Heave Games API</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Heave Games API es una plataforma desarrollada por Heave que ofrece una gran colección de juegos, interacciones anime, imágenes, sorteos, herramientas y APIs listas para integrar fácilmente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin/docs" className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
              Read Documentation <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <a href="#endpoints" className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-input bg-background font-medium hover:bg-muted transition-colors w-full sm:w-auto">
              Explore Endpoints
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold font-mono tracking-tight mb-2">{stats?.requestsToday?.toLocaleString() ?? "50K+"}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Requests Today</div>
          </div>
          <div>
            <div className="text-4xl font-bold font-mono tracking-tight mb-2">{stats?.totalEndpoints ?? "50+"}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">API Endpoints</div>
          </div>
          <div>
            <div className="text-4xl font-bold font-mono tracking-tight mb-2">{stats?.totalGames ?? "15"}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Games Included</div>
          </div>
          <div>
            <div className="text-4xl font-bold font-mono tracking-tight mb-2">{stats?.uptime ? `${stats.uptime}%` : "99.9%"}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">A comprehensive suite of tools designed specifically for Discord bot developers and community managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multiplayer Games</h3>
              <p className="text-muted-foreground">Tic Tac Toe, Connect 4, UNO, Chess, Checkers. Fully managed game states through simple REST API calls.</p>
            </Card>

            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anime Interactions</h3>
              <p className="text-muted-foreground">Hug, kiss, pat, slap, cuddle. High-quality curated GIF responses with dynamic text generation.</p>
            </Card>

            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Giveaways System</h3>
              <p className="text-muted-foreground">Create, manage, and roll giveaways. We handle the participant lists, timers, and fair winner selection.</p>
            </Card>

            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Developer SDKs</h3>
              <p className="text-muted-foreground">Native support for discord.py, discord.js, generic Python/JS, TypeScript, and BDFD.</p>
            </Card>

            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Availability</h3>
              <p className="text-muted-foreground">Deployed on edge infrastructure with Redis caching for ultra-low latency response times.</p>
            </Card>

            <Card className="p-8 border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Image Generation</h3>
              <p className="text-muted-foreground">Memes, profile cards, welcome banners. Generate customized images directly from your bot.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Grid from API */}
      <section id="endpoints" className="py-24 px-6 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore Collections</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">Browse our categorized endpoints and assets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <a key={cat.id} href={`/admin/docs?category=${cat.slug}`} className="block group">
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {cat.itemCount} items
                    </span>
                  </div>
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-foreground font-bold tracking-tight">
            <Gamepad2 className="w-5 h-5" />
            <span>Heave Games</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Heave Games. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/admin/docs" className="text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Discord Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
