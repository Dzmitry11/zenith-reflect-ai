import { Link, useLocation } from '@tanstack/react-router';
import { Home, MessageCircle, BookOpen, Brain, ClipboardList, BarChart3, Settings, Shield, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { to: '/app/home' as const, label: 'Home', icon: Home },
  { to: '/app/check-in' as const, label: 'Check-in', icon: Heart },
  { to: '/app/chat' as const, label: 'Chat', icon: MessageCircle },
  { to: '/app/journal' as const, label: 'Journal', icon: BookOpen },
  { to: '/app/therapy-prep' as const, label: 'Therapy Prep', icon: ClipboardList },
  { to: '/app/insights' as const, label: 'Insights', icon: BarChart3 },
  { to: '/app/memory' as const, label: 'Memory', icon: Brain },
];

const bottomItems = [
  { to: '/app/settings' as const, label: 'Settings', icon: Settings },
  { to: '/app/safety' as const, label: 'Safety', icon: Shield },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/30 bg-card/40 backdrop-blur-xl h-screen sticky top-0 z-20">
      <div className="p-6">
        <a href="/app/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">R</span>
          </div>
          <span className="font-display text-lg font-semibold text-foreground">Reflecta</span>
        </a>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <a
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-1">
        {bottomItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <a
              key={item.to}
              href={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
