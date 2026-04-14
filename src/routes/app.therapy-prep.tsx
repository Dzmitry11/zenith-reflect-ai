import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Plus, Copy } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export const Route = createFileRoute('/app/therapy-prep')({
  component: TherapyPrepPage,
});

function TherapyPrepPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    upcoming_session_date: '',
    key_events: '',
    repeated_triggers: '',
    emotions: '',
    questions_for_therapist: '',
    hard_to_say: '',
  });
  const [saving, setSaving] = useState(false);

  const loadNotes = async () => {
    if (!user) return;
    const { data } = await supabase.from('therapy_prep_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => { loadNotes(); }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const generatedSummary = generateSummary();
    if (editing) {
      await supabase.from('therapy_prep_notes').update({ ...form, generated_summary: generatedSummary }).eq('id', editing.id);
    } else {
      await supabase.from('therapy_prep_notes').insert({ ...form, user_id: user.id, generated_summary: generatedSummary });
    }
    setEditing(null);
    setForm({ upcoming_session_date: '', key_events: '', repeated_triggers: '', emotions: '', questions_for_therapist: '', hard_to_say: '' });
    setSaving(false);
    loadNotes();
  };

  const generateSummary = () => {
    const parts: string[] = [];
    if (form.key_events) parts.push(`${t('keyEvents')}: ${form.key_events}`);
    if (form.repeated_triggers) parts.push(`${t('repeatedTriggers')}: ${form.repeated_triggers}`);
    if (form.emotions) parts.push(`${t('emotionsCameUp')}: ${form.emotions}`);
    if (form.questions_for_therapist) parts.push(`${t('questionsForTherapist')}: ${form.questions_for_therapist}`);
    if (form.hard_to_say) parts.push(`${t('hardToSay')}: ${form.hard_to_say}`);
    return parts.join('\n\n');
  };

  const startEdit = (note: any) => {
    setEditing(note);
    setForm({
      upcoming_session_date: note.upcoming_session_date || '',
      key_events: note.key_events || '',
      repeated_triggers: note.repeated_triggers || '',
      emotions: note.emotions || '',
      questions_for_therapist: note.questions_for_therapist || '',
      hard_to_say: note.hard_to_say || '',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [showForm, setShowForm] = useState(false);

  if (showForm || editing) {
    const fields = [
      { key: 'key_events', label: t('keyEvents'), placeholder: t('keyEventsPlaceholder') },
      { key: 'repeated_triggers', label: t('repeatedTriggers'), placeholder: t('triggersPlaceholder') },
      { key: 'emotions', label: t('emotionsCameUp'), placeholder: t('emotionsPlaceholder') },
      { key: 'questions_for_therapist', label: t('questionsForTherapist'), placeholder: t('questionsPlaceholder') },
      { key: 'hard_to_say', label: t('hardToSay'), placeholder: t('hardToSayPlaceholder') },
    ] as const;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-semibold text-foreground">{editing ? t('editTherapyPrep') : t('newTherapyPrep')}</h1>
          <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditing(null); }}>{t('cancel')}</Button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">{t('upcomingDate')}</label>
            <input type="date" value={form.upcoming_session_date} onChange={(e) => setForm({ ...form, upcoming_session_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{field.label}</label>
              <textarea
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? t('saving') : t('saveTherapyPrep')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-foreground">{t('therapyPrep')}</h1>
        <Button onClick={() => setShowForm(true)} size="sm"><Plus className="w-4 h-4" /> {t('newPrep')}</Button>
      </div>

      <p className="text-sm text-muted-foreground">{t('therapyPrepDesc')}</p>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8">{t('loading')}</div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon="📋"
          title={t('noTherapyNotes')}
          description={t('therapyNotesEmpty')}
          action={<Button onClick={() => setShowForm(true)}>{t('createFirstPrep')}</Button>}
        />
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="rounded-2xl bg-card border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">{note.upcoming_session_date ? `${t('upcomingDate')}: ${note.upcoming_session_date}` : t('noDateSet')}</span>
                  <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(note.generated_summary || '')}><Copy className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(note)}>✏️</Button>
                </div>
              </div>
              {note.generated_summary && (
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-xs font-medium text-foreground mb-2">{t('summary')}</p>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-body">{note.generated_summary}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
