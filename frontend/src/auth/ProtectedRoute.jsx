import React from 'react';

export default function ProtectedRoute({ session, children, onUnauthenticated }) {
  if (!session) {
    onUnauthenticated();
    return null;
  }
  return children;
}
