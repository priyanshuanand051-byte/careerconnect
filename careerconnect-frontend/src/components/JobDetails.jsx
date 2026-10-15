
import { useState } from 'react';
import ApplyForm from './ApplyForm';

function JobDetails({ job, onBack }) {
const [showApplyForm, setShowApplyForm] = useState(false);
  if (!job) {
    return (
      <main className="details-page">
        <button className="back-btn" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to jobs
        </button>
        <h2>Job not found</h2>
      </main>
    );
  }

  if (showApplyForm) {
  return (
    <main className="details-page">
      <ApplyForm
        job={job}
        onBack={() => setShowApplyForm(false)}
      />
    </main>
  );
}

  return (
    <main className="details-page">
      <button className="back-btn" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to jobs
      </button>

      <section className="details-card">
        <span className="job-type">
          {job.jobType || 'Opportunity'}
        </span>

        <h1>{job.title || 'Untitled position'}</h1>

        <h3>{job.companyName || 'Company not specified'}</h3>

        {job.location && (
          <p className="details-location">
            📍 {job.location}
          </p>
        )}

        <hr />

        <h2>About this opportunity</h2>

        <p className="details-description">
          {job.description || 'No description has been provided yet.'}
        </p>

        <button
                className="apply-btn"
                onClick={() => setShowApplyForm(true)}
                >
                Apply Now
         </button>
      </section>
    </main>
  );
}

export default JobDetails;
