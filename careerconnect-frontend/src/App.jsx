import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobDetails from './components/JobDetails';
import RecruiterDashboard from './components/RecruiterDashboard';
import MyApplications from './components/MyApplications';
import { getJobs, getCurrentUser, clearCurrentUser } from './api';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'details' | 'recruiter-dashboard' | 'my-applications' | 'login' | 'register'
  const [selectedJob, setSelectedJob] = useState(null);

  // Job data states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & filter states
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');

  // Toast notification
  const [toast, setToast] = useState('');

  function triggerToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  // Load jobs from the Spring Boot API
  async function reloadJobs() {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(
        'Could not load jobs from backend. Ensure Spring Boot is running on http://localhost:8080.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchJobs() {
      try {
        const data = await getJobs();
        if (!ignore) {
          setJobs(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (!ignore) {
          setError(
            'Could not load jobs from backend. Ensure Spring Boot is running on http://localhost:8080.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchJobs();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter jobs based on search keyword, job type, and location
  const filteredJobs = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const loc = locationFilter.trim().toLowerCase();

    return jobs.filter((job) => {
      // 1. Keyword match
      if (keyword) {
        const fullContent = [
          job.title,
          job.companyName,
          job.location,
          job.jobType,
          job.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!fullContent.includes(keyword)) {
          return false;
        }
      }

      // 2. Job Type filter
      if (selectedType !== 'ALL') {
        const typeStr = (job.jobType || '').toLowerCase();
        if (!typeStr.includes(selectedType.toLowerCase())) {
          return false;
        }
      }

      // 3. Location filter
      if (loc) {
        const jobLoc = (job.location || '').toLowerCase();
        if (!jobLoc.includes(loc)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchText, selectedType, locationFilter]);

  // Auth Handlers
  function handleLoginSuccess(user) {
    setCurrentUser(user);
    triggerToast(`Welcome back, ${user.name || user.email}!`);
    if (user.role === 'RECRUITER') {
      setCurrentView('recruiter-dashboard');
    } else {
      setCurrentView('home');
    }
  }

  function handleLogout() {
    clearCurrentUser();
    setCurrentUser(null);
    triggerToast('You have been signed out.');
    setCurrentView('home');
  }

  function handleViewJob(job) {
    setSelectedJob(job);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      {/* Toast popup */}
      {toast && (
        <div className="toast-notification" role="status">
          ✓ {toast}
        </div>
      )}

      {/* Global Header */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'home') setSelectedJob(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
        onOpenPostJob={() => {
          setCurrentView('recruiter-dashboard');
        }}
      />

      {/* VIEW: LOGIN */}
      {currentView === 'login' && (
        <Login
          onBack={() => setCurrentView('home')}
          onRegister={() => setCurrentView('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* VIEW: REGISTER */}
      {currentView === 'register' && (
        <Register
          onBack={() => setCurrentView('home')}
          onLoginClick={() => setCurrentView('login')}
        />
      )}

      {/* VIEW: RECRUITER DASHBOARD */}
      {currentView === 'recruiter-dashboard' && (
        <RecruiterDashboard
          currentUser={currentUser}
          onBack={() => setCurrentView('home')}
          onRequireLogin={() => setCurrentView('login')}
        />
      )}

      {/* VIEW: STUDENT APPLICATIONS */}
      {currentView === 'my-applications' && (
        <MyApplications
          currentUser={currentUser}
          onBack={() => setCurrentView('home')}
          onSelectJob={handleViewJob}
          onRequireLogin={() => setCurrentView('login')}
        />
      )}

      {/* VIEW: JOB DETAILS */}
      {currentView === 'details' && selectedJob && (
        <JobDetails
          job={selectedJob}
          currentUser={currentUser}
          onBack={() => {
            setSelectedJob(null);
            setCurrentView('home');
          }}
          onRequireLogin={() => setCurrentView('login')}
          onViewApplications={() => setCurrentView('my-applications')}
        />
      )}

      {/* VIEW: HOMEPAGE */}
      {currentView === 'home' && (
        <main>
          {/* Hero Banner */}
          <section className="hero">
            <div className="hero-inner">
              <div className="hero-text-area">
                <span className="eyebrow">✦ YOUR NEXT OPPORTUNITY STARTS HERE</span>

                <h1>
                  Build your career.
                  <br />
                  Find your <span>opportunity.</span>
                </h1>

                <p className="hero-description">
                  Discover verified jobs, internships, and remote roles. Connect directly with hiring
                  managers and recruiters with CareerConnect.
                </p>

                {/* Hero Multi-Field Search Form */}
                <div className="hero-search-wrapper">
                  <form
                    className="hero-search-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="search-input-group">
                      <span>🔍</span>
                      <input
                        type="search"
                        placeholder="Job title, role, or keywords"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        aria-label="Search by job title or keyword"
                      />
                    </div>

                    <div className="search-divider" />

                    <div className="search-input-group">
                      <span>📍</span>
                      <input
                        type="text"
                        placeholder="City or Remote"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        aria-label="Filter by location"
                      />
                    </div>

                    <button type="submit" className="btn-primary">
                      Search Jobs
                    </button>
                  </form>
                </div>

                <div className="hero-metrics">
                  <div className="metric-item">
                    <span>⚡</span>
                    <span><strong>{jobs.length}</strong> Opportunities active</span>
                  </div>
                  <div className="metric-item">
                    <span>🔒</span>
                    <span><strong>100%</strong> Verified recruiters</span>
                  </div>
                  <div className="metric-item">
                    <span>🚀</span>
                    <span>Direct Spring Boot API</span>
                  </div>
                </div>
              </div>

              {/* Hero Graphic Decorative Illustration */}
              <div className="hero-graphic" aria-hidden="true">
                <div className="float-chip chip-top">
                  <span>✦</span>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>HIRING NOW</span>
                    <div>Top Tech Roles</div>
                  </div>
                </div>

                <div className="graphic-card">
                  <div className="graphic-card-header">
                    <div className="graphic-avatar">CC</div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block' }}>CareerConnect</strong>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Hiring Platform</span>
                    </div>
                  </div>

                  <div className="graphic-badge-row">
                    <span className="badge badge-live">● Live Backend</span>
                    <span className="badge">Spring Boot</span>
                    <span className="badge">MySQL</span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                    Connect talented students and ambitious professionals with premier companies.
                  </p>
                </div>

                <div className="float-chip chip-bottom">
                  <span>✓</span>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>STATUS</span>
                    <div>Fast Applications</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Postings Explorer */}
          <section className="jobs-section" id="jobs">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EXPLORE OPPORTUNITIES</p>
                <h2>Available Positions</h2>
                <p className="section-description">
                  Discover your ideal role and take the next step in your professional journey.
                </p>
              </div>

              <span className="job-count-badge">
                {loading
                  ? 'Loading...'
                  : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'position' : 'positions'} found`}
              </span>
            </div>

            {/* Filter Pills Bar */}
            <div className="filter-bar">
              <div className="filter-pills" role="tablist" aria-label="Job type filter">
                {['ALL', 'Full-time', 'Internship', 'Remote', 'Part-time', 'Contract'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="tab"
                    aria-selected={selectedType === type}
                    className={`filter-pill ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'ALL' ? 'All Roles' : type}
                  </button>
                ))}
              </div>

              {(searchText || locationFilter || selectedType !== 'ALL') && (
                <button
                  type="button"
                  className="link-btn"
                  style={{ fontSize: '13px' }}
                  onClick={() => {
                    setSearchText('');
                    setLocationFilter('');
                    setSelectedType('ALL');
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="message-card">
                <p>Loading active job listings from CareerConnect...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="message-card">
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚠️</div>
                <h3>Unable to connect to the backend</h3>
                <p style={{ marginBottom: '18px' }}>{error}</p>
                <button className="btn-primary" onClick={reloadJobs}>
                  Retry Connection
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="message-card">
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
                <h3>
                  {jobs.length === 0
                    ? 'No jobs available in the database yet'
                    : 'No matching jobs found'}
                </h3>
                <p>
                  {jobs.length === 0
                    ? 'Switch to the Recruiter Dashboard to publish your first job opportunity!'
                    : 'Try broadening your search keywords or clearing your filters.'}
                </p>
                {jobs.length === 0 ? (
                  <button
                    className="btn-primary"
                    style={{ marginTop: '16px' }}
                    onClick={() => setCurrentView('recruiter-dashboard')}
                  >
                    Go to Recruiter Dashboard
                  </button>
                ) : (
                  <button
                    className="btn-outline"
                    style={{ marginTop: '16px' }}
                    onClick={() => {
                      setSearchText('');
                      setLocationFilter('');
                      setSelectedType('ALL');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* Jobs Grid */}
            {!loading && !error && filteredJobs.length > 0 && (
              <div className="job-list">
                {filteredJobs.map((job) => {
                  const initial = (job.companyName || 'C').charAt(0).toUpperCase();

                  return (
                    <article className="job-card" key={job.id}>
                      <div>
                        <div className="job-card-header">
                          <div className="company-logo">{initial}</div>
                          <div className="job-card-title-group">
                            <span className="job-type-pill">{job.jobType || 'Opportunity'}</span>
                            <h3>{job.title || 'Untitled Position'}</h3>
                            <p className="company-name">
                              {job.companyName || 'Company not specified'}
                            </p>
                          </div>
                        </div>

                        <div className="job-meta-row">
                          {job.location && <span>📍 {job.location}</span>}
                          {job.recruiter?.name && <span>👤 {job.recruiter.name}</span>}
                        </div>

                        {job.description && (
                          <p className="job-description-excerpt">{job.description}</p>
                        )}
                      </div>

                      <div className="job-card-footer">
                        <span className="job-id-pill">ID #{job.id}</span>
                        <button
                          type="button"
                          className="btn-primary-sm"
                          onClick={() => handleViewJob(job)}
                        >
                          View opportunity →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* How It Works Section */}
          <section className="how-section" id="how-it-works">
            <div className="how-container">
              <span className="eyebrow">SIMPLE. CLEAR. CAREER-FOCUSED.</span>
              <h2>Your next step starts with three simple actions</h2>

              <div className="steps-grid">
                <article className="step-card">
                  <span className="step-number">01</span>
                  <h3>Explore</h3>
                  <p>
                    Browse through curated jobs and internships tailored for students, freshers, and
                    seasoned professionals.
                  </p>
                </article>

                <article className="step-card">
                  <span className="step-number">02</span>
                  <h3>Apply</h3>
                  <p>
                    Submit your application in seconds directly to hiring recruiters with your
                    portfolio and qualifications.
                  </p>
                </article>

                <article className="step-card">
                  <span className="step-number">03</span>
                  <h3>Grow</h3>
                  <p>
                    Track the real-time status of your applications and accelerate your professional
                    career growth.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Global Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="brand">
            <div className="brand-icon">CC</div>
            <span>
              Career<span className="brand-accent">Connect</span>
            </span>
          </div>

          <p className="footer-copy">
            Connecting talent with opportunity. Powered by Spring Boot REST API & MySQL.
          </p>

          <p className="footer-copy">© 2026 CareerConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
