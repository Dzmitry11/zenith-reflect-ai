import { Link } from '@tanstack/react-router';
import { Brain, ClipboardList, Settings, Shield, CreditCard, User, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
  { to: '/app/therapy-prep', label: 'Therapy Prep', icon: ClipboardList },
  { to: '/app/memory', label: 'Memory', icon: Brain },
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/account', label: 'Account', icon: User },
  { to: '/app/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/app/safety', label: 'Safety & Help', icon: Shield },
];

export function AppSidebarMobileMenu({ onClose }: { onClose: () => void }) {
  const { signOut } = useAuth();

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl border-t border-border p-4 pb-8 animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">More</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent text-center"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
        <button
          onClick={() => { signOut(); onClose(); }}
          className="flex items-center gap-3 w-full mt-4 px-4 py-3 rounded-xl hover:bg-accent text-sm text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
