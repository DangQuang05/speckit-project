import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LogoutControl from './components/LogoutControl';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateView from './pages/CandidateView';
import RecruiterView from './pages/RecruiterView';
import ModeratorView from './pages/ModeratorView';
import AdminView from './pages/AdminView';
import NotificationsDrawer from './components/NotificationsDrawer';
import Toast from './components/Toast';
import { getNotifications, logoutUser, markNotificationAsRead, validateSession } from './services/api';
import { clearAuthSession, readAuthSession, writeAuthSession } from './auth/authStorage';
import ProtectedRoute from './auth/ProtectedRoute';
import GuestRoute from './auth/GuestRoute';

export default function App() {
  const [session, setSession] = useState(() => readAuthSession());
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(readAuthSession()));
  const [sessionMessage, setSessionMessage] = useState('');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(session.userId);
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      if (!session?.token) {
        setIsAuthLoading(false);
        return;
      }
      try {
        const restored = await validateSession(session.token);
        if (isMounted) {
          writeAuthSession(restored);
          setSession(restored);
        }
      } catch {
        clearAuthSession();
        if (isMounted) {
          setSession(null);
          setSessionMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    };
    restoreSession();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  }

  useEffect(() => {
    if (session?.userId) loadNotifications();
    else setNotifications([]);
  }, [session?.userId]);

  useEffect(() => {
    if (!isAuthLoading && !session && !['/login', '/register'].includes(currentPath)) {
      window.history.replaceState({}, '', '/login');
    }
    if (!isAuthLoading && session && ['/login', '/register'].includes(currentPath)) {
      window.history.replaceState({}, '', '/');
    }
  }, [currentPath, isAuthLoading, session]);

  const handleAuthenticated = (authenticatedSession) => {
    writeAuthSession(authenticatedSession);
    setSession(authenticatedSession);
    setSessionMessage('');
  };

  const handleLogout = async () => {
    const token = session?.token;
    try {
      if (token) await logoutUser(token);
    } catch (error) {
      console.error(error);
    } finally {
      clearAuthSession();
      setSession(null);
      navigate('/login');
      setSessionMessage('Bạn đã đăng xuất thành công.');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isAuthLoading) {
    return <main className="auth-page"><p role="status">Đang kiểm tra phiên đăng nhập...</p></main>;
  }

  if (!session) {
    const requestedAuthView = currentPath === '/register' ? 'register' : 'login';
    return <GuestRoute session={session} onAuthenticated={() => navigate('/')}>
      {requestedAuthView === 'login'
        ? <LoginPage onAuthenticated={(authenticatedSession) => { handleAuthenticated(authenticatedSession); navigate('/'); }} onRegister={() => { setSessionMessage(''); navigate('/register'); }} sessionMessage={sessionMessage} />
        : <RegisterPage onAuthenticated={(authenticatedSession) => { handleAuthenticated(authenticatedSession); navigate('/'); }} onLogin={() => { setSessionMessage(''); navigate('/login'); }} />}
    </GuestRoute>;
  }

  const currentRole = session.role;
  const currentUser = session;

  return (
    <ProtectedRoute session={session} onUnauthenticated={() => navigate('/login')}>
    <div className="app-container">
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        logoutControl={<LogoutControl onLogout={handleLogout} />}
      />

      <main className="main-content">
        {currentRole === 'CANDIDATE' && (
          <CandidateView currentUser={currentUser} onShowToast={showToast} />
        )}
        {currentRole === 'RECRUITER' && (
          <RecruiterView currentUser={currentUser} onShowToast={showToast} />
        )}
        {currentRole === 'MODERATOR' && (
          <ModeratorView currentUser={currentUser} onShowToast={showToast} />
        )}
        {currentRole === 'ADMIN' && (
          <AdminView currentUser={currentUser} onShowToast={showToast} />
        )}
      </main>

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      <Toast message={toastMessage} />
    </div>
    </ProtectedRoute>
  );
}
