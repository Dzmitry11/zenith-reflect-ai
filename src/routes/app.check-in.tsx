import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { EMOTION_OPTIONS } from '@/types';

export const Route = createFileRoute('/app/check-in')({
  component: CheckInPage,
});

function CheckInPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [emotion, setEmotion] = useState('');
  const [supportNeed, setSupportNeed] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const supportOptions = [
    'I just want to vent',
    'Help me process something',
    'I need grounding',
    'Guide me through reflection',
    'I want to journal',
    'Nothing specific right now',
  ];

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('check_ins').insert({
      user_id: user.id,
      mood_score: mood,
      stress_score: stress,
      energy_score: energy,
      primary_emotion: emotion,
      support_need: supportNeed,
      notes: notes || null,
    });
    setSubmitted(true);
    setSaving(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-4xl">🌿</div>
        <h2 className="text-xl font-display font-semibold text-foreground">Check-in saved</h2>
        <p className="text-muted-foreground text-sm">Thank you for taking a moment to notice how you are feeling.</p>
        <div className="rounded-2xl bg-card border border-border p-5 text-left space-y-3">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mood</span><span className="text-foreground">{mood}/10</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Stress</span><span className="text-foreground">{stress}/10</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Energy</span><span className="text-foreground">{energy}/10</span></div>
          {emotion && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Feeling</span><span className="text-foreground">{emotion}</span></div>}
        </div>
        <div className="flex gap-3 justify-center">
          <a href="/app/chat"><Button variant="default">Open a chat about this</Button></a>
          <a href="/app/home"><Button variant="outline">Back to home</Button></a>
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0: Mood
    <div key="mood" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">How is your mood right now?</h2>
        <p className="text-sm text-muted-foreground mt-1">Slide to where feels right. No pressure to be precise.</p>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>Low</span><span className="text-lg">{mood}</span><span>High</span></div>
      </div>
    </div>,
    // Step 1: Stress
    <div key="stress" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">How stressed do you feel?</h2>
        <p className="text-sm text-muted-foreground mt-1">This is about right now, not about the day overall.</p>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>Calm</span><span className="text-lg">{stress}</span><span>Very stressed</span></div>
      </div>
    </div>,
    // Step 2: Energy
    <div key="energy" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">What is your energy level?</h2>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>Drained</span><span className="text-lg">{energy}</span><span>Energized</span></div>
      </div>
    </div>,
    // Step 3: Emotion
    <div key="emotion" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">What emotion is most present?</h2>
        <p className="text-sm text-muted-foreground mt-1">Pick whichever feels closest. There is no wrong answer.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {EMOTION_OPTIONS.map((e) => (
          <button
            key={e.label}
            onClick={() => setEmotion(e.label)}
            className={`px-3 py-2 rounded-xl text-sm border transition-all ${
              emotion === e.label
                ? 'bg-primary/10 border-primary text-primary font-medium'
                : 'bg-card border-border text-foreground hover:border-primary/30'
            }`}
          >
            {e.emoji} {e.label}
          </button>
        ))}
      </div>
    </div>,
    // Step 4: Support need
    <div key="support" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">What kind of support would help?</h2>
      </div>
      <div className="space-y-2">
        {supportOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSupportNeed(opt)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
              supportNeed === opt
                ? 'bg-primary/10 border-primary text-primary font-medium'
                : 'bg-card border-border text-foreground hover:border-primary/30'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>,
    // Step 5: Notes
    <div key="notes" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">Anything else on your mind?</h2>
        <p className="text-sm text-muted-foreground mt-1">Optional. You can keep this brief.</p>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write anything you want to note..."
        className="w-full h-32 p-4 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>,
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        {steps[step]}
      </div>
      <div className="flex gap-3">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < steps.length - 1 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Complete check-in'}
          </Button>
        )}
      </div>
    </div>
  );
}
