import { ErrorBoundary } from '@/router/error-boundary';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Outlet } from 'react-router-dom';
import { Suspense, useState } from 'react';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Sidebar } from './_components/Sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/core/components/sheet';
import { Button } from '@/core/components/button';
import { MenuIcon, UserIcon, LogOutIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/dropdown-menu';
import { useAuthStore } from '@/domain/auth/stores/authStore';
import { useLogout } from '@/domain/auth/hooks/useLogout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/core/components/breadcrumb';

function MainLayout() {
  const { location } = useNavigation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    return path.replace('/', '');
  };

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <div className="bg-background flex min-h-screen font-sans antialiased">
        {/* Desktop Sidebar */}
        <aside className="hidden w-[250px] flex-col lg:flex">
          <Sidebar />
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-6">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0">
                <Sidebar onItemClick={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 items-center gap-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{getBreadcrumb()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-medium md:block">{user?.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <LoadingSpinner />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export { MainLayout };
