import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Brain, ClipboardList, BarChart3, Shield, ChevronRight, Check } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: 'Reflecta — Your Reflective AI Companion' },
      { name: 'description', content: 'A calmer way to make sense of what you are feeling. Reflect, journal, and prepare for therapy with structured AI support.' },
      { property: 'og:title', content: 'Reflecta — Your Reflective AI Companion' },
      { property: 'og:description', content: 'Emotional clarity, one conversation at a time.' },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">R</span>
          </div>
          <span className="font-display text-lg font-semibold text-foreground">Reflecta</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login"><Button variant="ghost" size="sm">Sign in</Button></a>
          <a href="/signup"><Button size="sm">Get started</Button></a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground leading-tight text-balance">
          A calmer way to make sense of what you're feeling
        </h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
          Reflect, journal, and prepare for therapy with structured support. Emotional clarity, one conversation at a time.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <a href="/signup"><Button size="lg" variant="hero">Start reflecting <ChevronRight className="w-4 h-4" /></Button></a>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Free to start. No credit card required.</p>
      </section>

      {/* Trust */}
      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="rounded-2xl bg-surface border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reflecta is a self-reflection companion — not a therapist, not a diagnostic tool, and not crisis support.
            It helps you organize your thoughts, understand your patterns, and prepare for professional sessions.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold text-foreground text-center mb-12">
          Tools for emotional clarity
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: 'Daily Check-ins', desc: 'Notice how you feel with quick, calming emotional snapshots.' },
            { icon: MessageCircle, title: 'Guided Conversations', desc: 'Work through what is on your mind with structured reflective sessions.' },
            { icon: ClipboardList, title: 'Therapy Preparation', desc: 'Organize your thoughts and arrive at sessions prepared and clear.' },
            { icon: Brain, title: 'Memory & Context', desc: 'The app remembers what matters — and you control every piece of it.' },
            { icon: BarChart3, title: 'Emotional Insights', desc: 'See your patterns, triggers, and growth over time.' },
            { icon: Shield, title: 'Safe & Private', desc: 'Your reflections are your own. Full data control, always.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-card border border-border p-6 space-y-3">
              <f.icon className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold text-foreground text-center mb-10">How it works</h2>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Check in with yourself', desc: 'A quick emotional snapshot — mood, stress, energy, and what feels most present.' },
            { step: '2', title: 'Reflect through conversation', desc: 'Choose a mode: break down a situation, journal, or open reflection.' },
            { step: '3', title: 'See your patterns', desc: 'Over time, insights reveal your triggers, growth, and emotional rhythms.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">{s.step}</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold text-foreground text-center mb-10">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-display font-semibold text-foreground">Free</h3>
            <p className="text-2xl font-display font-bold text-foreground mt-1">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />3 sessions per week</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Basic check-ins & journaling</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />5 memory items</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-calm/10 p-6">
            <h3 className="font-display font-semibold text-foreground">Premium</h3>
            <p className="text-2xl font-display font-bold text-foreground mt-1">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Unlimited everything</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Full insights & therapy prep</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Weekly summaries</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Ready to start reflecting?</h2>
        <p className="text-muted-foreground text-sm mb-6">You don't need to figure everything out at once. Start with what feels most present.</p>
        <a href="/signup"><Button size="lg" variant="hero">Create your free account</Button></a>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">R</span>
            </div>
            <span className="text-sm text-muted-foreground">Reflecta</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/about" className="hover:text-foreground">About</a>
            <a href="/help" className="hover:text-foreground">Help</a>
            <a href="/privacy" className="hover:text-foreground">Privacy</a>
            <a href="/terms" className="hover:text-foreground">Terms</a>
          </div>
          <p className="text-xs text-muted-foreground">Not therapy. Not crisis support. For self-reflection only.</p>
        </div>
      </footer>
    </div>
  );
}
