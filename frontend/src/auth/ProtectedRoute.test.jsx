import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

describe('authentication route guards', () => {
  it('redirects an unauthenticated user through the callback', () => {
    const onUnauthenticated = vi.fn();
    const { container } = render(<ProtectedRoute session={null} onUnauthenticated={onUnauthenticated}><div>Protected</div></ProtectedRoute>);
    expect(onUnauthenticated).toHaveBeenCalledOnce();
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render guest content for an authenticated user', () => {
    const onAuthenticated = vi.fn();
    const { container } = render(<GuestRoute session={{ token: 'token', role: 'CANDIDATE' }} onAuthenticated={onAuthenticated}><div>Guest</div></GuestRoute>);
    expect(onAuthenticated).toHaveBeenCalledOnce();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders protected content for a valid session', () => {
    render(<ProtectedRoute session={{ token: 'token', role: 'CANDIDATE' }} onUnauthenticated={vi.fn()}><p>Protected content</p></ProtectedRoute>);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
