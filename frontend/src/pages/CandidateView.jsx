import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import ApplyModal from '../components/ApplyModal';
import ReportModal from '../components/ReportModal';
import {
  getJobs,
  getCandidateProfile,
  updateCandidateProfile,
  savePreferences,
  getCandidateApplications,
  applyToJob,
  reportContent,
} from '../services/api';

export default function CandidateView({ currentUser, onShowToast }) {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'profile' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [reportingJob, setReportingJob] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    headline: '',
    summary: '',
    experienceYears: 0,
    city: 'Hồ Chí Minh',
    skills: '',
    cvUrl: '',
    availableForWork: true,
  });

  const cities = ['Tất cả địa điểm', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Remote'];
  const popularSkills = ['React', 'Java', 'Spring Boot', 'TypeScript', 'Docker', 'Kubernetes', 'Playwright', 'Flutter', 'DevOps', 'PostgreSQL'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, profileData, appsData] = await Promise.all([
        getJobs({
          keyword: keyword || undefined,
          city: selectedCity && selectedCity !== 'Tất cả địa điểm' ? selectedCity : undefined,
          skill: selectedSkill || undefined,
          experienceLevel: selectedLevel || undefined,
          activeOnly: true,
        }),
        getCandidateProfile(currentUser.id),
        getCandidateApplications(currentUser.id),
      ]);

      setJobs(jobsData || []);
      setApplications(appsData || []);
      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          headline: profileData.headline || '',
          summary: profileData.summary || '',
          experienceYears: profileData.experienceYears || 0,
          city: profileData.city || 'Hồ Chí Minh',
          skills: profileData.skills ? profileData.skills.join(', ') : '',
          cvUrl: profileData.cvUrl || '',
          availableForWork: profileData.availableForWork ?? true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [keyword, selectedCity, selectedSkill, selectedLevel, currentUser.id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = profileForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const updated = await updateCandidateProfile(currentUser.id, {
        headline: profileForm.headline,
        summary: profileForm.summary,
        experienceYears: Number(profileForm.experienceYears),
        city: profileForm.city,
        skills: skillsArray,
        cvUrl: profileForm.cvUrl,
        availableForWork: profileForm.availableForWork,
      });
      setProfile(updated);
      onShowToast('Cập nhật hồ sơ cá nhân thành công');
    } catch (err) {
      onShowToast(err.message || 'Lỗi lưu hồ sơ');
    }
  };

  const handleSaveSearchPreferences = async () => {
    try {
      const prefs = {
        city: selectedCity,
        skill: selectedSkill,
        level: selectedLevel,
        keyword,
      };
      await savePreferences(currentUser.id, prefs);
      onShowToast('Đã lưu bộ lọc tìm việc mặc định');
    } catch (err) {
      onShowToast(err.message || 'Lỗi lưu bộ lọc');
    }
  };

  const handleApplySubmit = async (jobId, appData) => {
    try {
      await applyToJob(jobId, currentUser.id, appData);
      onShowToast('Nộp hồ sơ ứng tuyển thành công');
      loadData();
    } catch (err) {
      onShowToast(err.message || 'Lỗi nộp hồ sơ');
    }
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await reportContent(reportData, currentUser.id);
      onShowToast('Đã gửi báo cáo cho ban kiểm duyệt xem xét');
    } catch (err) {
      onShowToast(err.message || 'Lỗi gửi báo cáo');
    }
  };

  const appliedJobIds = applications.map((a) => a.jobId);

  const getApplicationStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="badge badge-primary">Đã nộp hồ sơ</span>;
      case 'REVIEWED':
        return <span className="badge badge-purple">Đã xem hồ sơ</span>;
      case 'INTERVIEW':
        return <span className="badge badge-warning">Mời phỏng vấn</span>;
      case 'OFFER':
        return <span className="badge badge-success">Gửi Offer</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Chưa phù hợp</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div>
      <nav className="tabs-nav" role="tablist">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Tìm kiếm việc làm ({jobs.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Việc đã ứng tuyển ({applications.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Hồ sơ cá nhân & CV
        </button>
      </nav>

      {/* TAB 1: JOB SEARCH */}
      {activeTab === 'search' && (
        <section>
          <div className="filter-bar">
            <div className="filter-row">
              <input
                type="text"
                className="form-input"
                placeholder="Tìm theo chức danh, kỹ năng, công ty..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ flex: '2', minWidth: '220px' }}
              />

              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ flex: '1', minWidth: '150px' }}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{ flex: '1', minWidth: '130px' }}
              >
                <option value="">Tất cả cấp bậc</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Middle</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </select>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSaveSearchPreferences}
                title="Lưu tiêu chí tìm kiếm này vào hồ sơ"
              >
                Lưu bộ lọc
              </button>
            </div>

            {/* Popular Skills Filter Chips */}
            <div className="filter-chips">
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Kỹ năng:</span>
              <button
                type="button"
                className={`filter-chip-btn ${selectedSkill === '' ? 'active' : ''}`}
                onClick={() => setSelectedSkill('')}
              >
                Tất cả
              </button>
              {popularSkills.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  className={`filter-chip-btn ${selectedSkill.toLowerCase() === sk.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setSelectedSkill(selectedSkill.toLowerCase() === sk.toLowerCase() ? '' : sk)}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="empty-state">
              <p>Đang tải danh sách cơ hội việc làm IT...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="card empty-state">
              <h3>Không tìm thấy vị trí phù hợp</h3>
              <p>
                Hãy thử thay đổi từ khóa hoặc xóa bớt bộ lọc địa điểm / kỹ năng.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setKeyword('');
                  setSelectedCity('');
                  setSelectedSkill('');
                  setSelectedLevel('');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="jobs-list-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={appliedJobIds.includes(job.id)}
                  onViewDetails={(j) => setSelectedJob(j)}
                  onApply={(j) => setApplyingJob(j)}
                  onReport={(j) => setReportingJob(j)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <section>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div>
                <h2>Danh sách hồ sơ đã ứng tuyển ({applications.length})</h2>
                <p>
                  Theo dõi tiến trình xét duyệt hồ sơ từ nhà tuyển dụng theo thời gian thực.
                </p>
              </div>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="card empty-state">
              <h3>Bạn chưa nộp hồ sơ nào</h3>
              <p>
                Khám phá các vị trí tuyển dụng IT hấp dẫn và nộp hồ sơ ngay hôm nay.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => setActiveTab('search')}
              >
                Tìm việc ngay
              </button>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vị trí ứng tuyển</th>
                    <th>Công ty</th>
                    <th>Ngày nộp</th>
                    <th>Trạng thái xét duyệt</th>
                    <th>CV gửi kèm</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.jobTitle}</strong>
                        {app.skillsSummary && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Kỹ năng: {app.skillsSummary}
                          </div>
                        )}
                      </td>
                      <td>{app.companyName}</td>
                      <td>
                        {new Date(app.submittedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td>{getApplicationStatusBadge(app.status)}</td>
                      <td>
                        {app.cvUrl ? (
                          <a
                            href={app.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="badge badge-neutral"
                            style={{ textDecoration: 'underline' }}
                          >
                            Xem CV
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Không có</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: CANDIDATE PROFILE */}
      {activeTab === 'profile' && (
        <section>
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Hồ sơ ứng viên & Kinh nghiệm</h2>
                <p>
                  Hoàn thiện thông tin để nhà tuyển dụng dễ dàng tìm thấy bạn và nộp CV nhanh chóng.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Chức danh chuyên môn (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  placeholder="VD: Senior Java Developer / Fullstack React Engineer"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileForm.experienceYears}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                    min="0"
                    max="40"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thành phố sinh sống (*)</label>
                  <select
                    className="form-select"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  >
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Danh sách kỹ năng (phân tách bởi dấu phẩy) (*)</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  placeholder="React, TypeScript, Java, Spring Boot, Docker, PostgreSQL..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn file CV trực tuyến (URL PDF / Google Drive / LinkedIn) (*)</label>
                <input
                  type="url"
                  className="form-input"
                  value={profileForm.cvUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, cvUrl: e.target.value })}
                  placeholder="https://cv.talenthub.vn/nguyen-van-an-cv.pdf"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tóm tắt giới thiệu bản thân</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={profileForm.summary}
                  onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                  placeholder="Mô tả các dự án, điểm mạnh công nghệ và định hướng nghề nghiệp của bạn..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="availableForWork"
                  checked={profileForm.availableForWork}
                  onChange={(e) => setProfileForm({ ...profileForm, availableForWork: e.target.checked })}
                />
                <label htmlFor="availableForWork" style={{ fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer' }}>
                  Sẵn sàng nhận lời mời phỏng vấn & cơ hội việc làm mới
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* MODALS */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          hasApplied={appliedJobIds.includes(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
          onApply={(j) => setApplyingJob(j)}
          onReport={(j) => setReportingJob(j)}
        />
      )}

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          profile={profile}
          onClose={() => setApplyingJob(null)}
          onSubmit={handleApplySubmit}
        />
      )}

      {reportingJob && (
        <ReportModal
          target={reportingJob}
          onClose={() => setReportingJob(null)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}

