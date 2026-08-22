import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import CategoriesPage from '../pages/admin/CategoriesPage.jsx';
import DevelopersPage from '../pages/admin/DevelopersPage.jsx';
import UsersPage from '../pages/admin/UsersPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import DeveloperDashboard from '../pages/developer/DeveloperDashboard.jsx';
import CreateIssuePage from '../pages/user/CreateIssuePage.jsx';
import EditIssuePage from '../pages/user/EditIssuePage.jsx';
import IssueDetailPage from '../pages/user/IssueDetailPage.jsx';
import IssuesPage from '../pages/user/IssuesPage.jsx';
import UserDashboard from '../pages/user/UserDashboard.jsx';
import DashboardRedirect from './DashboardRedirect.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/issues/:id/edit" element={<EditIssuePage />} />

        <Route element={<RoleRoute roles={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/issues/create" element={<CreateIssuePage />} />
        </Route>

        <Route element={<RoleRoute roles={['developer']} />}>
          <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
          <Route path="/developer/issues" element={<IssuesPage />} />
        </Route>

        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/issues" element={<IssuesPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/developers" element={<DevelopersPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
