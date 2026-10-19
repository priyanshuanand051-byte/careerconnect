import { useEffect, useState } from 'react';
import { getMyApplications } from '../api';

function MyApplications({ currentUser, onBack, onSelectJob, onRequireLogin }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isStudent = currentUser?.role === 'STUDENT';

  async function refreshApplications() {
    if (!isStudent) return;
    setLoading(true);
    setError('');

    try {
      const data = await getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(
        err.message || 'Could not load your applications. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!isStudent) {
      return;
    }

    async function fetchApps() {
      try {
        const data = await getMyApplications();
        if (!ignore) {
          setApplications(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        if (!ignore) {
          setError(
            err.message || 'Could not load your applications. Please check your network and try again.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchApps();

    return () => {
      ignore = true;
    };
  }, [isStudent]);

  if (!currentUser) {
    return (
      <main className="details-page">
        <div className="details-container">
          <button className="back-btn" onClick={onBack}>
            ← Back to Homepage
          </button>
          <div className="auth-card" style={{ maxWidth: '540px', margin: '40px auto' }}>
            <h2>Sign in to view your applications</h2>
            <p className="auth-description">
              Please log in as a student to track your submitted job applications.
            </p>
            <button className="btn-primary" onClick={onRequireLogin}>
              Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="details-page">
      <div className="details-container">
        <button className="back-btn" onClick={onBack}>
          ← Back to all opportunities
        </button>

        <div className="section-heading" style={{ marginTop: '20px' }}>
          <div>
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>My Applications</h1>
            <p className="section-description">
              Track the progress of your submitted job and internship applications.
            </p>
          </div>

          <button className="btn-outline-sm" onClick={refreshApplications}>
            🔄 Refresh
          </button>
        </div>

        {loading && (
          <div className="message-card">
            <p>Loading your applications from Spring Boot database...</p>
          </div>
        )}

        {!loading && error && (
          <div className="auth-alert error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="message-card">
            <div className="empty-icon" style={{ fontSize: '40px', marginBottom: '12px' }}>
              📄
            </div>
            <h3>No applications submitted yet</h3>
            <p>You haven't applied to any job postings yet. Explore open roles and submit your first application!</p>
            <button
              className="btn-primary"
              style={{ marginTop: '16px' }}
              onClick={onBack}
            >
              Explore Opportunities
            </button>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="applications-list-grid">
            {applications.map((app) => {
              const job = app.job || {};
              const statusClass = `status-${(app.status || 'PENDING').toLowerCase()}`;

              return (
                <article className="app-history-card" key={app.id}>
                  <div className="app-card-top">
                    <div>
                      <span className="job-id-pill">Application #{app.id}</span>
                      <h3 className="app-job-title">{job.title || 'Position Title Unavailable'}</h3>
                      <p className="app-company-name">🏢 {job.companyName || 'Company'}</p>
                    </div>

                    <span className={`status-badge ${statusClass}`}>
                      {app.status || 'PENDING'}
                    </span>
                  </div>

                  <div className="app-meta-row">
                    {job.location && <span>📍 {job.location}</span>}
                    {job.jobType && <span>🏷️ {job.jobType}</span>}
                  </div>

                  <div className="app-card-actions">
                    {job.id && onSelectJob && (
                      <button
                        type="button"
                        className="btn-outline-sm"
                        onClick={() => onSelectJob(job)}
                      >
                        View Job Details →
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyApplications;
