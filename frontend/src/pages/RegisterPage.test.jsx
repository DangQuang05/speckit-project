import React from 'react';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from './RegisterPage';
import { registerCandidate } from '../services/api';

vi.mock('../services/api', () => ({ registerCandidate: vi.fn() }));
vi.mock('../auth/authStorage', () => ({ writeAuthSession: vi.fn() }));

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports field-level validation and password guidance', () => {
    render(<RegisterPage onAuthenticated={vi.fn()} onLogin={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    expect(screen.getByText('Vui lòng nhập họ và tên.')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng nhập email hợp lệ.')).toBeInTheDocument();
    expect(screen.getByText('Mật khẩu chưa đáp ứng đủ yêu cầu.')).toBeInTheDocument();
    expect(screen.getByText(/Ít nhất 8 ký tự/)).toBeInTheDocument();
  });

  it('preserves valid values after a duplicate-email response', async () => {
    registerCandidate.mockRejectedValueOnce(new Error('Email is already registered'));
    render(<RegisterPage onAuthenticated={vi.fn()} onLogin={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Họ và tên'), { target: { name: 'fullName', value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { name: 'password', value: 'Valid123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    await waitFor(() => expect(screen.getByText('Email is already registered')).toBeInTheDocument());
    expect(screen.getByLabelText('Họ và tên')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  });
});
