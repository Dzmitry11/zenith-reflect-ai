import { getRiskMessage } from '@/services/risk-classifier';
import type { RiskLevel } from '@/types';

export function RiskNotice({ level }: { level: RiskLevel }) {
  const message = getRiskMessage(level);
  if (!message) return null;

  const colors: Record<string, string> = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`rounded-xl border p-4 text-sm ${colors[level] || ''}`}>
      <p className="font-medium mb-1">
        {level === 'red' ? '⚠️ Important' : level === 'orange' ? '💛 Please take care' : '🌿 A gentle note'}
      </p>
      <p>{message}</p>
      {level === 'red' && (
        <p className="mt-2 text-xs opacity-80">
          If you are in immediate danger, please contact your local emergency services.
        </p>
      )}
    </div>
  );
}
