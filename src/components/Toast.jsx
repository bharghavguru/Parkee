import React, { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 8000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <div className="toast-notification">
      <div className="toast-icon">💬</div>
      <div className="toast-content">
        <span className="toast-title">SMS Notification</span>
        <span className="toast-body">{message}</span>
      </div>
      <button className="toast-close" aria-label="Close notification" onClick={onClose}>×</button>
    </div>
  );
}
