import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === 'developer') {
    return <Navigate to="/developer/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
};

export default DashboardRedirect;
