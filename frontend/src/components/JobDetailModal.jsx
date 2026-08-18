import React from 'react';

export default function JobDetailModal({ job, onClose, onApply, onReport, hasApplied }) {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{job.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              🏢 {job.companyName} • 📍 {job.location} • 💼 {job.employmentType}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="job-salary-badge" style={{ fontSize: '1.1rem' }}>
            💰 {job.salaryText || 'Thỏa thuận'}
          </span>
          <span className="badge badge-primary">{job.experienceLevel}</span>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h4 style={{ marginBottom: '6px' }}>Mô tả công việc</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '6px' }}>Yêu cầu ứng viên</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {job.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 style={{ marginBottom: '6px' }}>Kỹ năng yêu cầu</h4>
            <div className="skills-tags">
              {job.skillsRequired?.map((skill, index) => (
                <span key={index} className="skill-tag" style={{ background: 'var(--primary-light)', color: 'var(--primary-text)', fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              onClose();
              onReport(job);
            }}
          >
            🚩 Báo cáo tin vi phạm
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button
              type="button"
              className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
              disabled={hasApplied}
              onClick={() => {
                onClose();
                onApply(job);
              }}
            >
              {hasApplied ? '✓ Đã nộp hồ sơ' : '⚡ Ứng tuyển ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
