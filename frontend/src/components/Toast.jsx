import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast">
        <span>{message}</span>
      </div>
    </div>
  );
}

