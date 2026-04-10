export function PlanBadge({ tier }: { tier: 'free' | 'premium' }) {
  if (tier === 'premium') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        ✦ Premium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Free
    </span>
  );
}
