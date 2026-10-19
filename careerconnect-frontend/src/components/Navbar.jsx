import { useState } from 'react';

function Navbar({
  currentUser,
  onNavigate,
  currentView,
  onLogout,
  onOpenPostJob,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNav(view) {
    onNavigate(view);
    setMobileMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a
          className="brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
        >
          <div className="brand-icon">CC</div>
          <span>
            Career<span className="brand-accent">Connect</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Find Jobs
          </button>
          <a
            href="#how-it-works"
            className="nav-link-btn"
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                handleNav('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            How It Works
          </a>

          {currentUser?.role === 'STUDENT' && (
            <button
              type="button"
              className={`nav-link-btn ${currentView === 'my-applications' ? 'active' : ''}`}
              onClick={() => handleNav('my-applications')}
            >
              My Applications
            </button>
          )}

          {currentUser?.role === 'RECRUITER' && (
            <button
              type="button"
              className={`nav-link-btn ${currentView === 'recruiter-dashboard' ? 'active' : ''}`}
              onClick={() => handleNav('recruiter-dashboard')}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Nav Actions / User Status */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-profile-menu">
              {currentUser.role === 'RECRUITER' && (
                <button
                  type="button"
                  className="btn-primary-sm"
                  onClick={onOpenPostJob}
                >
                  + Post Job
                </button>
              )}

              <div className="user-badge" title={currentUser.email}>
                <span className="user-avatar">
                  {(currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase()}
                </span>
                <div className="user-info">
                  <span className="user-name">{currentUser.name || currentUser.email.split('@')[0]}</span>
                  <span className={`user-role-pill role-${currentUser.role?.toLowerCase()}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-outline-sm"
                onClick={onLogout}
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <button
                type="button"
                className="btn-text"
                onClick={() => handleNav('recruiter-dashboard')}
              >
                For Employers
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => handleNav('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleNav('register')}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNav('home')}
          >
            🔍 Find Jobs
          </button>
          <a
            href="#how-it-works"
            className="mobile-nav-link"
            onClick={() => {
              handleNav('home');
              setMobileMenuOpen(false);
            }}
          >
            ✦ How It Works
          </a>

          {currentUser?.role === 'STUDENT' && (
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => handleNav('my-applications')}
            >
              📄 My Applications
            </button>
          )}

          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleNav('recruiter-dashboard')}
          >
            💼 Recruiter Dashboard
          </button>

          <div className="mobile-divider" />

          {currentUser ? (
            <div className="mobile-user-box">
              <p className="mobile-user-email">Signed in as {currentUser.email}</p>
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mobile-guest-buttons">
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => handleNav('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => handleNav('register')}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
