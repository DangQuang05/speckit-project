import { useState } from 'react';

const initialProfile = {
  headline: 'Senior Java Engineer',
  summary: 'Builds scalable backend services and leads onboarding for product squads.',
  experienceYears: 6,
  city: 'Hồ Chí Minh',
  skills: ['Java', 'Spring Boot', 'SQL'],
  cvUrl: 'https://example.com/cv.pdf',
  availableForWork: true,
};

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(initialProfile);

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="main-content">
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Hồ sơ ứng viên</h2>
            <p>Thông tin chuyên môn và kinh nghiệm làm việc</p>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Chức danh chuyên môn</label>
            <input className="form-input" value={profile.headline} onChange={(event) => handleChange('headline', event.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Tóm tắt giới thiệu</label>
            <textarea className="form-textarea" rows={3} value={profile.summary} onChange={(event) => handleChange('summary', event.target.value)} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Số năm kinh nghiệm</label>
              <input className="form-input" type="number" value={profile.experienceYears} onChange={(event) => handleChange('experienceYears', Number(event.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Thành phố</label>
              <input className="form-input" value={profile.city} onChange={(event) => handleChange('city', event.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kỹ năng</label>
            <input className="form-input" value={profile.skills.join(', ')} onChange={(event) => handleChange('skills', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
          </div>

          <div className="form-group">
            <label className="form-label">Đường dẫn CV</label>
            <input className="form-input" value={profile.cvUrl} onChange={(event) => handleChange('cvUrl', event.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" id="dashAvailableForWork" checked={profile.availableForWork} onChange={(event) => handleChange('availableForWork', event.target.checked)} />
            <label htmlFor="dashAvailableForWork" style={{ fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer' }}>
              Sẵn sàng làm việc
            </label>
          </div>
        </form>
      </section>
    </main>
  );
}

