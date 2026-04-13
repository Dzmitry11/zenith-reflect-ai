import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CompanionAvatarPicker, type CompanionId } from '@/components/CompanionAvatarPicker';

export const Route = createFileRoute('/app/onboarding')({ component: OnboardingPage });

function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [companion, setCompanion] = useState<CompanionId>('aurora');
  const [tone, setTone] = useState('warm_and_gentle');
  const [goal, setGoal] = useState('');
  const [sessionLen, setSessionLen] = useState('10');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const goals = ['Anxiety / mental overload', 'Journaling and reflection', 'Therapy preparation', 'Emotional clarity', 'Relationship stress', 'Burnout / stress'];

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    await Promise.all([
      supabase.from('profiles').update({ display_name: name, onboarding_completed: true }).eq('id', user.id),
      supabase.from('user_preferences').update({ tone_preference: tone, main_goal: goal, preferred_session_length: sessionLen, memory_enabled: memoryEnabled, companion_avatar: companion }).eq('user_id', user.id),
    ]);
    window.location.href = '/app/home';
  };

  const steps = [
    <div key="name" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">What should we call you?</h2>
      <p className="text-sm text-muted-foreground">A first name or nickname is fine.</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>,
    <CompanionAvatarPicker key="companion" selected={companion} onChange={setCompanion} />,
    <div key="tone" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">How should Reflecta talk to you?</h2>
      <div className="space-y-2">
        {[{ v: 'warm_and_gentle', l: 'Warm and gentle' }, { v: 'warm_and_structured', l: 'Warm and structured' }, { v: 'concise_and_grounding', l: 'Concise and grounding' }].map((o) => (
          <button key={o.v} onClick={() => setTone(o.v)} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${tone === o.v ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{o.l}</button>
        ))}
      </div>
    </div>,
    <div key="goal" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">What brings you here?</h2>
      <div className="space-y-2">
        {goals.map((g) => (
          <button key={g} onClick={() => setGoal(g)} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${goal === g ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{g}</button>
        ))}
      </div>
    </div>,
    <div key="prefs" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">A few preferences</h2>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Preferred session length</label>
        <div className="flex gap-2">
          {['5', '10', '15'].map((l) => (
            <button key={l} onClick={() => setSessionLen(l)} className={`flex-1 py-3 rounded-xl text-sm border transition-all ${sessionLen === l ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{l} min</button>
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between">
        <div><span className="text-sm text-foreground block">Enable memory</span><span className="text-xs text-muted-foreground">Let Reflecta remember context across sessions</span></div>
        <button onClick={() => setMemoryEnabled(!memoryEnabled)} className={`w-10 h-6 rounded-full transition-colors ${memoryEnabled ? 'bg-primary' : 'bg-border'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${memoryEnabled ? 'translate-x-4' : ''}`} /></button>
      </label>
    </div>,
    <div key="consent" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">Before we begin</h2>
      <div className="rounded-xl bg-calm/10 border border-calm/20 p-4 space-y-3 text-sm text-muted-foreground">
        <p>By continuing, you understand that:</p>
        <ul className="space-y-1.5 ml-4 list-disc">
          <li>Reflecta stores your reflections to provide a personalized experience</li>
          <li>You can view, edit, and delete your data at any time</li>
          <li>Reflecta is not therapy, not a diagnostic tool, and not crisis support</li>
          <li>For emergencies, contact local emergency services</li>
        </ul>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex gap-1 mb-2">
          {steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />)}
        </div>
        {steps[step]}
        <div className="flex gap-3">
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < steps.length - 1 ? (
            <Button className="flex-1" onClick={() => setStep(step + 1)} disabled={step === 0 && !name.trim()}>Continue</Button>
          ) : (
            <Button className="flex-1" onClick={handleComplete} disabled={saving}>{saving ? 'Setting up...' : 'Start reflecting'}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
