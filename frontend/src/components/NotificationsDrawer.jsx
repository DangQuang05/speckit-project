import React from 'react';

export default function NotificationsDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '480px', position: 'absolute', top: '70px', right: '20px', maxHeight: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem' }}>🔔 Thông báo hệ thống</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
            Chưa có thông báo nào.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: n.read ? 'var(--bg)' : 'var(--primary-light)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
                onClick={() => onMarkAsRead(n.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{n.title}</strong>
                  {!n.read && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Mới</span>}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.message}</p>
                <small style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {new Date(n.createdAt).toLocaleTimeString('vi-VN')} {new Date(n.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
