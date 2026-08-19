import React, { useMemo, useState } from 'react';
import { registerCandidate } from '../services/api';
import { writeAuthSession } from '../auth/authStorage';

const passwordRules = [
  ['length', 'Ít nhất 8 ký tự', (value) => value.length >= 8],
  ['uppercase', 'Có ít nhất 1 chữ hoa', (value) => /[A-Z]/.test(value)],
  ['number', 'Có ít nhất 1 chữ số', (value) => /\d/.test(value)],
  ['special', 'Có ít nhất 1 ký tự đặc biệt', (value) => /[^A-Za-z0-9]/.test(value)],
];

export default function RegisterPage({ onAuthenticated, onLogin }) {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordState = useMemo(() => passwordRules.map(([key, label, test]) => ({ key, label, valid: test(values.password) })), [values.password]);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Vui lòng nhập email hợp lệ.';
    if (passwordState.some((rule) => !rule.valid)) nextErrors.password = 'Mật khẩu chưa đáp ứng đủ yêu cầu.';
    return nextErrors;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await registerCandidate(values);
      writeAuthSession(response);
      onAuthenticated(response);
    } catch (requestError) {
      setErrors({ form: requestError.message || 'Không thể đăng ký lúc này. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-wide" aria-labelledby="register-title">
        <p className="auth-eyebrow">TalentHub Vietnam</p>
        <h1 id="register-title">Tạo tài khoản</h1>
        <p className="auth-intro">Bắt đầu hành trình kết nối cơ hội IT.</p>
        {errors.form && <div className="auth-alert" role="alert">{errors.form}</div>}
        <form onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="register-name">Họ và tên</label>
            <input id="register-name" name="fullName" autoComplete="name" value={values.fullName} onChange={updateValue} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'register-name-error' : undefined} required />
            {errors.fullName && <span id="register-name-error" className="field-error">{errors.fullName}</span>}
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input id="register-email" name="email" type="email" autoComplete="email" value={values.email} onChange={updateValue} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'register-email-error' : undefined} required />
            {errors.email && <span id="register-email-error" className="field-error">{errors.email}</span>}
          </div>
          <div className="auth-field">
            <label htmlFor="register-password">Mật khẩu</label>
            <input id="register-password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={updateValue} aria-invalid={Boolean(errors.password)} aria-describedby="password-help" required />
            <ul id="password-help" className="password-rules" aria-label="Yêu cầu mật khẩu">
              {passwordState.map((rule) => <li key={rule.key} className={rule.valid ? 'valid' : ''}>{rule.valid ? 'Đạt' : 'Thiếu'}: {rule.label}</li>)}
            </ul>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <fieldset className="auth-fieldset">
            <legend>Vai trò</legend>
            <label><input type="radio" name="role" value="CANDIDATE" checked={values.role === 'CANDIDATE'} onChange={updateValue} /> Ứng viên</label>
            <label><input type="radio" name="role" value="RECRUITER" checked={values.role === 'RECRUITER'} onChange={updateValue} /> Nhà tuyển dụng</label>
          </fieldset>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}</button>
        </form>
        <p className="auth-switch">Đã có tài khoản? <button type="button" className="auth-link" onClick={onLogin}>Đăng nhập</button></p>
      </section>
    </main>
  );
}
