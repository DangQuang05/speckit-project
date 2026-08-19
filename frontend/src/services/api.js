import { getAuthToken } from '../auth/authStorage';

const API_BASE_URL = 'http://localhost:8080/api';

// Fallback in-memory state if backend is unreachable during client-side demo
let mockLocalJobs = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Nexora Labs Vietnam',
    recruiterId: 2,
    title: 'Senior Frontend Engineer (React/TypeScript)',
    location: 'Hồ Chí Minh',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salaryMin: 30000000,
    salaryMax: 45000000,
    salaryText: '30 - 45 triệu VND',
    description: 'Chịu trách nhiệm kiến trúc và phát triển hệ thống web quy mô lớn, thiết kế Design System cho sản phẩm SaaS.',
    requirements: ['Tối thiểu 4 năm kinh nghiệm với React & TypeScript', 'Thành thạo State Management (Zustand/Redux)', 'Kinh nghiệm tối ưu Web Vitals'],
    skillsRequired: ['React', 'TypeScript', 'TailwindCSS', 'REST API', 'Vite'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    companyId: 2,
    companyName: 'Việt Digital Tech',
    recruiterId: 2,
    title: 'Backend Java Engineer (Spring Boot / Microservices)',
    location: 'Hà Nội',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryMin: 25000000,
    salaryMax: 38000000,
    salaryText: '25 - 38 triệu VND',
    description: 'Xây dựng hạ tầng xử lý giao dịch thanh toán tốc độ cao, thiết kế API phân tán và tối ưu truy vấn PostgreSQL.',
    requirements: ['Tối thiểu 3 năm kinh nghiệm với Java 17/21 và Spring Boot', 'Hiểu sâu về JPA/Hibernate và transaction management', 'Kinh nghiệm với Kafka và Redis là điểm cộng'],
    skillsRequired: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    companyId: 3,
    companyName: 'Kite Solutions Đà Nẵng',
    recruiterId: 2,
    title: 'QA Automation Engineer (Playwright / Java)',
    location: 'Đà Nẵng',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryMin: 20000000,
    salaryMax: 30000000,
    salaryText: '20 - 30 triệu VND',
    description: 'Xây dựng automation test framework, thực hiện kiểm thử tự động API và UI cho các ứng dụng web phức tạp.',
    requirements: ['Ít nhất 2 năm kinh nghiệm Automation QA', 'Thành thạo Playwright hoặc Selenium / Cypress', 'Hiểu biết về CI/CD pipeline'],
    skillsRequired: ['Playwright', 'Automation Testing', 'Java', 'CI/CD', 'Postman'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    companyId: 1,
    companyName: 'Nexora Labs Vietnam',
    recruiterId: 2,
    title: 'DevOps / Cloud Engineer (AWS / Kubernetes)',
    location: 'Hồ Chí Minh',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salaryMin: 35000000,
    salaryMax: 55000000,
    salaryText: '35 - 55 triệu VND',
    description: 'Quản trị hạ tầng đám mây AWS, triển khai Kubernetes cluster và xây dựng CI/CD tự động hóa cao.',
    requirements: ['3+ năm kinh nghiệm DevOps & Cloud', 'Kinh nghiệm triển khai EKS, Terraform, Helm', 'Thành thạo giám sát với Prometheus & Grafana'],
    skillsRequired: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    companyId: 2,
    companyName: 'Việt Digital Tech',
    recruiterId: 2,
    title: 'Mobile Flutter Developer',
    location: 'Remote',
    employmentType: 'FULL_TIME',
    experienceLevel: 'JUNIOR',
    salaryMin: 15000000,
    salaryMax: 22000000,
    salaryText: '15 - 22 triệu VND',
    description: 'Phát triển ứng dụng mobile đa nền tảng iOS & Android với Flutter cho nền tảng fintech tiêu dùng.',
    requirements: ['1-2 năm kinh nghiệm Flutter/Dart', 'Nắm vững BLoC hoặc Riverpod', 'Có sản phẩm đã publish lên App Store / Google Play là lợi thế'],
    skillsRequired: ['Flutter', 'Dart', 'Mobile App', 'REST API'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

let mockCandidateProfile = {
  id: 1,
  userId: 1,
  headline: 'Senior Fullstack Engineer (React / Java Spring)',
  summary: 'Kỹ sư phần mềm hơn 5 năm kinh nghiệm xây dựng hệ thống web quy mô lớn, microservices và tối ưu hóa hiệu năng frontend.',
  experienceYears: 5,
  city: 'Hồ Chí Minh',
  skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
  cvUrl: 'https://cv.talenthub.vn/nguyen-van-an-cv.pdf',
  availableForWork: true,
  savedPreferences: JSON.stringify({ city: 'Hồ Chí Minh', skills: ['Java', 'React'], employmentType: 'FULL_TIME' }),
  updatedAt: new Date().toISOString(),
};

let mockApplications = [
  {
    id: 1,
    candidateProfileId: 1,
    candidateUserId: 1,
    candidateName: 'Nguyễn Văn An',
    candidateEmail: 'candidate@talenthub.vn',
    jobId: 1,
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    companyName: 'Nexora Labs Vietnam',
    coverLetter: 'Tôi có hơn 5 năm kinh nghiệm làm việc với React, TypeScript và xây dựng UI phức tạp, rất hào hứng với vị trí này.',
    skillsSummary: 'React, TypeScript, CSS Architecture',
    cvUrl: 'https://cv.talenthub.vn/nguyen-van-an-cv.pdf',
    status: 'SUBMITTED',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  },
];

let mockCases = [
  {
    id: 1,
    subjectType: 'JOB_POSTING',
    subjectId: 5,
    subjectTitle: 'Mobile Flutter Developer (Remote)',
    reporterUserId: 1,
    reporterName: 'Nguyễn Văn An',
    reason: 'Mức lương và yêu cầu công việc không khớp với mô tả tuyển dụng hoặc có dấu hiệu thiếu rõ ràng.',
    status: 'OPEN',
    resolution: null,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

let mockUsers = [
  { id: 1, email: 'candidate@talenthub.vn', fullName: 'Nguyễn Văn An', role: 'CANDIDATE', enabled: true, phoneNumber: '0901234567', createdAt: '2026-08-10T08:00:00Z' },
  { id: 2, email: 'recruiter@talenthub.vn', fullName: 'Trần Thị Mai (Recruiter)', role: 'RECRUITER', enabled: true, phoneNumber: '0912345678', createdAt: '2026-08-10T08:00:00Z' },
  { id: 3, email: 'moderator@talenthub.vn', fullName: 'Lê Hoàng Long (Moderator)', role: 'MODERATOR', enabled: true, phoneNumber: '0923456789', createdAt: '2026-08-10T08:00:00Z' },
  { id: 4, email: 'admin@talenthub.vn', fullName: 'Phạm Minh Đức (Admin)', role: 'ADMIN', enabled: true, phoneNumber: '0934567890', createdAt: '2026-08-10T08:00:00Z' },
];

let mockCompanies = [
  { id: 1, name: 'Nexora Labs Vietnam', website: 'https://nexoralabs.vn', location: 'Hồ Chí Minh (Quận 1)', industry: 'Software & Cloud Solutions', description: 'Công ty công nghệ hàng đầu chuyên về hệ thống phân tán và giải pháp SaaS.', verified: true },
  { id: 2, name: 'Việt Digital Tech', website: 'https://vietdigital.tech', location: 'Hà Nội (Cầu Giấy)', industry: 'Fintech & Banking', description: 'Hệ sinh thái công nghệ tài chính phục vụ hàng triệu người dùng tại Việt Nam.', verified: true },
  { id: 3, name: 'Kite Solutions Đà Nẵng', website: 'https://kitedanang.io', location: 'Đà Nẵng (Hải Châu)', industry: 'AI & Product Engineering', description: 'Tập đoàn đổi mới phát triển các ứng dụng thông minh.', verified: true },
];

let mockAuditLogs = [
  { id: 1, actorUserId: 3, actorName: 'Lê Hoàng Long (Moderator)', actionType: 'REPORT_CREATED', entityType: 'JOB_POSTING', entityId: 5, details: 'Khởi tạo case kiểm duyệt tin tuyển dụng Flutter', createdAt: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: 2, actorUserId: 4, actorName: 'Phạm Minh Đức (Admin)', actionType: 'COMPANY_VERIFICATION', entityType: 'COMPANY', entityId: 1, details: 'Xác thực doanh nghiệp Nexora Labs Vietnam', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
];

let mockNotifications = [
  { id: 1, userId: 1, title: 'Ứng tuyển thành công', message: 'Hồ sơ của bạn cho vị trí Senior Frontend Engineer đã được gửi đến nhà tuyển dụng Nexora Labs.', type: 'APPLICATION', read: false, createdAt: new Date().toISOString() },
];

async function apiFetch(endpoint, options = {}) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'API request failed');
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    // If backend connection fails, seamlessly use mockLocal fallback
    console.warn(`API ${endpoint} offline/error, using fallback:`, error.message);
    return null;
  }
}

async function authFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message || 'Authentication request failed');
    error.status = response.status;
    error.details = body?.data;
    throw error;
  }
  return body?.data !== undefined ? body.data : body;
}

