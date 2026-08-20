import React from 'react';

export default function Header({ currentRole, currentUser, unreadCount, onToggleNotifications, logoutControl }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge">IT</span>
          <span>TalentHub Vietnam</span>
        </div>

        <div className="role-label" aria-label="Vai trò hiện tại">{currentRole}</div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onToggleNotifications}
            title="Thông báo"
          >
            <span>Thông báo</span>
            {unreadCount > 0 && <span className="badge badge-primary">{unreadCount}</span>}
          </button>
          <div className="user-badge">
            <span className="user-avatar">{currentUser?.fullName?.charAt(0) || 'U'}</span>
            <span>{currentUser?.fullName || 'User'}</span>
          </div>
          {logoutControl}
        </div>
      </div>
    </header>
  );
}

