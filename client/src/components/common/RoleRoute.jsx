import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const dashboardFor = { student: '/student', teacher: '/teacher', admin: '/admin' };

export default function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardFor[user.role] || '/login'} replace />;
  return children;
}
