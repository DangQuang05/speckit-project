import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { writeAuthSession } from '../auth/authStorage';

export default function LoginPage({ onAuthenticated, onRegister, sessionMessage = '' }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(sessionMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const response = await loginUser(values.email, values.password);
      writeAuthSession(response);
      onAuthenticated(response);
    } catch (requestError) {
      setError(requestError.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="auth-eyebrow">TalentHub Vietnam</p>
        <h1 id="login-title">Đăng nhập</h1>
        <p className="auth-intro">Truy cập không gian tuyển dụng của bạn.</p>
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <form onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" name="email" type="email" autoComplete="email" value={values.email} onChange={updateValue} required />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Mật khẩu</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={updateValue} required />
          </div>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
        <p className="auth-switch">Chưa có tài khoản? <button type="button" className="auth-link" onClick={onRegister}>Đăng ký ngay</button></p>
      </section>
    </main>
  );
}
