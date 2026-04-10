import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({ component: AboutPage });

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <a href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><span className="text-primary-foreground text-sm font-bold">R</span></div><span className="font-display text-lg font-semibold text-foreground">Reflecta</span></a>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">About Reflecta</h1>
        <p className="text-muted-foreground leading-relaxed">Reflecta is a structured self-reflection companion designed to help you understand your emotional patterns, prepare for therapy, and build clarity — one conversation at a time.</p>
        <p className="text-muted-foreground leading-relaxed">We believe that emotional self-awareness is a skill that can be developed with the right support. Reflecta provides calming, structured tools for journaling, check-ins, and guided reflection without replacing professional care.</p>
        <div className="rounded-xl bg-muted p-4"><p className="text-xs text-muted-foreground">Reflecta is not a therapist, diagnostic tool, or crisis service. For professional support, please consult a licensed provider.</p></div>
      </div>
    </div>
  );
}
