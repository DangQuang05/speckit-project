import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

expect.extend(toHaveNoViolations);

describe('authentication accessibility semantics', () => {
  it('has no automated accessibility violations on the login screen', async () => {
    render(<LoginPage onAuthenticated={vi.fn()} onRegister={vi.fn()} />);
    expect(await axe(document.body)).toHaveNoViolations();
    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeEnabled();
  });

  it('has no automated accessibility violations on the registration screen', async () => {
    render(<RegisterPage onAuthenticated={vi.fn()} onLogin={vi.fn()} />);
    expect(await axe(document.body)).toHaveNoViolations();
    expect(screen.getByRole('list', { name: 'Yêu cầu mật khẩu' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ứng viên' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Nhà tuyển dụng' })).toBeInTheDocument();
  });
});
