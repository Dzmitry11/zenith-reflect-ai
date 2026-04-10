import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/safety')({
  component: SafetyPage,
});

function SafetyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Safety & Help</h1>
        <p className="text-sm text-muted-foreground mt-1">Your wellbeing matters. Here is what Reflecta can and cannot do.</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">What Reflecta can help with</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">✓</span> Structured self-reflection and emotional check-ins</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Guided journaling with thoughtful prompts</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Preparing for therapy sessions</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Identifying emotional patterns over time</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Breaking down situations to separate facts from fears</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Providing a calm space to process your day</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-warm/30 border border-warm/40 p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">What Reflecta is not</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> Not a therapist or licensed mental health professional</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> Not a diagnostic tool — it does not diagnose conditions</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> Not crisis support or emergency services</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> Not a replacement for professional treatment</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">If you are in crisis</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you or someone you know is in immediate danger or experiencing a mental health crisis, please take these steps:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span>🚨</span> Contact your local emergency services (e.g., 911, 112, 999)</li>
          <li className="flex gap-2"><span>📞</span> Reach out to a crisis helpline in your country</li>
          <li className="flex gap-2"><span>🤝</span> Talk to a trusted person near you — a friend, family member, or colleague</li>
          <li className="flex gap-2"><span>🏥</span> Visit your nearest emergency room or urgent care</li>
          <li className="flex gap-2"><span>👩‍⚕️</span> Contact a licensed mental health professional</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-4">
          You deserve support. Reflecta is not equipped to provide emergency care, but there are people and services that can help you right now.
        </p>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Reflecta is designed as a self-reflection companion. It uses structured prompts and optional AI to help you explore your thoughts and feelings.
          It stores your reflections securely and gives you full control over your data. For professional support, please consult a qualified provider.
        </p>
      </div>
    </div>
  );
}
