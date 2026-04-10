import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/help')({ component: HelpPage });
function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto"><a href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><span className="text-primary-foreground text-sm font-bold">R</span></div><span className="font-display text-lg font-semibold text-foreground">Reflecta</span></a></nav>
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">Help & FAQ</h1>
        {[
          { q: 'What is Reflecta?', a: 'Reflecta is a self-reflection companion that helps you journal, check in with your emotions, and prepare for therapy sessions. It is not a therapist or crisis service.' },
          { q: 'Is my data private?', a: 'Yes. Your reflections are stored securely and you have full control to view, edit, or delete them at any time.' },
          { q: 'Can Reflecta diagnose me?', a: 'No. Reflecta does not diagnose conditions. It helps you notice patterns and organize your thoughts for professional conversations.' },
          { q: 'What if I am in crisis?', a: 'Please contact your local emergency services, a crisis helpline, or a trusted person near you. Reflecta is not equipped for emergency support.' },
          { q: 'How does the memory system work?', a: 'Reflecta captures patterns and context from your sessions. You can review, confirm, edit, hide, or delete any memory item at any time.' },
          { q: 'What is therapy prep?', a: 'A structured form to organize key events, emotions, triggers, and questions before your therapy session. You can copy or print the summary.' },
        ].map((item) => (
          <div key={item.q} className="space-y-2">
            <h2 className="text-base font-medium text-foreground">{item.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
