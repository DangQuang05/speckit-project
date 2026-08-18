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
    <main className="candidate-dashboard">
      <section className="profile-panel">
        <h1>Candidate profile</h1>
        <label>
          Headline
          <input value={profile.headline} onChange={(event) => handleChange('headline', event.target.value)} />
        </label>
        <label>
          Summary
          <textarea value={profile.summary} onChange={(event) => handleChange('summary', event.target.value)} />
        </label>
        <div className="inline-fields">
          <label>
            Experience years
            <input type="number" value={profile.experienceYears} onChange={(event) => handleChange('experienceYears', Number(event.target.value))} />
          </label>
          <label>
            City
            <input value={profile.city} onChange={(event) => handleChange('city', event.target.value)} />
          </label>
        </div>
        <label>
          Skills
          <input value={profile.skills.join(', ')} onChange={(event) => handleChange('skills', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
        </label>
        <label>
          CV URL
          <input value={profile.cvUrl} onChange={(event) => handleChange('cvUrl', event.target.value)} />
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={profile.availableForWork} onChange={(event) => handleChange('availableForWork', event.target.checked)} />
          Available for work
        </label>
      </section>
    </main>
  );
}
