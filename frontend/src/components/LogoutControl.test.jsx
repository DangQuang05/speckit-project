import React from 'react';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LogoutControl from './LogoutControl';

describe('LogoutControl', () => {
  it('requires confirmation before invoking logout', () => {
    const onLogout = vi.fn(() => Promise.resolve());
    render(<LogoutControl onLogout={onLogout} />);

    fireEvent.click(screen.getByRole('button', { name: 'Đăng xuất' }));
    expect(screen.getByRole('group', { name: 'Xác nhận đăng xuất' })).toBeInTheDocument();
    expect(onLogout).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('can cancel logout confirmation', () => {
    render(<LogoutControl onLogout={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Đăng xuất' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }));

    expect(screen.getByRole('button', { name: 'Đăng xuất' })).toBeInTheDocument();
  });
});