// ----------------- Auth API -----------------
export async function loginUser(email, password) {
  return authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerCandidate(payload) {
  return authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function validateSession(token) {
  return authFetch('/auth/session', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function logoutUser(token) {
  return authFetch('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ----------------- Jobs API -----------------
export async function getJobs(params = {}) {
  const query = new URLSearchParams();
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.city) query.set('city', params.city);
  if (params.skill) query.set('skill', params.skill);
  if (params.employmentType) query.set('employmentType', params.employmentType);
  if (params.experienceLevel) query.set('experienceLevel', params.experienceLevel);
  if (params.companyId) query.set('companyId', params.companyId);
  if (params.activeOnly !== undefined) query.set('activeOnly', params.activeOnly);

  const result = await apiFetch(`/jobs?${query.toString()}`);
  if (result) return result;

  return mockLocalJobs.filter(job => {
    if (params.activeOnly && job.status !== 'ACTIVE') return false;
    if (params.city && !job.location.toLowerCase().includes(params.city.toLowerCase())) return false;
    if (params.skill && !job.skillsRequired.some(s => s.toLowerCase().includes(params.skill.toLowerCase()))) return false;
    if (params.keyword) {
      const q = params.keyword.toLowerCase();
      const match = job.title.toLowerCase().includes(q) || job.companyName.toLowerCase().includes(q) || job.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export async function getJobById(id) {
  const result = await apiFetch(`/jobs/${id}`);
  if (result) return result;
  return mockLocalJobs.find(j => j.id === Number(id));
}

export async function createJob(jobData, recruiterId = 2) {
  const result = await apiFetch('/jobs', {
    method: 'POST',
    headers: { 'X-User-Id': String(recruiterId) },
    body: JSON.stringify(jobData),
  });
  if (result) {
    mockLocalJobs.unshift(result);
    return result;
  }

  const newJob = {
    id: mockLocalJobs.length + 1,
    companyId: jobData.companyId || 1,
    companyName: jobData.companyName || 'Công ty Tech',
    recruiterId,
    title: jobData.title,
    location: jobData.location,
    employmentType: jobData.employmentType || 'FULL_TIME',
    experienceLevel: jobData.experienceLevel || 'MID',
    salaryMin: jobData.salaryMin,
    salaryMax: jobData.salaryMax,
    salaryText: jobData.salaryText || 'Thỏa thuận',
    description: jobData.description,
    requirements: jobData.requirements || [],
    skillsRequired: jobData.skillsRequired || [],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  mockLocalJobs.unshift(newJob);
  return newJob;
}

export async function updateJobStatus(jobId, status) {
  const result = await apiFetch(`/jobs/${jobId}/status?status=${status}`, { method: 'PATCH' });
  if (result) return result;

  const job = mockLocalJobs.find(j => j.id === Number(jobId));
  if (job) job.status = status;
  return job;
}

// ----------------- Candidate Profile API -----------------
export async function getCandidateProfile(userId = 1) {
  const result = await apiFetch(`/candidates/profile/${userId}`);
  if (result) return result;
  return mockCandidateProfile;
}

export async function updateCandidateProfile(userId, profileData) {
  const result = await apiFetch(`/candidates/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  if (result) return result;

  mockCandidateProfile = { ...mockCandidateProfile, ...profileData, updatedAt: new Date().toISOString() };
  return mockCandidateProfile;
}

export async function savePreferences(userId, preferencesObj) {
  const result = await apiFetch(`/candidates/preferences/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ preferences: JSON.stringify(preferencesObj) }),
  });
  if (result) return result;
  mockCandidateProfile.savedPreferences = JSON.stringify(preferencesObj);
  return mockCandidateProfile;
}

// ----------------- Applications API -----------------
export async function applyToJob(jobId, candidateUserId = 1, applicationData = {}) {
  const result = await apiFetch(`/candidates/apply/${jobId}`, {
    method: 'POST',
    headers: { 'X-User-Id': String(candidateUserId) },
    body: JSON.stringify(applicationData),
  });
  if (result) {
    mockApplications.unshift(result);
    return result;
  }

  // Check duplicate locally
  const exists = mockApplications.some(a => a.candidateUserId === candidateUserId && a.jobId === Number(jobId));
  if (exists) {
    throw new Error('Bạn đã nộp hồ sơ cho vị trí này rồi.');
  }

  const job = mockLocalJobs.find(j => j.id === Number(jobId));
  const newApp = {
    id: mockApplications.length + 1,
    candidateProfileId: candidateUserId,
    candidateUserId,
    candidateName: mockUsers.find(u => u.id === candidateUserId)?.fullName || 'Ứng viên',
    candidateEmail: mockUsers.find(u => u.id === candidateUserId)?.email || 'candidate@talenthub.vn',
    jobId: Number(jobId),
    jobTitle: job?.title || 'Vị trí công việc',
    companyName: job?.companyName || 'Công ty',
    coverLetter: applicationData.coverLetter || '',
    skillsSummary: applicationData.skillsSummary || '',
    cvUrl: applicationData.cvUrl || mockCandidateProfile.cvUrl,
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
  mockApplications.unshift(newApp);

  mockNotifications.unshift({
    id: mockNotifications.length + 1,
    userId: candidateUserId,
    title: 'Ứng tuyển thành công',
    message: `Hồ sơ cho vị trí '${newApp.jobTitle}' đã được gửi thành công!`,
    type: 'APPLICATION',
    read: false,
    createdAt: new Date().toISOString(),
  });

  return newApp;
}

export async function getCandidateApplications(userId = 1) {
  const result = await apiFetch(`/candidates/applications/${userId}`);
  if (result) return result;
  return mockApplications.filter(a => a.candidateUserId === Number(userId));
}

export async function getRecruiterApplications(recruiterId = 2) {
  const result = await apiFetch(`/recruiters/${recruiterId}/applications`);
  if (result) return result;
  return mockApplications;
}

export async function updateApplicationStatus(applicationId, status, feedback = '') {
  const result = await apiFetch(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, feedback }),
  });
  if (result) return result;

  const app = mockApplications.find(a => a.id === Number(applicationId));
  if (app) {
    app.status = status;
    app.lastUpdatedAt = new Date().toISOString();
    mockNotifications.unshift({
      id: mockNotifications.length + 1,
      userId: app.candidateUserId,
      title: 'Cập nhật trạng thái ứng tuyển',
      message: `Hồ sơ '${app.jobTitle}' chuyển sang trạng thái: ${status}. ${feedback}`,
      type: 'STATUS_UPDATE',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return app;
}

// ----------------- Moderation API -----------------
export async function reportContent(reportData, reporterUserId = 1) {
  const result = await apiFetch('/moderation/reports', {
    method: 'POST',
    headers: { 'X-User-Id': String(reporterUserId) },
    body: JSON.stringify(reportData),
  });
  if (result) {
    mockCases.unshift(result);
    return result;
  }

  const newCase = {
    id: mockCases.length + 1,
    subjectType: reportData.subjectType,
    subjectId: reportData.subjectId,
    subjectTitle: reportData.subjectTitle || 'Nội dung được báo cáo',
    reporterUserId,
    reporterName: mockUsers.find(u => u.id === reporterUserId)?.fullName || 'Người dùng',
    reason: reportData.reason,
    status: 'OPEN',
    resolution: null,
    createdAt: new Date().toISOString(),
  };
  mockCases.unshift(newCase);
  return newCase;
}

export async function getModerationCases() {
  const result = await apiFetch('/moderation/cases');
  if (result) return result;
  return mockCases;
}

export async function resolveModerationCase(caseId, status, resolution, moderatorUserId = 3) {
  const result = await apiFetch(`/moderation/cases/${caseId}/resolve`, {
    method: 'PATCH',
    headers: { 'X-User-Id': String(moderatorUserId) },
    body: JSON.stringify({ status, resolution }),
  });
  if (result) return result;

  const mc = mockCases.find(c => c.id === Number(caseId));
  if (mc) {
    mc.status = status;
    mc.resolution = resolution;
    if (status === 'REJECTED' && mc.subjectType === 'JOB_POSTING') {
      const job = mockLocalJobs.find(j => j.id === mc.subjectId);
      if (job) job.status = 'REJECTED';
    }
  }
  return mc;
}

// ----------------- Admin API -----------------
export async function getAdminUsers() {
  const result = await apiFetch('/admin/users');
  if (result) return result;
  return mockUsers;
}

export async function updateUserStatus(userId, enabled, adminUserId = 4) {
  const result = await apiFetch(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: { 'X-User-Id': String(adminUserId) },
    body: JSON.stringify({ enabled }),
  });
  if (result) return result;

  const user = mockUsers.find(u => u.id === Number(userId));
  if (user) user.enabled = enabled;
  return user;
}

export async function updateUserRole(userId, role, adminUserId = 4) {
  const result = await apiFetch(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: { 'X-User-Id': String(adminUserId) },
    body: JSON.stringify({ role }),
  });
  if (result) return result;

  const user = mockUsers.find(u => u.id === Number(userId));
  if (user) user.role = role;
  return user;
}

export async function getAdminCompanies() {
  const result = await apiFetch('/admin/companies');
  if (result) return result;
  return mockCompanies;
}

export async function verifyCompany(companyId, verified = true, adminUserId = 4) {
  const result = await apiFetch(`/admin/companies/${companyId}/verify?verified=${verified}`, {
    method: 'PATCH',
    headers: { 'X-User-Id': String(adminUserId) },
  });
  if (result) return result;

  const comp = mockCompanies.find(c => c.id === Number(companyId));
  if (comp) comp.verified = verified;
  return comp;
}

export async function getAuditLogs() {
  const result = await apiFetch('/admin/audit-logs');
  if (result) return result;
  return mockAuditLogs;
}

// ----------------- Notifications API -----------------
export async function getNotifications(userId = 1) {
  const result = await apiFetch(`/notifications/${userId}`);
  if (result) return result;
  return mockNotifications.filter(n => n.userId === Number(userId));
}

export async function markNotificationAsRead(id) {
  const result = await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
  if (result) return result;
  const n = mockNotifications.find(x => x.id === Number(id));
  if (n) n.read = true;
  return n;
}
