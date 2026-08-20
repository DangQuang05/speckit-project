import React, { useState } from 'react';

export default function ReportModal({ target, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!target) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do báo cáo vi phạm.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        subjectType: 'JOB_POSTING',
        subjectId: target.id,
        subjectTitle: target.title,
        reason: reason.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể gửi báo cáo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Báo cáo nội dung vi phạm</h2>
            <p>
              Báo cáo tin tuyển dụng: <strong>{target.title}</strong> tại {target.companyName}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
        </div>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Lý do báo cáo (*)</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả lý do: tin tuyển dụng không đúng thực tế, yêu cầu thu phí trái quy định, thông tin sai sự thật..."
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-danger" disabled={submitting}>
              {submitting ? 'Đang gửi...' : 'Gửi báo cáo cho Kiểm duyệt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

