import React from 'react';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('TalentHub authentication shell', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('shows the login screen to a guest', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
  });

  it('allows a guest to open the registration screen', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký ngay' }));

    expect(screen.getByRole('heading', { name: 'Tạo tài khoản' })).toBeInTheDocument();
    expect(screen.getByLabelText('Họ và tên')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ứng viên' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Nhà tuyển dụng' })).toBeInTheDocument();
  });

  it('shows password guidance and field errors before registration submission', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký ngay' }));
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    expect(screen.getByText('Vui lòng nhập họ và tên.')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng nhập email hợp lệ.')).toBeInTheDocument();
    expect(screen.getByText('Mật khẩu chưa đáp ứng đủ yêu cầu.')).toBeInTheDocument();
    expect(screen.getByText(/Ít nhất 8 ký tự/)).toBeInTheDocument();
  });
});
