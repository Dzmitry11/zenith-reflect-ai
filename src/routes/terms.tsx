import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({ component: TermsPage });
function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto"><a href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><span className="text-primary-foreground text-sm font-bold">R</span></div><span className="font-display text-lg font-semibold text-foreground">Reflecta</span></a></nav>
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-display font-semibold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground leading-relaxed">By using Reflecta, you agree to the following terms.</p>
        <h2 className="text-lg font-medium text-foreground">Nature of the service</h2>
        <p className="text-sm text-muted-foreground">Reflecta is a self-reflection and journaling tool. It is not therapy, medical advice, a diagnostic tool, or crisis support. It does not provide professional mental health services.</p>
        <h2 className="text-lg font-medium text-foreground">Your responsibility</h2>
        <p className="text-sm text-muted-foreground">You are responsible for seeking professional help when needed. In emergencies, contact your local emergency services or crisis helpline.</p>
        <h2 className="text-lg font-medium text-foreground">Content</h2>
        <p className="text-sm text-muted-foreground">You own your reflections and journal entries. We store them securely to provide the service. AI-generated responses are suggestions, not professional advice.</p>
      </div>
    </div>
  );
}
