import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Check, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export const Route = createFileRoute('/app/memory')({
  component: MemoryPage,
});

function MemoryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
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

  const updateItem = async (id: string, updates: { status?: string; user_confirmed?: boolean }) => {
    await supabase.from('memory_items').update(updates as any).eq('id', id);
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
        <h1 className="text-2xl font-display font-semibold text-foreground">{t('memory')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('memoryDesc')}</p>
      </div>

      <div className="rounded-xl bg-calm/10 border border-calm/20 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">{t('memoryNotice')}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['active', 'hidden', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {f === 'all' ? t('all') : t(f)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8">{t('loading')}</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="🧠"
          title={t('noMemoryItems')}
          description={t('memoryEmpty')}
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
                {item.sensitive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{t('sensitive')}</span>}
                {item.user_confirmed && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{t('confirmed')}</span>}
              </div>
              <div className="flex items-center gap-1 pt-1">
                {!item.user_confirmed && item.status === 'active' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { user_confirmed: true })} className="text-xs h-7">
                    <Check className="w-3 h-3" /> {t('confirm')}
                  </Button>
                )}
                {item.status === 'active' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'hidden' })} className="text-xs h-7">
                    <EyeOff className="w-3 h-3" /> {t('hide')}
                  </Button>
                )}
                {item.status === 'hidden' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'active' })} className="text-xs h-7">
                    <Eye className="w-3 h-3" /> {t('restore')}
                  </Button>
                )}
                {item.status !== 'rejected' && (
                  <Button variant="ghost" size="sm" onClick={() => updateItem(item.id, { status: 'rejected' })} className="text-xs h-7">
                    <X className="w-3 h-3" /> {t('reject')}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" /> {t('delete_')}
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
