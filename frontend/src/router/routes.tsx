import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';
import { authService } from '@/domain/auth/services/authService';

const LoginPage = lazy(() =>
  import('@/pages/Login').then((module) => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/pages/Register').then((module) => ({ default: module.RegisterPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard').then((module) => ({ default: module.DashboardPage }))
);
const ComplexFormPage = lazy(() =>
  import('@/pages/ComplexForm').then((module) => ({ default: module.ComplexFormPage }))
);
const UserTablePage = lazy(() =>
  import('@/pages/UserTable').then((module) => ({ default: module.UserTablePage }))
);
const UIComponentsPage = lazy(() =>
  import('@/pages/UIComponents').then((module) => ({ default: module.UIComponentsPage }))
);
const NotificationsPage = lazy(() =>
  import('@/pages/Notifications').then((module) => ({ default: module.NotificationsPage }))
);
const ProductsPage = lazy(() =>
  import('@/pages/Products').then((module) => ({ default: module.ProductsPage }))
);
const ProductDetailsPage = lazy(() =>
  import('@/pages/ProductDetails').then((module) => ({ default: module.ProductDetailsPage }))
);
const CheckoutPage = lazy(() =>
  import('@/pages/Checkout').then((module) => ({ default: module.CheckoutPage }))
);
const OrdersPage = lazy(() =>
  import('@/pages/Orders').then((module) => ({ default: module.OrdersPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complex-form',
        element: (
          <ProtectedRoute>
            <ComplexFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute>
            <UserTablePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ui-components',
        element: (
          <ProtectedRoute>
            <UIComponentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <ProtectedRoute>
            <ProductDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
