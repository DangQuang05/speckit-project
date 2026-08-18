import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Mini IT Recruitment Platform (TalentHub VN)', () => {
  it('renders the platform brand and role switcher tabs', () => {
    render(<App />);
    expect(screen.getByText('TalentHub Việt Nam')).toBeInTheDocument();
    expect(screen.getByText(/Ứng viên \(Candidate\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Nhà tuyển dụng \(Recruiter\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiểm duyệt \(Moderator\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Quản trị \(Admin\)/i)).toBeInTheDocument();
  });

  it('allows switching to Recruiter view and viewing recruiter dashboard', async () => {
    render(<App />);
    const recruiterBtn = screen.getByText(/Nhà tuyển dụng \(Recruiter\)/i);
    fireEvent.click(recruiterBtn);

    await waitFor(() => {
      expect(screen.getByText(/Tổng quan tuyển dụng/i)).toBeInTheDocument();
      expect(screen.getByText(/Đăng tin tuyển dụng mới/i)).toBeInTheDocument();
    });
  });

  it('allows switching to Moderator view and seeing moderation queue', async () => {
    render(<App />);
    const moderatorBtn = screen.getByText(/Kiểm duyệt \(Moderator\)/i);
    fireEvent.click(moderatorBtn);

    await waitFor(() => {
      expect(screen.getByText(/Bàn làm việc Kiểm duyệt viên/i)).toBeInTheDocument();
    });
  });

  it('allows switching to Admin view and viewing user governance', async () => {
    render(<App />);
    const adminBtn = screen.getByText(/Quản trị \(Admin\)/i);
    fireEvent.click(adminBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quản trị tài khoản & Phân quyền thành viên/i)).toBeInTheDocument();
      expect(screen.getByText(/Xác thực Doanh nghiệp/i)).toBeInTheDocument();
    });
  });
});
