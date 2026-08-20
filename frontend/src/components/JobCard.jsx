import React from 'react';

export default function JobCard({ job, onViewDetails, onApply, onReport, hasApplied }) {
  const getLevelBadge = (level) => {
    switch (level) {
      case 'SENIOR': return <span className="badge badge-purple">Senior</span>;
      case 'LEAD': return <span className="badge badge-purple">Lead</span>;
      case 'MID': return <span className="badge badge-primary">Middle</span>;
      case 'JUNIOR': return <span className="badge badge-warning">Junior</span>;
      case 'FRESHER': return <span className="badge badge-success">Fresher</span>;
      default: return null;
    }
  };

  return (
    <article className="job-item-card" data-testid={`job-card-${job.id}`}>
      <div className="job-item-header">
        <div>
          <h3 className="job-item-title">{job.title}</h3>
          <div className="job-item-meta">
            <strong>{job.companyName}</strong>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.employmentType}</span>
            {getLevelBadge(job.experienceLevel)}
          </div>
        </div>
        <span className="job-salary-badge">{job.salaryText || 'Thỏa thuận'}</span>
      </div>

      <p className="job-desc">
        {job.description}
      </p>

      <div className="skills-tags">
        {job.skillsRequired?.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>

      <div className="job-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onReport && onReport(job)}
        >
          Báo cáo tin
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onViewDetails(job)}
          >
            Chi tiết
          </button>
          <button
            type="button"
            className={`btn btn-sm ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
            disabled={hasApplied}
            onClick={() => onApply(job)}
          >
            {hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
          </button>
        </div>
      </div>
    </article>
  );
}

