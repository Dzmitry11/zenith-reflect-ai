export function CalmPromptCard({ quote }: { quote: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-calm/40 to-soft/30 p-6 border border-calm/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent)]" />
      <p className="relative text-sm text-foreground/80 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}
