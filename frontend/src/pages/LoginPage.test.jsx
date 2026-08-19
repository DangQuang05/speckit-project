import React from 'react';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';
import { loginUser } from '../services/api';

vi.mock('../services/api', () => ({ loginUser: vi.fn() }));
vi.mock('../auth/authStorage', () => ({ writeAuthSession: vi.fn() }));

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows a generic error for invalid credentials and preserves email', async () => {
    loginUser.mockRejectedValueOnce(new Error('Email hoặc mật khẩu không chính xác'));
    render(<LoginPage onAuthenticated={vi.fn()} onRegister={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { name: 'password', value: 'Wrong123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Email hoặc mật khẩu không chính xác'));
    expect(screen.getByLabelText('Email')).toHaveValue('user@example.com');
  });

  it('prevents duplicate submissions while the request is pending', async () => {
    let resolveRequest;
    loginUser.mockReturnValueOnce(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<LoginPage onAuthenticated={vi.fn()} onRegister={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { name: 'password', value: 'Valid123!' } });
    const submit = screen.getByRole('button', { name: 'Đăng nhập' });
    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(loginUser).toHaveBeenCalledOnce();
    resolveRequest({ token: 'token', userId: 1, role: 'CANDIDATE' });
  });
});
