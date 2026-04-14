import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { EMOTION_OPTIONS } from '@/types';
import { FadeIn, ScaleIn } from '@/components/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

export const Route = createFileRoute('/app/check-in')({
  component: CheckInPage,
});

function CheckInPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
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
    t('supportVent'),
    t('supportProcess'),
    t('supportGrounding'),
    t('supportReflection'),
    t('supportJournal'),
    t('supportNothing'),
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
        <ScaleIn>
          <div className="text-4xl">🌿</div>
          <h2 className="text-xl font-display font-semibold text-foreground mt-4">{t('checkInSaved')}</h2>
          <p className="text-muted-foreground text-sm mt-2">{t('checkInThanks')}</p>
        </ScaleIn>
        <FadeIn delay={0.2}>
          <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 p-5 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('mood')}</span><span className="text-foreground">{mood}/10</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('stress')}</span><span className="text-foreground">{stress}/10</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('energy')}</span><span className="text-foreground">{energy}/10</span></div>
            {emotion && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t('feeling')}</span><span className="text-foreground">{emotion}</span></div>}
          </div>
        </FadeIn>
        <FadeIn delay={0.35}>
          <div className="flex gap-3 justify-center">
            <a href="/app/chat"><Button variant="default">{t('openChatAbout')}</Button></a>
            <a href="/app/home"><Button variant="outline">{t('backToHome')}</Button></a>
          </div>
        </FadeIn>
      </div>
    );
  }

  const steps = [
    <div key="mood" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('moodQuestion')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('moodHint')}</p>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>{t('low')}</span><span className="text-lg">{mood}</span><span>{t('high')}</span></div>
      </div>
    </div>,
    <div key="stress" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('stressQuestion')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('stressHint')}</p>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>{t('calm')}</span><span className="text-lg">{stress}</span><span>{t('veryStressed')}</span></div>
      </div>
    </div>,
    <div key="energy" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('energyQuestion')}</h2>
      </div>
      <div className="space-y-3">
        <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>{t('drained')}</span><span className="text-lg">{energy}</span><span>{t('energized')}</span></div>
      </div>
    </div>,
    <div key="emotion" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('emotionQuestion')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('emotionHint')}</p>
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
    <div key="support" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('supportQuestion')}</h2>
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
    <div key="notes" className="space-y-6">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{t('anythingElse')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('anythingElseHint')}</p>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('writePlaceholder')}
        className="w-full h-32 p-4 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>,
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>{t('back')}</Button>}
        {step < steps.length - 1 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>{t('continue_')}</Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit} disabled={saving}>
            {saving ? t('saving') : t('completeCheckIn')}
          </Button>
        )}
      </div>
    </div>
  );
}
