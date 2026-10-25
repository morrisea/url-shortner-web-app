import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return null;
  }

  return accessToken ? <Outlet /> : <Navigate to='/login' replace />;
}
