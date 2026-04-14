import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageContext';

export const Route = createFileRoute('/app/safety')({
  component: SafetyPage,
});

function SafetyPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">{t('safetyTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('safetySubtitle')}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">{t('whatCanHelp')}</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpReflection')}</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpJournaling')}</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpTherapy')}</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpPatterns')}</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpBreakdown')}</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> {t('helpCalm')}</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-warm/30 border border-warm/40 p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">{t('whatIsNot')}</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> {t('notTherapist')}</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> {t('notDiagnostic')}</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> {t('notCrisis')}</li>
          <li className="flex gap-2"><span className="text-warm-foreground">✕</span> {t('notReplacement')}</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 space-y-4">
        <h2 className="text-base font-medium text-foreground">{t('crisisTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('crisisDesc')}</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span>🚨</span> {t('crisisEmergency')}</li>
          <li className="flex gap-2"><span>📞</span> {t('crisisHelpline')}</li>
          <li className="flex gap-2"><span>🤝</span> {t('crisisTrusted')}</li>
          <li className="flex gap-2"><span>🏥</span> {t('crisisER')}</li>
          <li className="flex gap-2"><span>👩‍⚕️</span> {t('crisisPro')}</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-4">{t('crisisNote')}</p>
      </div>

      <div className="rounded-xl bg-muted p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">{t('safetyFooter')}</p>
      </div>
    </div>
  );
}
