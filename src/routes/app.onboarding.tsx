import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CompanionAvatarPicker, type CompanionId } from '@/components/CompanionAvatarPicker';
import { useLanguage } from '@/i18n/LanguageContext';
import { LOCALE_LABELS, type Locale } from '@/i18n/translations';

export const Route = createFileRoute('/app/onboarding')({ component: OnboardingPage });

function OnboardingPage() {
  const { user } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [companion, setCompanion] = useState<CompanionId>('aurora');
  const [tone, setTone] = useState('warm_and_gentle');
  const [goal, setGoal] = useState('');
  const [sessionLen, setSessionLen] = useState('10');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const goals = [t('anxiety'), t('journaling'), t('therapyPreparation'), t('emotionalClarity'), t('relationshipStress'), t('burnout')];

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    await Promise.all([
      supabase.from('profiles').update({ display_name: name, onboarding_completed: true, locale }).eq('id', user.id),
      supabase.from('user_preferences').update({ tone_preference: tone, main_goal: goal, preferred_session_length: sessionLen, memory_enabled: memoryEnabled, companion_avatar: companion }).eq('user_id', user.id),
    ]);
    window.location.href = '/app/home';
  };

  const steps = [
    // Language selection
    <div key="language" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('language')}</h2>
      <div className="space-y-2">
        {(['en', 'sv', 'ru'] as Locale[]).map((loc) => (
          <button key={loc} onClick={() => setLocale(loc)} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${locale === loc ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>
    </div>,
    <div key="name" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('whatToCallYou')}</h2>
      <p className="text-sm text-muted-foreground">{t('nameHint')}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('yourName')} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>,
    <CompanionAvatarPicker key="companion" selected={companion} onChange={setCompanion} />,
    <div key="tone" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('howShouldTalk')}</h2>
      <div className="space-y-2">
        {[{ v: 'warm_and_gentle', l: t('warmGentle') }, { v: 'warm_and_structured', l: t('warmStructured') }, { v: 'concise_and_grounding', l: t('conciseGrounding') }].map((o) => (
          <button key={o.v} onClick={() => setTone(o.v)} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${tone === o.v ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{o.l}</button>
        ))}
      </div>
    </div>,
    <div key="goal" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('whatBringsYou')}</h2>
      <div className="space-y-2">
        {goals.map((g) => (
          <button key={g} onClick={() => setGoal(g)} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${goal === g ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{g}</button>
        ))}
      </div>
    </div>,
    <div key="prefs" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('fewPreferences')}</h2>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">{t('preferredLength')}</label>
        <div className="flex gap-2">
          {['5', '10', '15'].map((l) => (
            <button key={l} onClick={() => setSessionLen(l)} className={`flex-1 py-3 rounded-xl text-sm border transition-all ${sessionLen === l ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>{l} min</button>
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between">
        <div><span className="text-sm text-foreground block">{t('enableMemory')}</span><span className="text-xs text-muted-foreground">{t('memoryContext')}</span></div>
        <button onClick={() => setMemoryEnabled(!memoryEnabled)} className={`w-10 h-6 rounded-full transition-colors ${memoryEnabled ? 'bg-primary' : 'bg-border'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${memoryEnabled ? 'translate-x-4' : ''}`} /></button>
      </label>
    </div>,
    <div key="consent" className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">{t('beforeWeBegin')}</h2>
      <div className="rounded-xl bg-calm/10 border border-calm/20 p-4 space-y-3 text-sm text-muted-foreground">
        <p>{t('consentIntro')}</p>
        <ul className="space-y-1.5 ml-4 list-disc">
          <li>{t('consentStore')}</li>
          <li>{t('consentControl')}</li>
          <li>{t('consentNotTherapy')}</li>
          <li>{t('consentEmergency')}</li>
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
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>{t('back')}</Button>}
          {step < steps.length - 1 ? (
            <Button className="flex-1" onClick={() => setStep(step + 1)} disabled={step === 1 && !name.trim()}>{t('continue_')}</Button>
          ) : (
            <Button className="flex-1" onClick={handleComplete} disabled={saving}>{saving ? t('settingUp') : t('startReflecting')}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
