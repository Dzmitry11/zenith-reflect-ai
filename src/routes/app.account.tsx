import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/app/account')({
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-display font-semibold text-foreground">Account</h1>
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span className="text-foreground">{user?.email}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">User ID</span><span className="text-foreground text-xs font-mono">{user?.id.slice(0, 8)}...</span></div>
      </div>
      <Button variant="outline" onClick={() => signOut()} className="w-full">Sign out</Button>
    </div>
  );
}
