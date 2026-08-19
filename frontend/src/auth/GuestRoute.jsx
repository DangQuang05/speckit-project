import React from 'react';

export default function GuestRoute({ session, children, onAuthenticated }) {
  if (session) {
    onAuthenticated();
    return null;
  }
  return children;
}
