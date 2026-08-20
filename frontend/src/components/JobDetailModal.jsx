import React from 'react';

export default function JobDetailModal({ job, onClose, onApply, onReport, hasApplied }) {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{job.title}</h2>
            <p>
              {job.companyName} • {job.location} • {job.employmentType}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="job-salary-badge">
            {job.salaryText || 'Thỏa thuận'}
          </span>
          <span className="badge badge-primary">{job.experienceLevel}</span>
        </div>

        <div className="modal-body">
          <div>
            <h4 className="modal-section-title">Mô tả công việc</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="modal-section-title">Yêu cầu ứng viên</h4>
              <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {job.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="modal-section-title">Kỹ năng yêu cầu</h4>
            <div className="skills-tags">
              {job.skillsRequired?.map((skill, index) => (
                <span key={index} className="skill-tag">
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
            Báo cáo tin
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
              {hasApplied ? 'Đã nộp hồ sơ' : 'Ứng tuyển ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

