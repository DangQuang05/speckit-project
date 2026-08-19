import React from 'react';

export default function Header({ currentRole, currentUser, unreadCount, onToggleNotifications, logoutControl }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge">IT</span>
          <span>TalentHub Việt Nam</span>
        </div>

        <div className="role-label" aria-label="Vai trò hiện tại">{currentRole}</div>

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
          {logoutControl}
        </div>
      </div>
    </header>
  );
}
