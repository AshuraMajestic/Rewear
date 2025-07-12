import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/dashboard/dashboard';


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/admin/get-admin`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/auth/admin/login" replace />;

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ToastContainer />
      {/* {isAdminRoute && <Navbar />} */}
      
      <Routes>
        <Route path="/auth/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;