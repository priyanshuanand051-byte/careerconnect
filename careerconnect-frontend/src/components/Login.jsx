import { useState } from 'react';
import { loginUser } from '../api';

function Login({ onBack, onRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' or 'RECRUITER'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(email, password, role);
      setInfoMessage('Signed in successfully!');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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

        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to your account</h1>

        <p className="auth-description">
          Choose your account type and enter your credentials to continue.
        </p>

        {/* Role Selector Tabs */}
        <div className="role-selector" role="tablist" aria-label="Account Type">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'STUDENT'}
            className={`role-tab ${role === 'STUDENT' ? 'active' : ''}`}
            onClick={() => {
              setRole('STUDENT');
              setError('');
            }}
          >
            🎓 Job Seeker / Student
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'RECRUITER'}
            className={`role-tab ${role === 'RECRUITER' ? 'active' : ''}`}
            onClick={() => {
              setRole('RECRUITER');
              setError('');
            }}
          >
            💼 Employer / Recruiter
          </button>
        </div>

        {error && (
          <div className="auth-alert error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="auth-alert success-alert" role="status">
            <span className="alert-icon">✓</span>
            <span>{infoMessage}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
                required
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
          </div>

          <button
            className="btn-primary auth-submit w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign in as ${role === 'RECRUITER' ? 'Recruiter' : 'Student'}`}
          </button>
        </form>

        <div className="auth-hint">
          <small>
            Spring Security uses HTTP Basic Auth. New accounts created via Registration have the{' '}
            <strong>STUDENT</strong> role.
          </small>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button type="button" className="link-btn" onClick={onRegister}>
            Create student account
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
