
CREATE TABLE public.disc_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  d_score INTEGER NOT NULL DEFAULT 0,
  i_score INTEGER NOT NULL DEFAULT 0,
  s_score INTEGER NOT NULL DEFAULT 0,
  c_score INTEGER NOT NULL DEFAULT 0,
  primary_type TEXT NOT NULL,
  secondary_type TEXT,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own disc results"
  ON public.disc_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own disc results"
  ON public.disc_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own disc results"
  ON public.disc_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_disc_results_updated_at
  BEFORE UPDATE ON public.disc_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
