import Login from './components/Login';
import { useEffect, useMemo, useState } from 'react';
import { getJobs } from './api';
import JobDetails from './components/JobDetails';
import './App.css';
import RecruiterDashboard from './components/RecruiterDashboard';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRecruiterDashboard, setShowRecruiterDashboard] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the Spring Boot backend
  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const data = await getJobs();

        if (!cancelled) {
          setJobs(data);
          setError('');
        }
      } catch (err) {
        console.error('Error loading jobs:', err);

        if (!cancelled) {
          setError(
            'Could not load jobs. Check that Spring Boot is running and the API is accessible.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter jobs using the search input
  const filteredJobs = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return jobs;
    }

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.companyName,
        job.location,
        job.jobType,
        job.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [jobs, searchText]);

  // Show the Login page
if (showLogin) {
  return (
    <div className="app">
      <Login
        onBack={() => setShowLogin(false)}
        onRegister={() => alert('Registration page will be added next.')}
      />
    </div>
  );
}

// Show the Recruiter Dashboard
if (showRecruiterDashboard) {
  return (
    <div className="app">
      <RecruiterDashboard
        onBack={() => setShowRecruiterDashboard(false)}
        onPostJob={() =>
          alert('The Post a Job form will be added next.')
        }
      />
    </div>
  );
}

  // Show the selected job's details page
  if (selectedJob) {
    return (
      <div className="app">
        <header className="navbar">
          <a
            className="brand"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setSelectedJob(null);
            }}
          >
            Career<span>Connect</span>
          </a>

          <nav className="nav-links">
            <a
              href="#jobs"
              onClick={(event) => {
                event.preventDefault();
                setSelectedJob(null);
              }}
            >
              Find Jobs
            </a>
          </nav>
        </header>

        <JobDetails
          job={selectedJob}
          onBack={() => setSelectedJob(null)}
        />
      </div>
    );
  }

  // Main homepage
  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          Career<span>Connect</span>
        </a>

        <nav className="nav-links">
          <a href="#jobs">Find Jobs</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="nav-actions">

          <button
                className="login-btn"
                onClick={() => setShowRecruiterDashboard(true)}
              >
                Recruiter Dashboard
           </button>
          <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
          </button>

          <button
            className="signup-btn"
            onClick={() => alert('Registration page will be added next.')}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR NEXT OPPORTUNITY STARTS HERE
            </p>

            <h1>
              Build your future.
              <br />
              Find your <span>opportunity.</span>
            </h1>

            <p className="hero-description">
              Discover jobs and internships that match your skills.
              Take the next step in your career with CareerConnect.
            </p>

            <form
              className="search-box"
              onSubmit={(event) => {
                event.preventDefault();

                document.getElementById('jobs')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              <span className="search-icon">⌕</span>

              <input
                type="search"
                aria-label="Search jobs"
                placeholder="Job title, company or location"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />

              <button type="submit">Search Jobs</button>
            </form>

            <p className="hero-note">
              Opportunities for students, freshers and professionals.
            </p>
          </div>

          <div className="hero-decoration">
            <div className="floating-card top-card">
              <span className="card-icon">✦</span>
              <div>
                <strong>New opportunities</strong>
                <p>Your next step awaits</p>
              </div>
            </div>

            <div className="illustration">
              <div className="illustration-circle">
                <span>CC</span>
              </div>
              <div className="illustration-base" />
            </div>

            <div className="floating-card bottom-card">
              <span className="check-icon">✓</span>
              <div>
                <strong>Career growth</strong>
                <p>One step at a time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE OPPORTUNITIES</p>
              <h2>Available jobs</h2>
              <p className="section-description">
                Find a role where your skills can make a difference.
              </p>
            </div>

            <span className="job-count">
              {loading
                ? 'Loading...'
                : `${filteredJobs.length} ${
                    filteredJobs.length === 1 ? 'job' : 'jobs'
                  }`}
            </span>
          </div>

          {loading && (
            <div className="message-card">
              <p>Loading jobs from CareerConnect...</p>
            </div>
          )}

          {!loading && error && (
            <div className="message-card error-message" role="alert">
              <p>{error}</p>

              <button
                className="apply-btn"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="message-card">
              <h3>
                {jobs.length === 0
                  ? 'No jobs available yet'
                  : 'No matching jobs found'}
              </h3>

              <p>
                {jobs.length === 0
                  ? 'Recruiter job postings will appear here.'
                  : 'Try another job title, company or location.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="company-logo">
                    {(job.companyName || 'C').charAt(0).toUpperCase()}
                  </div>

                  <div className="job-details">
                    <span className="job-type">
                      {job.jobType || 'Opportunity'}
                    </span>

                    <h3>{job.title || 'Untitled position'}</h3>

                    <p className="company-name">
                      {job.companyName || 'Company not specified'}
                    </p>

                    <div className="job-meta">
                      {job.location && <span>⌖ {job.location}</span>}
                    </div>

                    {job.description && (
                      <p className="job-description">
                        {job.description}
                      </p>
                    )}
                  </div>

                  <button
                    className="apply-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    View opportunity →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <p className="eyebrow">SIMPLE. CLEAR. CAREER-FOCUSED.</p>

          <h2>Your next step starts with three actions.</h2>

          <div className="steps">
            <article>
              <span>01</span>
              <h3>Explore</h3>
              <p>Discover opportunities that match your interests.</p>
            </article>

            <article>
              <span>02</span>
              <h3>Apply</h3>
              <p>Take the next step toward the role you want.</p>
            </article>

            <article>
              <span>03</span>
              <h3>Grow</h3>
              <p>Build experience and move your career forward.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#">
          Career<span>Connect</span>
        </a>

        <p>Connecting talent with opportunity.</p>
        <p>© 2026 CareerConnect</p>
      </footer>
    </div>
  );
}

export default App;
