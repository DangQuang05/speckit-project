import React from 'react';

export default function NotificationsDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '440px', position: 'fixed', top: '64px', right: '20px', maxHeight: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3>Thông báo hệ thống</h3>
            <p>Cập nhật trạng thái ứng tuyển và tin tuyển dụng</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có thông báo nào</h3>
            <p>Các cập nhật về hồ sơ và tin tuyển dụng sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: n.read ? 'var(--surface-subtle)' : '#ffffff',
                  border: '1px solid',
                  borderColor: n.read ? 'var(--border)' : 'var(--primary-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'background-color 0.15s ease',
                }}
                onClick={() => onMarkAsRead(n.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{n.title}</strong>
                  {!n.read && <span className="badge badge-primary">Mới</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{n.message}</p>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {new Date(n.createdAt).toLocaleTimeString('vi-VN')} {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

