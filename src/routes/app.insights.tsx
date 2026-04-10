import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { EmptyState } from '@/components/EmptyState';
import { BarChart3, TrendingUp, Zap, Heart } from 'lucide-react';

export const Route = createFileRoute('/app/insights')({
  component: InsightsPage,
});

function InsightsPage() {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('check_ins').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
      supabase.from('sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('session_insights').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]).then(([ciRes, sRes, iRes]) => {
      setCheckIns(ciRes.data || []);
      setSessions(sRes.data || []);
      setInsights(iRes.data || []);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="text-sm text-muted-foreground text-center py-20">Loading insights...</div>;

  const avgMood = checkIns.length > 0 ? (checkIns.reduce((s, c) => s + (c.mood_score || 0), 0) / checkIns.filter(c => c.mood_score).length).toFixed(1) : null;
  const avgStress = checkIns.length > 0 ? (checkIns.reduce((s, c) => s + (c.stress_score || 0), 0) / checkIns.filter(c => c.stress_score).length).toFixed(1) : null;
  const avgEnergy = checkIns.length > 0 ? (checkIns.reduce((s, c) => s + (c.energy_score || 0), 0) / checkIns.filter(c => c.energy_score).length).toFixed(1) : null;
  const topEmotions = checkIns.reduce((acc: Record<string, number>, c) => { if (c.primary_emotion) acc[c.primary_emotion] = (acc[c.primary_emotion] || 0) + 1; return acc; }, {});
  const sortedEmotions = Object.entries(topEmotions).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  const hasData = checkIns.length > 0 || sessions.length > 0;

  if (!hasData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-6">Insights</h1>
        <EmptyState
          icon="📊"
          title="Not enough data yet"
          description="Complete a few check-ins and sessions, and your patterns will start to appear here. Insights grow with your reflections."
          action={<a href="/app/check-in"><button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Start a check-in</button></a>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-display font-semibold text-foreground">Insights</h1>
      <p className="text-sm text-muted-foreground">Patterns emerge over time. Here is what we are noticing.</p>

      <div className="grid grid-cols-3 gap-3">
        {avgMood && (
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <Heart className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-2xl font-display font-semibold text-foreground">{avgMood}</p>
            <p className="text-xs text-muted-foreground">Avg mood</p>
          </div>
        )}
        {avgStress && (
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <Zap className="w-4 h-4 text-warm-foreground mx-auto mb-1" />
            <p className="text-2xl font-display font-semibold text-foreground">{avgStress}</p>
            <p className="text-xs text-muted-foreground">Avg stress</p>
          </div>
        )}
        {avgEnergy && (
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <TrendingUp className="w-4 h-4 text-calm-foreground mx-auto mb-1" />
            <p className="text-2xl font-display font-semibold text-foreground">{avgEnergy}</p>
            <p className="text-xs text-muted-foreground">Avg energy</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Activity</h3>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div><span className="font-medium text-foreground">{totalSessions}</span> sessions</div>
          <div><span className="font-medium text-foreground">{completedSessions}</span> completed</div>
          <div><span className="font-medium text-foreground">{checkIns.length}</span> check-ins</div>
        </div>
      </div>

      {sortedEmotions.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Most frequent emotions</h3>
          <div className="space-y-2">
            {sortedEmotions.map(([emotion, count]) => (
              <div key={emotion} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-24">{emotion}</span>
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(count / sortedEmotions[0][1]) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent session modes</h3>
          <div className="flex flex-wrap gap-2">
            {sessions.slice(0, 10).map((s) => (
              <span key={s.id} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{s.mode.replace('_', ' ')}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
