import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CalmPromptCard } from '@/components/CalmPromptCard';
import { PlanBadge } from '@/components/PlanBadge';
import { EmptyState } from '@/components/EmptyState';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/animations';
import { CALMING_QUOTES } from '@/types';
import { Heart, MessageCircle, BookOpen, ClipboardList, Sparkles } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export const Route = createFileRoute('/app/home')({
  component: AppHome,
});

function AppHome() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<{ display_name: string | null } | null>(null);
  const [latestCheckIn, setLatestCheckIn] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [planTier, setPlanTier] = useState<'free' | 'premium'>('free');
  const quote = CALMING_QUOTES[Math.floor(Math.random() * CALMING_QUOTES.length)];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, checkInRes, sessionsRes, subRes] = await Promise.all([
        supabase.from('profiles').select('display_name').eq('id', user.id).single(),
        supabase.from('check_ins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('subscriptions').select('plan_tier').eq('user_id', user.id).single(),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (checkInRes.data?.[0]) setLatestCheckIn(checkInRes.data[0]);
      if (sessionsRes.data) setRecentSessions(sessionsRes.data);
      if (subRes.data) setPlanTier(subRes.data.plan_tier as 'free' | 'premium');
    };
    load();
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const name = profile?.display_name || 'there';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <FadeIn delay={0.05}>
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            {greeting()}, {name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t('howShowingUp')}</p>
        </div>
      </FadeIn>

      {latestCheckIn && (
        <FadeIn delay={0.15}>
          <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t('latestCheckIn')}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {latestCheckIn.primary_emotion && <span>{t('feeling')}: {latestCheckIn.primary_emotion}</span>}
              {latestCheckIn.mood_score && <span>{t('mood')}: {latestCheckIn.mood_score}/10</span>}
              {latestCheckIn.energy_score && <span>{t('energy')}: {latestCheckIn.energy_score}/10</span>}
            </div>
          </div>
        </FadeIn>
      )}

      <StaggerContainer className="grid grid-cols-2 gap-3" stagger={0.08}>
        <StaggerItem>
          <a href="/app/check-in" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/70 hover:border-primary/30 hover:shadow-md transition-all">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t('checkIn')}</span>
          </a>
        </StaggerItem>
        <StaggerItem>
          <a href="/app/chat" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/70 hover:border-primary/30 hover:shadow-md transition-all">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t('startChat')}</span>
          </a>
        </StaggerItem>
        <StaggerItem>
          <a href="/app/journal" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/70 hover:border-primary/30 hover:shadow-md transition-all">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t('journal')}</span>
          </a>
        </StaggerItem>
        <StaggerItem>
          <a href="/app/therapy-prep" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/70 hover:border-primary/30 hover:shadow-md transition-all">
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t('therapyPrep')}</span>
          </a>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.1}>
        <CalmPromptCard quote={quote} />
      </FadeIn>

      {recentSessions.length > 0 && (
        <FadeIn>
          <div>
            <h2 className="text-sm font-medium text-foreground mb-3">{t('recentSessions')}</h2>
            <div className="space-y-2">
              {recentSessions.map((s, i) => (
                <FadeIn key={s.id} delay={i * 0.06} direction="left">
                  <a href={`/app/chat/${s.id}`} className="block p-4 rounded-xl bg-card/50 backdrop-blur-md border border-border/40 hover:bg-card/70 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{s.title || t('untitledSession')}</span>
                      <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s.mode.replace('_', ' ')}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s.status}</span>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {planTier === 'free' && (
        <ScaleIn delay={0.2}>
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-calm/20 border border-primary/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{t('unlockPremium')}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t('unlockPremiumDesc')}</p>
            <a href="/app/subscription">
              <Button size="sm" variant="default">{t('viewPlans')}</Button>
            </a>
          </div>
        </ScaleIn>
      )}
    </div>
  );
}
