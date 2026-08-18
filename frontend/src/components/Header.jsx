import React from 'react';

export default function Header({ currentRole, onRoleChange, currentUser, unreadCount, onToggleNotifications }) {
  const roles = [
    { id: 'CANDIDATE', label: '👤 Ứng viên (Candidate)' },
    { id: 'RECRUITER', label: '🏢 Nhà tuyển dụng (Recruiter)' },
    { id: 'MODERATOR', label: '🛡️ Kiểm duyệt (Moderator)' },
    { id: 'ADMIN', label: '⚙️ Quản trị (Admin)' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge">IT</span>
          <span>TalentHub Việt Nam</span>
        </div>

        <div className="role-switcher" role="tablist" aria-label="Role Switcher">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`role-btn ${currentRole === r.id ? 'active' : ''}`}
              onClick={() => onRoleChange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onToggleNotifications}
            title="Thông báo"
          >
            🔔 Thông báo {unreadCount > 0 && <span className="badge badge-danger">{unreadCount}</span>}
          </button>
          <div className="user-badge">
            <span className="user-avatar">{currentUser?.fullName?.charAt(0) || 'U'}</span>
            <span><strong>{currentUser?.fullName || 'User'}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
