import { useState } from 'react';
import { registerUser } from '../api';

function Register({ onBack, onLoginClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 72) {
      newErrors.password = 'Password cannot exceed 72 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setRegisteredSuccess(true);
    } catch (err) {
      console.error('Registration failed:', err);
      setApiError(err.message || 'Registration failed. The email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  if (registeredSuccess) {
    return (
      <main className="auth-page">
        <section className="auth-card success-card">
          <div className="success-icon-badge">✓</div>
          <h2>Account created successfully!</h2>
          <p className="auth-description">
            Welcome to CareerConnect, <strong>{formData.name}</strong>! Your account has been
            registered. You can now sign in with your email and password.
          </p>

          <button
            type="button"
            className="btn-primary w-full"
            onClick={onLoginClick}
          >
            Sign In Now
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to CareerConnect
      </button>

      <section className="auth-card">
        <div className="auth-brand-header">
          <div className="brand-icon">CC</div>
          <span className="brand-text">
            Career<span>Connect</span>
          </span>
        </div>

        <p className="eyebrow">JOIN CAREERCONNECT</p>
        <h1>Create your account</h1>
        <p className="auth-description">
          Find your next job, apply in one click, and track your applications.
        </p>

        {apiError && (
          <div className="auth-alert error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name">
              Full name <span className="req">*</span>
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              placeholder="e.g. Priyanshu Sharma"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              disabled={loading}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">
              Email address <span className="req">*</span>
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">
              Password <span className="req">*</span> (min. 8 characters)
            </label>
            <div className="password-field">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">
              Confirm password <span className="req">*</span>
            </label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            className="btn-primary auth-submit w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={onLoginClick}>
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}

export default Register;
