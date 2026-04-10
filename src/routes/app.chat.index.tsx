import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { STARTER_CHIPS } from '@/types';
import type { SessionMode } from '@/types';
import { Plus, MessageCircle } from 'lucide-react';

export const Route = createFileRoute('/app/chat/')({
  component: ChatListPage,
});

function ChatListPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSessions(data || []);
        setLoading(false);
      });
  }, [user]);

  const createSession = async (mode: SessionMode = 'open_reflection') => {
    if (!user) return;
    setCreating(true);
    const { data } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, mode, title: `${mode.replace('_', ' ')} session`, status: 'active' })
      .select()
      .single();
    if (data) {
      window.location.href = `/app/chat/${data.id}`;
    }
    setCreating(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-foreground">Chat</h1>
        <Button onClick={() => createSession()} disabled={creating} size="sm">
          <Plus className="w-4 h-4" /> New session
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Start with a prompt</p>
        <div className="flex flex-wrap gap-2">
          {STARTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => createSession('open_reflection')}
              className="px-3 py-2 rounded-xl text-xs bg-card border border-border text-foreground hover:border-primary/30 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-foreground mb-3">Choose a mode</h2>
        <div className="grid grid-cols-2 gap-2">
          {([
            { mode: 'checkin' as SessionMode, label: 'Check-in', desc: 'Quick emotional check' },
            { mode: 'situation_breakdown' as SessionMode, label: 'Situation breakdown', desc: 'Break down what happened' },
            { mode: 'journal' as SessionMode, label: 'Guided journal', desc: 'Structured journaling' },
            { mode: 'therapy_prep' as SessionMode, label: 'Therapy prep', desc: 'Prepare for your session' },
          ]).map((item) => (
            <button
              key={item.mode}
              onClick={() => createSession(item.mode)}
              className="text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No sessions yet. Start your first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">Previous sessions</h2>
          {sessions.map((s) => (
            <a key={s.id} href={`/app/chat/${s.id}`} className="block p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{s.title || 'Untitled'}</span>
                <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s.mode.replace('_', ' ')}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
