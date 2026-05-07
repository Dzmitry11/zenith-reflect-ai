import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { DISC_QUESTIONS, DISC_TYPE_INFO } from '@/data/disc-questions';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const Route = createFileRoute('/app/disc-test')({ component: DiscTestPage });

type DiscType = 'D' | 'I' | 'S' | 'C';

interface DiscResult {
  d_score: number;
  i_score: number;
  s_score: number;
  c_score: number;
  primary_type: string;
  secondary_type: string | null;
  answers: number[];
}

function DiscTestPage() {
  const { user } = useAuth();
  const { locale, t } = useLanguage();
  const [step, setStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<DiscResult | null>(null);
  const [existingResult, setExistingResult] = useState<DiscResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing result
  useEffect(() => {
    if (!user) return;
    supabase
      .from('disc_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const r = data[0];
          setExistingResult({
            d_score: r.d_score,
            i_score: r.i_score,
            s_score: r.s_score,
            c_score: r.c_score,
            primary_type: r.primary_type,
            secondary_type: r.secondary_type,
            answers: (r.answers as number[]) || [],
          });
          setStep('results');
          setResult({
            d_score: r.d_score,
            i_score: r.i_score,
            s_score: r.s_score,
            c_score: r.c_score,
            primary_type: r.primary_type,
            secondary_type: r.secondary_type,
            answers: (r.answers as number[]) || [],
          });
        }
        setLoading(false);
      });
  }, [user]);

  const labels = {
    en: {
      title: 'DISC Personality Test',
      subtitle: 'Discover your communication and behavior style',
      intro: 'The DISC test helps you understand how you respond to challenges, influence others, handle pace, and follow rules. It takes about 3-5 minutes.',
      start: 'Start Test',
      retake: 'Retake Test',
      question: 'Question',
      of: 'of',
      selectBest: 'Select the statement that describes you best:',
      next: 'Next',
      back: 'Back',
      yourProfile: 'Your DISC Profile',
      primaryType: 'Primary type',
      secondaryType: 'Secondary type',
      strengths: 'Key strengths',
      saving: 'Saving...',
      backToHome: 'Back to home',
    },
    sv: {
      title: 'DISC Personlighetstest',
      subtitle: 'Upptäck din kommunikations- och beteendestil',
      intro: 'DISC-testet hjälper dig att förstå hur du hanterar utmaningar, påverkar andra, hanterar tempo och följer regler. Det tar ungefär 3-5 minuter.',
      start: 'Starta test',
      retake: 'Gör om testet',
      question: 'Fråga',
      of: 'av',
      selectBest: 'Välj det påstående som beskriver dig bäst:',
      next: 'Nästa',
      back: 'Tillbaka',
      yourProfile: 'Din DISC-profil',
      primaryType: 'Primär typ',
      secondaryType: 'Sekundär typ',
      strengths: 'Nyckelegenskaper',
      saving: 'Sparar...',
      backToHome: 'Tillbaka till hem',
    },
    ru: {
      title: 'Тест личности DISC',
      subtitle: 'Узнайте свой стиль общения и поведения',
      intro: 'Тест DISC помогает понять, как вы реагируете на вызовы, влияете на других, справляетесь с темпом и следуете правилам. Это займёт около 3-5 минут.',
      start: 'Начать тест',
      retake: 'Пройти заново',
      question: 'Вопрос',
      of: 'из',
      selectBest: 'Выберите утверждение, которое описывает вас лучше всего:',
      next: 'Далее',
      back: 'Назад',
      yourProfile: 'Ваш профиль DISC',
      primaryType: 'Основной тип',
      secondaryType: 'Вторичный тип',
      strengths: 'Ключевые сильные стороны',
      saving: 'Сохранение...',
      backToHome: 'На главную',
    },
  };

  const l = labels[locale];
  const totalQ = DISC_QUESTIONS.length;

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);

    if (questionIdx < totalQ - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      // Calculate scores
      const scores: Record<DiscType, number> = { D: 0, I: 0, S: 0, C: 0 };
      newAnswers.forEach((aIdx, qIdx) => {
        const type = DISC_QUESTIONS[qIdx].options[aIdx].type;
        scores[type]++;
      });

      const sorted = (Object.entries(scores) as [DiscType, number][]).sort((a, b) => b[1] - a[1]);
      const res: DiscResult = {
        d_score: scores.D,
        i_score: scores.I,
        s_score: scores.S,
        c_score: scores.C,
        primary_type: sorted[0][0],
        secondary_type: sorted[1][1] > 0 ? sorted[1][0] : null,
        answers: newAnswers,
      };
      setResult(res);
      setStep('results');

      // Save to DB
      if (user) {
        supabase.from('disc_results').insert({
          user_id: user.id,
          ...res,
        });
      }
    }
  };

  const handleRetake = () => {
    setStep('test');
    setQuestionIdx(0);
    setAnswers([]);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  // INTRO
  if (step === 'intro') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">🧠</div>
          <h1 className="text-2xl font-display font-bold text-foreground">{l.title}</h1>
          <p className="text-muted-foreground">{l.subtitle}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          {l.intro}
        </div>
        <Button className="w-full" size="lg" onClick={() => setStep('test')}>
          {l.start}
        </Button>
      </div>
    );
  }

  // TEST
  if (step === 'test') {
    const q = DISC_QUESTIONS[questionIdx];
    const progress = ((questionIdx) / totalQ) * 100;

    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (questionIdx > 0) {
                setQuestionIdx(questionIdx - 1);
                setAnswers(answers.slice(0, -1));
              } else {
                setStep('intro');
              }
            }}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {l.question} {questionIdx + 1} {l.of} {totalQ}
          </span>
        </div>

        <h2 className="text-lg font-medium text-foreground">{l.selectBest}</h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left px-4 py-4 rounded-xl text-sm border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              {opt.label[locale]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // RESULTS
  if (step === 'results' && result) {
    const primary = DISC_TYPE_INFO[result.primary_type];
    const secondary = result.secondary_type ? DISC_TYPE_INFO[result.secondary_type] : null;
    const maxScore = totalQ;

    const bars: { type: DiscType; score: number }[] = [
      { type: 'D', score: result.d_score },
      { type: 'I', score: result.i_score },
      { type: 'S', score: result.s_score },
      { type: 'C', score: result.c_score },
    ];

    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-5xl">{primary.emoji}</div>
          <h1 className="text-2xl font-display font-bold text-foreground">{l.yourProfile}</h1>
        </div>

        {/* Primary type */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{l.primaryType}</span>
          </div>
          <h2 className={`text-xl font-bold ${primary.color}`}>
            {primary.emoji} {primary.name[locale]} ({result.primary_type})
          </h2>
          <p className="text-sm text-muted-foreground">{primary.description[locale]}</p>
        </div>

        {/* Secondary type */}
        {secondary && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{l.secondaryType}</span>
            <h3 className={`text-lg font-semibold ${secondary.color}`}>
              {secondary.emoji} {secondary.name[locale]} ({result.secondary_type})
            </h3>
            <p className="text-sm text-muted-foreground">{secondary.description[locale]}</p>
          </div>
        )}

        {/* Score bars */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          {bars.map((b) => {
            const info = DISC_TYPE_INFO[b.type];
            const pct = Math.round((b.score / maxScore) * 100);
            return (
              <div key={b.type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{info.emoji} {info.name[locale]}</span>
                  <span className="text-muted-foreground">{b.score}/{maxScore} ({pct}%)</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.type === 'D' ? 'bg-red-500' : b.type === 'I' ? 'bg-yellow-500' : b.type === 'S' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{l.strengths}</h3>
          <div className="flex flex-wrap gap-2">
            {primary.strengths[locale].map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRetake} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            {l.retake}
          </Button>
          <Button className="flex-1" onClick={() => { window.location.href = '/app/home'; }}>
            {l.backToHome}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
