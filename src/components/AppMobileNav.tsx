import { useLocation } from '@tanstack/react-router';
import { Home, MessageCircle, BookOpen, Heart, BarChart3, Menu } from 'lucide-react';
import { useState } from 'react';
import { AppSidebarMobileMenu } from './AppSidebarMobileMenu';

const mobileNav = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/check-in', label: 'Check-in', icon: Heart },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/journal', label: 'Journal', icon: BookOpen },
  { to: '/app/insights', label: 'Insights', icon: BarChart3 },
];

export function AppMobileNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <a
                key={item.to}
                href={item.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
            More
          </button>
        </div>
      </nav>
      {menuOpen && <AppSidebarMobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
