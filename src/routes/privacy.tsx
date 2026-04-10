import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({ component: PrivacyPage });
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto"><a href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><span className="text-primary-foreground text-sm font-bold">R</span></div><span className="font-display text-lg font-semibold text-foreground">Reflecta</span></a></nav>
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-display font-semibold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground leading-relaxed">Your privacy matters deeply to us. Reflecta stores your reflections securely and gives you full control over your data.</p>
        <h2 className="text-lg font-medium text-foreground">What we collect</h2>
        <p className="text-sm text-muted-foreground">We collect your email for authentication, your reflections and session data, and your preferences. All data is encrypted in transit and at rest.</p>
        <h2 className="text-lg font-medium text-foreground">Your control</h2>
        <p className="text-sm text-muted-foreground">You can view, edit, and delete your memory items, journal entries, and session data at any time. You can delete your account and all associated data.</p>
        <h2 className="text-lg font-medium text-foreground">Third parties</h2>
        <p className="text-sm text-muted-foreground">We do not sell your data. Session content may be processed by AI services to generate reflective responses, summaries, and insights. We do not share identifiable data with third parties.</p>
      </div>
    </div>
  );
}
