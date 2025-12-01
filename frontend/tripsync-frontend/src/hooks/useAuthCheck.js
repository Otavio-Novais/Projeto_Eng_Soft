import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    if (!isPublicRoute) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('Token não encontrado, redirecionando para login...');
        localStorage.removeItem('user');
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate]);
};

// Hook para monitorar mudanças no localStorage
export const useAuthMonitor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token foi removido
        const publicRoutes = ['/', '/forgot-password', '/reset-password'];
        const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));
        
        if (!isPublicRoute) {
          console.log('Token removido, redirecionando para login...');
          localStorage.removeItem('user');
          navigate('/', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, location.pathname]);
};
