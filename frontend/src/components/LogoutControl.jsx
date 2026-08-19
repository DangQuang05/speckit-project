import React, { useState } from 'react';

export default function LogoutControl({ onLogout }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const logout = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onLogout();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirming) {
    return (
      <span className="logout-confirmation" role="group" aria-label="Xác nhận đăng xuất">
        <span>Đăng xuất?</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={logout} disabled={isSubmitting}>
          {isSubmitting ? 'Đang thoát...' : 'Xác nhận'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsConfirming(false)} disabled={isSubmitting}>
          Hủy
        </button>
      </span>
    );
  }

  return <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsConfirming(true)}>Đăng xuất</button>;
}
