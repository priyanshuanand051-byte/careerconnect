
import { useEffect, useState } from 'react';
import { getJobs } from '../api';

function RecruiterDashboard({ onBack, onPostJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError('Could not load jobs. Check that the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <main className="recruiter-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">RECRUITER WORKSPACE</p>
          <h1>Recruiter Dashboard</h1>
          <p>Manage your job opportunities in one place.</p>
        </div>

        <button className="signup-btn" onClick={onPostJob}>
          + Post a Job
        </button>
      </div>

      <section className="dashboard-stat">
        <p>Total Jobs Posted</p>
        <h2>{loading ? '...' : jobs.length}</h2>
      </section>

      <section className="dashboard-jobs">
        <h2>Your Job Listings</h2>

        {loading && <p>Loading job listings...</p>}

        {!loading && error && (
          <p role="alert">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p>No jobs available yet. Create your first job posting.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="dashboard-job-list">
            {jobs.map((job) => (
              <article className="dashboard-job-card" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.companyName}</p>
                  <span>{job.location}</span>
                  {' · '}
                  <span>{job.jobType}</span>
                </div>

                <span className="job-id">ID: {job.id}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <button className="back-btn" onClick={onBack}>
        ← Back to CareerConnect
      </button>
    </main>
  );
}

export default RecruiterDashboard;
