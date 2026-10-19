import { useState } from 'react';
import ApplyForm from './ApplyForm';

function JobDetails({
  job,
  currentUser,
  onBack,
  onRequireLogin,
  onViewApplications,
}) {
  const [showApplyForm, setShowApplyForm] = useState(false);

  if (!job) {
    return (
      <main className="details-page">
        <div className="details-container">
          <button className="back-btn" onClick={onBack}>
            ← Back to jobs
          </button>
          <div className="message-card">
            <h2>Job not found</h2>
            <p>The opportunity you are looking for may have been removed or is unavailable.</p>
          </div>
        </div>
      </main>
    );
  }

  if (showApplyForm) {
    return (
      <main className="details-page">
        <div className="details-container">
          <ApplyForm
            job={job}
            currentUser={currentUser}
            onBack={() => setShowApplyForm(false)}
            onRequireLogin={onRequireLogin}
            onViewApplications={onViewApplications}
          />
        </div>
      </main>
    );
  }

  const companyInitial = (job.companyName || 'C').charAt(0).toUpperCase();

  return (
    <main className="details-page">
      <div className="details-container">
        <button className="back-btn" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to all opportunities
        </button>

        <section className="details-card">
          {/* Header Banner */}
          <div className="details-header">
            <div className="details-company-avatar">{companyInitial}</div>
            <div className="details-header-text">
              <div className="details-tag-row">
                <span className="job-type-pill">{job.jobType || 'Full-time'}</span>
                <span className="job-id-pill">Opportunity #{job.id}</span>
              </div>
              <h1 className="details-title">{job.title || 'Untitled Position'}</h1>
              <div className="details-company-row">
                <span className="details-company-name">🏢 {job.companyName || 'Company not specified'}</span>
                {job.location && (
                  <span className="details-location">📍 {job.location}</span>
                )}
              </div>
            </div>
          </div>

          <div className="details-divider" />

          {/* Job Overview Stats */}
          <div className="details-quick-grid">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Position Type</span>
              <strong className="quick-stat-val">{job.jobType || 'Not specified'}</strong>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Location</span>
              <strong className="quick-stat-val">{job.location || 'Flexible'}</strong>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Posted By</span>
              <strong className="quick-stat-val">
                {job.recruiter?.name || job.recruiter?.email || 'Verified Employer'}
              </strong>
            </div>
          </div>

          <div className="details-divider" />

          {/* Description Body */}
          <div className="details-body">
            <h2>About this role</h2>
            <div className="details-description-text">
              {job.description ? (
                job.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p className="text-muted">No detailed description has been provided for this role.</p>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="details-actions">
            {currentUser?.role === 'RECRUITER' ? (
              <div className="recruiter-apply-notice">
                <span>ℹ️ You are signed in as a Recruiter. Applications are open to students.</span>
              </div>
            ) : (
              <button
                className="btn-primary-lg"
                onClick={() => {
                  if (!currentUser) {
                    // Still open apply form, but notify user inside or prompt
                    setShowApplyForm(true);
                  } else {
                    setShowApplyForm(true);
                  }
                }}
              >
                Apply for this Position →
              </button>
            )}

            <button className="btn-outline" onClick={onBack}>
              Browse other jobs
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default JobDetails;
