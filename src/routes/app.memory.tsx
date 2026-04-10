import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Check, X, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';

export const Route = createFileRoute('/app/memory')({
  component: MemoryPage,
});

function MemoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');

  const loadItems = async () => {
    if (!user) return;
    let query = supabase.from('memory_items').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { loadItems(); }, [user, filter]);

  const updateItem = async (id: string, updates: Record<string, any>) => {
    await supabase.from('memory_items').update(updates).eq('id', id);
    loadItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from('memory_items').delete().eq('id', id);
    loadItems();
  };

  const confidenceColor: Record<string, string> = {
    low: 'bg-amber-100 text-amber-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-green-100 text-green-700',
  };

  const typeColor: Record<string, string> = {
    stable_fact: 'bg-secondary text-secondary-foreground',
    goal: 'bg-primary/10 text-primary',
    trigger: 'bg-warm text-warm-foreground',
    pattern: 'bg-calm text-calm-foreground',
    preference: 'bg-soft text-soft-foreground',
    support_style: 'bg-accent text-accent-foreground',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Memory</h1>
        <p className="text-sm text-muted-foreground mt-1">These are pieces of context used to personalize your experience. You control what stays here.</p>
      </div>

      <div className="rounded-xl bg-calm/10 border border-calm/20 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          These are not absolute truths — they are observations and notes collected from your sessions.
          You can confirm, correct, hide, or delete anything here at any time.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['active', 'hidden', 'rejected', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="🧠"
          title="No memory items yet"
          description="As you use Reflecta, patterns and context will be captured here. You will always have full control over what is stored."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-card border border-border p-4 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColor[item.type] || 'bg-secondary text-secondary-foreground'}`}>{item.type.replace('_', ' ')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${confidenceColor[item.confidence]}`}>{item.confidence}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{item.origin}</span>
                {item.sensitive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">sensitive</span>}
                {item.user_confirmed && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">confirmed</span>}
              </div>
              <div className="flex items-center gap-1 pt-1">
                {!item.user_confirmed && item.status === 'active' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { user_confirmed: true })} className="text-xs h-7">
                    <Check className="w-3 h-3" /> Confirm
                  </Button>
                )}
                {item.status === 'active' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'hidden' })} className="text-xs h-7">
                    <EyeOff className="w-3 h-3" /> Hide
                  </Button>
                )}
                {item.status === 'hidden' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'active' })} className="text-xs h-7">
                    <Eye className="w-3 h-3" /> Restore
                  </Button>
                )}
                {item.status !== 'rejected' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'rejected' })} className="text-xs h-7">
                    <X className="w-3 h-3" /> Reject
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
