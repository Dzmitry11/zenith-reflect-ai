
-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  INSERT INTO public.subscriptions (user_id, plan_tier, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  locale TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. user_preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tone_preference TEXT DEFAULT 'warm_and_gentle',
  response_length_preference TEXT DEFAULT 'medium',
  main_goal TEXT,
  memory_enabled BOOLEAN DEFAULT true,
  weekly_summary_enabled BOOLEAN DEFAULT true,
  preferred_session_length TEXT DEFAULT '10',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own prefs" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own prefs" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own prefs" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_prefs_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sub" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sub" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sub" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_subs_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('checkin', 'situation_breakdown', 'journal', 'therapy_prep', 'open_reflection')),
  title TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  risk_level TEXT DEFAULT 'green' CHECK (risk_level IN ('green', 'yellow', 'orange', 'red')),
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON public.sessions FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_mode ON public.sessions(mode);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);

-- 6. check_ins
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  stress_score INT CHECK (stress_score BETWEEN 1 AND 10),
  energy_score INT CHECK (energy_score BETWEEN 1 AND 10),
  primary_emotion TEXT,
  support_need TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own checkins" ON public.check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own checkins" ON public.check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own checkins" ON public.check_ins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own checkins" ON public.check_ins FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_checkins_user_id ON public.check_ins(user_id);

-- 7. journal_entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  template_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own journals" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own journals" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own journals" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own journals" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_journals_user_id ON public.journal_entries(user_id);
CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. therapy_prep_notes
CREATE TABLE public.therapy_prep_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  upcoming_session_date DATE,
  key_events TEXT,
  repeated_triggers TEXT,
  emotions TEXT,
  questions_for_therapist TEXT,
  hard_to_say TEXT,
  generated_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.therapy_prep_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own therapy notes" ON public.therapy_prep_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own therapy notes" ON public.therapy_prep_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own therapy notes" ON public.therapy_prep_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own therapy notes" ON public.therapy_prep_notes FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_therapy_notes_user_id ON public.therapy_prep_notes(user_id);
CREATE TRIGGER update_therapy_notes_updated_at BEFORE UPDATE ON public.therapy_prep_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. memory_items
CREATE TABLE public.memory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('stable_fact', 'goal', 'trigger', 'pattern', 'preference', 'support_style')),
  content TEXT NOT NULL,
  source_session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  origin TEXT NOT NULL DEFAULT 'direct' CHECK (origin IN ('direct', 'inferred')),
  confidence TEXT NOT NULL DEFAULT 'medium' CHECK (confidence IN ('low', 'medium', 'high')),
  sensitive BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'rejected', 'corrected')),
  user_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);
ALTER TABLE public.memory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own memory" ON public.memory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own memory" ON public.memory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own memory" ON public.memory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own memory" ON public.memory_items FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_memory_user_id ON public.memory_items(user_id);
CREATE INDEX idx_memory_type ON public.memory_items(type);
CREATE INDEX idx_memory_status ON public.memory_items(status);
CREATE TRIGGER update_memory_updated_at BEFORE UPDATE ON public.memory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. session_insights
CREATE TABLE public.session_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion_labels JSONB DEFAULT '[]'::jsonb,
  trigger_labels JSONB DEFAULT '[]'::jsonb,
  helpful_interventions JSONB DEFAULT '[]'::jsonb,
  next_step TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.session_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own insights" ON public.session_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own insights" ON public.session_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_insights_user_id ON public.session_insights(user_id);

-- 11. safety_events
CREATE TABLE public.safety_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('yellow', 'orange', 'red')),
  signals JSONB,
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.safety_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own safety events" ON public.safety_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own safety events" ON public.safety_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_safety_user_id ON public.safety_events(user_id);

-- 12. weekly_summaries
CREATE TABLE public.weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  summary TEXT NOT NULL,
  recurring_emotions JSONB DEFAULT '[]'::jsonb,
  recurring_triggers JSONB DEFAULT '[]'::jsonb,
  helpful_patterns JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weekly_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own summaries" ON public.weekly_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own summaries" ON public.weekly_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_weekly_user_id ON public.weekly_summaries(user_id);

-- 13. feature_usage_events
CREATE TABLE public.feature_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_usage_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own usage" ON public.feature_usage_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own usage" ON public.feature_usage_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_usage_user_id ON public.feature_usage_events(user_id);

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
