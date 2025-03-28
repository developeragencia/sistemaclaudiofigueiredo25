import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy loading com tratamento de erro
const lazyLoad = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Lazy imports
const Login = lazy(() => import('@/pages/Login'));
const Proposals = lazy(() => import('@/pages/Proposals'));
const ProposalDetails = lazy(() => import('@/pages/proposals/[id]'));
const NewProposal = lazy(() => import('@/pages/proposals/new'));
const Contracts = lazy(() => import('@/pages/Contracts'));
const Profile = lazy(() => import('@/pages/Profile'));
const Users = lazy(() => import('@/pages/Users'));
const SystemSettings = lazy(() => import('@/pages/SystemSettings'));
const SystemAudit = lazy(() => import('@/pages/SystemAudit'));
const SystemLogs = lazy(() => import('@/pages/SystemLogs'));
const Reports = lazy(() => import('@/pages/Reports'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={lazyLoad(Login)} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/proposals" replace />} />
        <Route path="/proposals" element={lazyLoad(Proposals)} />
        <Route path="/proposals/new" element={lazyLoad(NewProposal)} />
        <Route path="/proposals/:id" element={lazyLoad(ProposalDetails)} />
        <Route path="/contracts" element={lazyLoad(Contracts)} />
        <Route path="/profile" element={lazyLoad(Profile)} />
        <Route path="/users" element={lazyLoad(Users)} />
        <Route path="/settings" element={lazyLoad(SystemSettings)} />
        <Route path="/audit" element={lazyLoad(SystemAudit)} />
        <Route path="/logs" element={lazyLoad(SystemLogs)} />
        <Route path="/reports" element={lazyLoad(Reports)} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 