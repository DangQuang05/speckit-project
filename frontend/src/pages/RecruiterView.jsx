import React, { useState, useEffect } from 'react';
import {
  getJobs,
  createJob,
  updateJobStatus,
  getRecruiterApplications,
  updateApplicationStatus,
} from '../services/api';

export default function RecruiterView({ currentUser, onShowToast }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'post-job' | 'applicants' | 'company'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Job creation form
  const [jobForm, setJobForm] = useState({
    title: '',
    location: 'Hồ Chí Minh',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryMin: 20000000,
    salaryMax: 35000000,
    salaryText: '20 - 35 triệu VND',
    description: '',
    requirements: '',
    skillsRequired: '',
    companyName: 'Nexora Labs Vietnam',
  });

  // Selected applicant detail modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [statusFeedback, setStatusFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        getJobs({ recruiterId: currentUser.id }),
        getRecruiterApplications(currentUser.id),
      ]);
      setJobs(jobsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      onShowToast('⚠️ Vui lòng điền đầy đủ tiêu đề và mô tả công việc.');
      return;
    }
    try {
      const skillsArray = jobForm.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
      const reqsArray = jobForm.requirements.split('\n').map((r) => r.trim()).filter(Boolean);

      await createJob({
        ...jobForm,
        skillsRequired: skillsArray.length > 0 ? skillsArray : ['IT General'],
        requirements: reqsArray,
      }, currentUser.id);

      onShowToast('✓ Đăng tin tuyển dụng thành công!');
      setJobForm({
        title: '',
        location: 'Hồ Chí Minh',
        employmentType: 'FULL_TIME',
        experienceLevel: 'MID',
        salaryMin: 20000000,
        salaryMax: 35000000,
        salaryText: '20 - 35 triệu VND',
        description: '',
        requirements: '',
        skillsRequired: '',
        companyName: 'Nexora Labs Vietnam',
      });
      setActiveTab('overview');
      loadData();
    } catch (err) {
      onShowToast('⚠️ ' + (err.message || 'Lỗi đăng tin'));
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await updateJobStatus(jobId, nextStatus);
      onShowToast(`✓ Đã chuyển trạng thái tin sang ${nextStatus}`);
      loadData();
    } catch (err) {
      onShowToast('⚠️ ' + (err.message || 'Lỗi cập nhật trạng thái'));
    }
  };

  const handleAdvanceStatus = async (applicationId, nextStatus) => {
    try {
      await updateApplicationStatus(applicationId, nextStatus, statusFeedback);
      onShowToast(`✓ Đã chuyển ứng viên sang giai đoạn: ${nextStatus}`);
      setStatusFeedback('');
      setSelectedApplicant(null);
      loadData();
    } catch (err) {
      onShowToast('⚠️ ' + (err.message || 'Lỗi cập nhật'));
    }
  };

  const filteredApplications = selectedJobIdFilter
    ? applications.filter((a) => a.jobId === Number(selectedJobIdFilter))
    : applications;

  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
  const offerCount = applications.filter((a) => a.status === 'OFFER').length;

  return (
    <div>
      <nav className="tabs-nav" role="tablist">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Tổng quan tuyển dụng
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          👥 Ứng viên nộp hồ sơ ({applications.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'post-job' ? 'active' : ''}`}
          onClick={() => setActiveTab('post-job')}
        >
          ➕ Đăng tin tuyển dụng mới
        </button>
      </nav>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <section>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-num">{jobs.length}</span>
              <span className="stat-label">Tổng số tin đã đăng</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: 'var(--success)' }}>{activeJobsCount}</span>
              <span className="stat-label">Tin đang tuyển (Active)</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: 'var(--primary)' }}>{applications.length}</span>
              <span className="stat-label">Tổng hồ sơ ứng viên</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: 'var(--warning)' }}>{interviewCount}</span>
              <span className="stat-label">Đang phỏng vấn</span>
            </div>
            <div className="stat-card">
              <span className="stat-num" style={{ color: 'var(--purple)' }}>{offerCount}</span>
              <span className="stat-label">Đã gửi Offer</span>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Danh sách tin tuyển dụng của công ty</h3>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab('post-job')}
              >
                + Đăng tin mới
              </button>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Chức danh công việc</th>
                    <th>Địa điểm</th>
                    <th>Mức lương</th>
                    <th>Trạng thái</th>
                    <th>Hồ sơ nhận</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const appsForThisJob = applications.filter((a) => a.jobId === job.id).length;
                    return (
                      <tr key={job.id}>
                        <td>
                          <strong>{job.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {job.skillsRequired?.join(', ')}
                          </div>
                        </td>
                        <td>{job.location}</td>
                        <td><span className="job-salary-badge" style={{ fontSize: '0.85rem' }}>{job.salaryText}</span></td>
                        <td>
                          <span className={`badge ${job.status === 'ACTIVE' ? 'badge-success' : job.status === 'REJECTED' ? 'badge-danger' : 'badge-neutral'}`}>
                            {job.status === 'ACTIVE' ? 'Đang tuyển' : job.status === 'REJECTED' ? 'Bị từ chối' : 'Đã đóng'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedJobIdFilter(String(job.id));
                              setActiveTab('applicants');
                            }}
                          >
                            👤 {appsForThisJob} hồ sơ
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm ${job.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => handleToggleJobStatus(job.id, job.status)}
                          >
                            {job.status === 'ACTIVE' ? 'Đóng tin' : 'Mở lại'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: APPLICANTS PIPELINE */}
      {activeTab === 'applicants' && (
        <section>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2>Hồ sơ ứng viên tuyển dụng ({filteredApplications.length})</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Xét duyệt ứng viên, xem CV và chuyển đổi các giai đoạn tuyển dụng.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Lọc theo vị trí:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={selectedJobIdFilter}
                  onChange={(e) => setSelectedJobIdFilter(e.target.value)}
                >
                  <option value="">Tất cả các tin</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <h3>Chưa có hồ sơ ứng tuyển nào</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Khi có ứng viên nộp CV cho các vị trí đang tuyển, thông tin sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên ứng viên</th>
                    <th>Vị trí ứng tuyển</th>
                    <th>Ngày nộp</th>
                    <th>Giai đoạn hiện tại</th>
                    <th>CV đính kèm</th>
                    <th>Xét duyệt & Chuyển giai đoạn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.candidateName}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.candidateEmail}</div>
                      </td>
                      <td>{app.jobTitle}</td>
                      <td>{new Date(app.submittedAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'SUBMITTED' ? 'badge-primary' :
                          app.status === 'REVIEWED' ? 'badge-purple' :
                          app.status === 'INTERVIEW' ? 'badge-warning' :
                          app.status === 'OFFER' ? 'badge-success' : 'badge-danger'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.cvUrl ? (
                          <a
                            href={app.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="badge badge-neutral"
                            style={{ textDecoration: 'underline' }}
                          >
                            📄 Xem CV
                          </a>
                        ) : 'Chưa gửi'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedApplicant(app)}
                          >
                            Chi tiết & Đánh giá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: POST JOB */}
      {activeTab === 'post-job' && (
        <section>
          <div className="card">
            <h2>Đăng tin tuyển dụng IT</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Tạo vị trí tuyển dụng mới với đầy đủ thông tin chuẩn thị trường IT Việt Nam.
            </p>

            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề vị trí tuyển dụng (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="VD: Senior Golang Backend Engineer / React Lead"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Địa điểm làm việc (*)</label>
                  <select
                    className="form-select"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  >
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cấp bậc (Level) (*)</label>
                  <select
                    className="form-select"
                    value={jobForm.experienceLevel}
                    onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                  >
                    <option value="FRESHER">Fresher</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Middle</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead / Architect</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Hình thức làm việc (*)</label>
                  <select
                    className="form-select"
                    value={jobForm.employmentType}
                    onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })}
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mức lương hiển thị (VND)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={jobForm.salaryText}
                    onChange={(e) => setJobForm({ ...jobForm, salaryText: e.target.value })}
                    placeholder="VD: 25 - 40 triệu VND hoặc Thỏa thuận"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kỹ năng công nghệ yêu cầu (phân tách bởi dấu phẩy) (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  placeholder="Java, Spring Boot, React, AWS, Docker..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả công việc (Job Description) (*)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Mô tả trách nhiệm chính của vị trí, môi trường công việc..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Yêu cầu chuyên môn (mỗi dòng một yêu cầu)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Tối thiểu 3 năm kinh nghiệm&#10;Thành thạo cấu trúc dữ liệu và giải thuật&#10;Tiếng Anh giao tiếp tốt..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('overview')}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Đăng tin tuyển dụng
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* APPLICANT REVIEW MODAL */}
      {selectedApplicant && (
        <div className="modal-overlay" onClick={() => setSelectedApplicant(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Chi tiết ứng viên: {selectedApplicant.candidateName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Ứng tuyển vị trí: <strong>{selectedApplicant.jobTitle}</strong>
                </p>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedApplicant(null)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h4>Thông tin liên hệ & Kỹ năng</h4>
                <p style={{ fontSize: '0.9rem' }}>📧 Email: {selectedApplicant.candidateEmail}</p>
                <p style={{ fontSize: '0.9rem' }}>🛠️ Kỹ năng: {selectedApplicant.skillsSummary || 'Chưa cập nhật'}</p>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                  📄 CV: {selectedApplicant.cvUrl ? (
                    <a href={selectedApplicant.cvUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      Xem tài liệu CV
                    </a>
                  ) : 'Không có'}
                </p>
              </div>

              <div>
                <h4>Thư giới thiệu</h4>
                <p style={{ fontSize: '0.9rem', background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {selectedApplicant.coverLetter || 'Ứng viên không gửi thư giới thiệu.'}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Lời nhắn / Phản hồi cho ứng viên (sẽ gửi thông báo)</label>
                <input
                  type="text"
                  className="form-input"
                  value={statusFeedback}
                  onChange={(e) => setStatusFeedback(e.target.value)}
                  placeholder="VD: Mời bạn tham gia phỏng vấn lúc 14:00 thứ Ba tới..."
                />
              </div>

              <div>
                <h4 style={{ marginBottom: '8px' }}>Chuyển giai đoạn tuyển dụng:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAdvanceStatus(selectedApplicant.id, 'REVIEWED')}
                  >
                    👀 Đã xem hồ sơ
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAdvanceStatus(selectedApplicant.id, 'INTERVIEW')}
                  >
                    🎯 Mời phỏng vấn
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => handleAdvanceStatus(selectedApplicant.id, 'OFFER')}
                  >
                    🏆 Gửi Offer
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAdvanceStatus(selectedApplicant.id, 'REJECTED')}
                  >
                    ✕ Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
