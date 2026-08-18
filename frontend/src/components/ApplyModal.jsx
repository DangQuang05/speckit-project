import React, { useState } from 'react';

export default function ApplyModal({ job, profile, onClose, onSubmit }) {
  const [coverLetter, setCoverLetter] = useState('Tôi rất quan tâm và mong muốn ứng tuyển vị trí này với những kinh nghiệm phù hợp của mình.');
  const [skillsSummary, setSkillsSummary] = useState(profile?.skills ? profile.skills.join(', ') : 'React, TypeScript, Java');
  const [cvUrl, setCvUrl] = useState(profile?.cvUrl || 'https://cv.talenthub.vn/nguyen-van-an-cv.pdf');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvUrl || cvUrl.trim().length === 0) {
      setError('Vui lòng cung cấp link CV hoặc tải lên CV.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(job.id, { coverLetter, skillsSummary, cvUrl });
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể nộp hồ sơ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Ứng tuyển: {job.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Doanh nghiệp: <strong>{job.companyName}</strong> ({job.location})
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ padding: '8px 12px', borderRadius: '8px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Link CV trực tuyến (*)</label>
            <input
              type="text"
              className="form-input"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              placeholder="https://cv.talenthub.vn/your-cv.pdf"
              required
            />
            <small style={{ color: 'var(--text-muted)' }}>
              📄 Đã chọn từ hồ sơ cá nhân của bạn. Bạn có thể thay đổi đường dẫn CV riêng cho vị trí này.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Tóm tắt kỹ năng nổi bật</label>
            <input
              type="text"
              className="form-input"
              value={skillsSummary}
              onChange={(e) => setSkillsSummary(e.target.value)}
              placeholder="React, TypeScript, Next.js, GraphQL..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thư giới thiệu (Cover Letter)</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Chia sẻ lý do bạn phù hợp với vị trí và công ty này..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang gửi hồ sơ...' : 'Xác nhận nộp hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
