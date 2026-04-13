import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CompanionAvatarPicker, type CompanionId } from '@/components/CompanionAvatarPicker';

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
    ]).then(([prefsRes, profileRes]) => {
      if (prefsRes.data) setPrefs(prefsRes.data);
      if (profileRes.data) setProfile(profileRes.data);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user || !prefs || !profile) return;
    setSaving(true);
    await Promise.all([
      supabase.from('user_preferences').update({
        tone_preference: prefs.tone_preference,
        preferred_session_length: prefs.preferred_session_length,
        memory_enabled: prefs.memory_enabled,
        weekly_summary_enabled: prefs.weekly_summary_enabled,
        companion_avatar: prefs.companion_avatar,
      }).eq('user_id', user.id),
      supabase.from('profiles').update({ display_name: profile.display_name }).eq('id', user.id),
    ]);
    setSaving(false);
  };

  if (!prefs || !profile) return <div className="text-sm text-muted-foreground text-center py-20">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-display font-semibold text-foreground">Settings</h1>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Display name</label>
          <input value={profile.display_name || ''} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <CompanionAvatarPicker
          selected={(prefs.companion_avatar || 'aurora') as CompanionId}
          onChange={(id) => setPrefs({ ...prefs, companion_avatar: id })}
        />

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Tone preference</label>
          <div className="space-y-2">
            {[
              { value: 'warm_and_gentle', label: 'Warm and gentle' },
              { value: 'warm_and_structured', label: 'Warm and structured' },
              { value: 'concise_and_grounding', label: 'Concise and grounding' },
            ].map((opt) => (
              <button key={opt.value} onClick={() => setPrefs({ ...prefs, tone_preference: opt.value })} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${prefs.tone_preference === opt.value ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred session length</label>
          <div className="flex gap-2">
            {['5', '10', '15'].map((len) => (
              <button key={len} onClick={() => setPrefs({ ...prefs, preferred_session_length: len })} className={`flex-1 py-3 rounded-xl text-sm border transition-all ${prefs.preferred_session_length === len ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-card border-border text-foreground'}`}>
                {len} min
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Enable memory</span>
            <button onClick={() => setPrefs({ ...prefs, memory_enabled: !prefs.memory_enabled })} className={`w-10 h-6 rounded-full transition-colors ${prefs.memory_enabled ? 'bg-primary' : 'bg-border'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${prefs.memory_enabled ? 'translate-x-4' : ''}`} />
            </button>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Weekly summaries</span>
            <button onClick={() => setPrefs({ ...prefs, weekly_summary_enabled: !prefs.weekly_summary_enabled })} className={`w-10 h-6 rounded-full transition-colors ${prefs.weekly_summary_enabled ? 'bg-primary' : 'bg-border'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${prefs.weekly_summary_enabled ? 'translate-x-4' : ''}`} />
            </button>
          </label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Save changes'}</Button>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs text-muted-foreground">Reflecta is designed for self-reflection and emotional clarity. It is not therapy, not a diagnostic tool, and not crisis support.</p>
      </div>
    </div>
  );
}
