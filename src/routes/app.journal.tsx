import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { JOURNAL_TEMPLATES } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { Plus, BookOpen, Trash2, Search } from 'lucide-react';

export const Route = createFileRoute('/app/journal')({
  component: JournalPage,
});

function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editEntry, setEditEntry] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadEntries = async () => {
    if (!user) return;
    let query = supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (filter) query = query.eq('template_type', filter);
    const { data } = await query;
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { loadEntries(); }, [user, filter]);

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    setSaving(true);
    if (editEntry) {
      await supabase.from('journal_entries').update({ title, content, template_type: selectedTemplate || editEntry.template_type }).eq('id', editEntry.id);
    } else {
      await supabase.from('journal_entries').insert({ user_id: user.id, template_type: selectedTemplate || 'free', title, content });
    }
    setShowCreate(false);
    setEditEntry(null);
    setTitle('');
    setContent('');
    setSelectedTemplate('');
    setSaving(false);
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('journal_entries').delete().eq('id', id);
    loadEntries();
  };

  const startEdit = (entry: any) => {
    setEditEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedTemplate(entry.template_type);
    setShowCreate(true);
  };

  const filteredEntries = entries.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())
  );

  if (showCreate) {
    const template = JOURNAL_TEMPLATES.find((t) => t.id === selectedTemplate);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-semibold text-foreground">{editEntry ? 'Edit entry' : 'New journal entry'}</h1>
          <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); setEditEntry(null); setTitle(''); setContent(''); }}>Cancel</Button>
        </div>

        {!selectedTemplate && !editEntry && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose a template or write freely.</p>
            <button onClick={() => setSelectedTemplate('free')} className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
              <span className="text-sm font-medium text-foreground">✍️ Free writing</span>
              <p className="text-xs text-muted-foreground mt-0.5">Write whatever comes to mind.</p>
            </button>
            {JOURNAL_TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                <span className="text-sm font-medium text-foreground">{t.icon} {t.title}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
              </button>
            ))}
          </div>
        )}

        {(selectedTemplate || editEntry) && (
          <div className="space-y-4">
            {template && (
              <div className="rounded-xl bg-calm/10 border border-calm/20 p-4">
                <p className="text-xs font-medium text-foreground mb-2">Guiding prompts</p>
                <ul className="space-y-1">
                  {template.prompts.map((p, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {p}</li>
                  ))}
                </ul>
              </div>
            )}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />
            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()} className="w-full">
              {saving ? 'Saving...' : editEntry ? 'Update entry' : 'Save entry'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-foreground">Journal</h1>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="w-4 h-4" /> New entry</Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>All</button>
        {JOURNAL_TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => setFilter(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {t.icon} {t.title}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No journal entries yet"
          description="Writing things down can help them feel more manageable. Start with a template or write freely."
          action={<Button onClick={() => setShowCreate(true)}>Create your first entry</Button>}
        />
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="cursor-pointer flex-1" onClick={() => startEdit(entry)}>
                  <h3 className="text-sm font-medium text-foreground">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.content}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{entry.template_type}</span>
                    <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
