import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import App from './App';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import MultiFactor from './pages/MultiFactor';
import './index.css';

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <App /> },
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
          { path: '/verify-email', element: <VerifyEmail /> },
          { path: '/verify-mfa', element: <MultiFactor /> },
          {
            element: <ProtectedRoute />,
            children: [{ path: '/dashboard', element: <Dashboard /> }],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
