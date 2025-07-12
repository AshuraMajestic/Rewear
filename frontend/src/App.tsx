import { ToastContainer } from 'react-toastify'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import SignupForm from './pages/auth/Signup';
import LoginForm from './pages/auth/Login';
import Home from './pages/home/Home';
import Navbar from './components/Navbar';

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL as string}/user/get-profile`, {
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
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

function App() {
  const location = useLocation()
  const isAuthRoute = location.pathname.startsWith('/auth')

  return (
     <div>
      <ToastContainer />
    
        {!isAuthRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/signup' element={<SignupForm/>}/>
        <Route path='/auth/login' element={<LoginForm/>}/>
        {/* <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Prfile />
              </ProtectedRoute>
            }
          /> */}
      </Routes>
      
      
    </div>
  )
}

export default App