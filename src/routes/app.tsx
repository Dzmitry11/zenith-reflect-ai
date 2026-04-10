import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/AppSidebar';
import { AppMobileNav } from '@/components/AppMobileNav';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <AppMobileNav />
    </div>
  );
}
