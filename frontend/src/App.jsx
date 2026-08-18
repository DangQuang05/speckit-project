import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CandidateView from './pages/CandidateView';
import RecruiterView from './pages/RecruiterView';
import ModeratorView from './pages/ModeratorView';
import AdminView from './pages/AdminView';
import NotificationsDrawer from './components/NotificationsDrawer';
import Toast from './components/Toast';
import { getNotifications, markNotificationAsRead } from './services/api';

const USERS_BY_ROLE = {
  CANDIDATE: { id: 1, email: 'candidate@talenthub.vn', fullName: 'Nguyễn Văn An (Candidate)', role: 'CANDIDATE' },
  RECRUITER: { id: 2, email: 'recruiter@talenthub.vn', fullName: 'Trần Thị Mai (Recruiter)', role: 'RECRUITER' },
  MODERATOR: { id: 3, email: 'moderator@talenthub.vn', fullName: 'Lê Hoàng Long (Moderator)', role: 'MODERATOR' },
  ADMIN: { id: 4, email: 'admin@talenthub.vn', fullName: 'Phạm Minh Đức (Admin)', role: 'ADMIN' },
};

export default function App() {
  const [currentRole, setCurrentRole] = useState('CANDIDATE');
  const [currentUser, setCurrentUser] = useState(USERS_BY_ROLE.CANDIDATE);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setCurrentUser(USERS_BY_ROLE[role] || USERS_BY_ROLE.CANDIDATE);
    showToast(`Đã chuyển sang không gian: ${role}`);
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(currentUser.id);
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser.id]);

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

  return (
    <div className="app-container">
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
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
  );
}
