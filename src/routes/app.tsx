import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/AppSidebar';
import { AppMobileNav } from '@/components/AppMobileNav';
import { AmbientMusicPlayer } from '@/components/AmbientMusicPlayer';
import bgMain from '@/assets/bg-main.jpg';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen relative">
      {/* Background image layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgMain})` }}
      />
      <div className="fixed inset-0 z-0 bg-background/85 backdrop-blur-sm" />
      
      <AppSidebar />
      <main className="flex-1 pb-20 lg:pb-0 relative z-10">
        <Outlet />
      </main>
      <AppMobileNav />
      <AmbientMusicPlayer />
    </div>
  );
}
