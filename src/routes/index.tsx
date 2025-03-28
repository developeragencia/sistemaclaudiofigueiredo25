import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';

const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Proposals = lazy(() => import('@/pages/Proposals').then(module => ({ default: module.Proposals })));
const ProposalDetails = lazy(() => import('@/pages/proposals/[id]').then(module => ({ default: module.ProposalDetails })));
const NewProposal = lazy(() => import('@/pages/proposals/new').then(module => ({ default: module.NewProposal })));
const Contracts = lazy(() => import('@/pages/Contracts').then(module => ({ default: module.Contracts })));
const Profile = lazy(() => import('@/pages/Profile').then(module => ({ default: module.Profile })));
const Users = lazy(() => import('@/pages/Users').then(module => ({ default: module.Users })));
const SystemSettings = lazy(() => import('@/pages/SystemSettings').then(module => ({ default: module.SystemSettings })));
const SystemAudit = lazy(() => import('@/pages/SystemAudit').then(module => ({ default: module.SystemAudit })));
const SystemLogs = lazy(() => import('@/pages/SystemLogs').then(module => ({ default: module.SystemLogs })));
const Reports = lazy(() => import('@/pages/Reports').then(module => ({ default: module.Reports })));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/proposals" replace />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/new" element={<NewProposal />} />
        <Route path="/proposals/:id" element={<ProposalDetails />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="/audit" element={<SystemAudit />} />
        <Route path="/logs" element={<SystemLogs />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 