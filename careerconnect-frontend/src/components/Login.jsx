
import { useState } from 'react';

function Login({ onBack, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // Authentication will be connected to Spring Security later.
    setMessage(
      'Login interface is working. Backend authentication will be connected next.'
    );
  }

  return (
    <main className="auth-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to CareerConnect
      </button>

      <section className="auth-card">
        <a className="brand auth-brand" href="#" onClick={(event) => {
          event.preventDefault();
          onBack();
        }}>
          Career<span>Connect</span>
        </a>

        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to your account</h1>

        <p className="auth-description">
          Continue your journey toward your next opportunity.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage('');
            }}
            required
          />

          <label htmlFor="login-password">Password</label>

          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMessage('');
              }}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="signup-btn auth-submit" type="submit">
            Sign In
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        <p className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onRegister}>
            Create account
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
