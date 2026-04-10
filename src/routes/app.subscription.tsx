import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { PlanBadge } from '@/components/PlanBadge';
import { Check } from 'lucide-react';

export const Route = createFileRoute('/app/subscription')({
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const { user } = useAuth();
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single().then(({ data }) => setSub(data));
  }, [user]);

  const freeFeatures = [
    '3 sessions per week',
    'Basic check-ins',
    '5 memory items',
    '3 journal templates',
  ];
  const premiumFeatures = [
    'Unlimited sessions',
    'Full insights dashboard',
    'Unlimited memory items',
    'All journal templates',
    'Therapy prep exports',
    'Weekly summaries',
    'Advanced reflection modes',
    'Priority support',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-display font-semibold text-foreground">Subscription</h1>
      {sub && (
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Current plan</span>
            <PlanBadge tier={sub.plan_tier} />
          </div>
          <p className="text-xs text-muted-foreground">Status: {sub.status}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">Free</h3>
            <p className="text-2xl font-display font-bold text-foreground mt-1">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <ul className="space-y-2">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
          {sub?.plan_tier === 'free' && <Button variant="outline" disabled className="w-full">Current plan</Button>}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-calm/10 border-2 border-primary/20 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">Premium</h3>
            <p className="text-2xl font-display font-bold text-foreground mt-1">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
          <ul className="space-y-2">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
          {sub?.plan_tier === 'premium' ? (
            <Button variant="outline" disabled className="w-full">Current plan</Button>
          ) : (
            <Button className="w-full">Upgrade to Premium</Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">Payment processing coming soon. Upgrade will be available shortly.</p>
    </div>
  );
}
