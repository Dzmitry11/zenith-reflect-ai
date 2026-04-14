import { useLocation } from '@tanstack/react-router';
import { Home, MessageCircle, BookOpen, Heart, BarChart3, Menu } from 'lucide-react';
import { useState } from 'react';
import { AppSidebarMobileMenu } from './AppSidebarMobileMenu';
import { useLanguage } from '@/i18n/LanguageContext';
import type { TranslationKey } from '@/i18n/translations';

const mobileNav: Array<{ to: string; labelKey: TranslationKey; icon: any }> = [
  { to: '/app/home', labelKey: 'home', icon: Home },
  { to: '/app/check-in', labelKey: 'checkIn', icon: Heart },
  { to: '/app/chat', labelKey: 'chat', icon: MessageCircle },
  { to: '/app/journal', labelKey: 'journal', icon: BookOpen },
  { to: '/app/insights', labelKey: 'insights', icon: BarChart3 },
];

export function AppMobileNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border-t border-border/30">
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
                {t(item.labelKey)}
              </a>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
            {t('more')}
          </button>
        </div>
      </nav>
      {menuOpen && <AppSidebarMobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
