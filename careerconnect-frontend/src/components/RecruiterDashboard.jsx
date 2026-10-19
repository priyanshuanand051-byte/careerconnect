import { useEffect, useState } from 'react';
import {
  getMyJobs,
  getRecruiterSummary,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateApplicationStatus,
} from '../api';

function RecruiterDashboard({ currentUser, onBack, onRequireLogin }) {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Form state for Create / Edit
  const [jobForm, setJobForm] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isRecruiter = currentUser?.role === 'RECRUITER';

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  }

  // Load recruiter jobs and dashboard stats
  async function loadData() {
    if (!isRecruiter) return;

    setLoading(true);
    setError('');

    try {
      const [jobsData, summaryData] = await Promise.all([
        getMyJobs().catch(() => []),
        getRecruiterSummary().catch(() => null),
      ]);

      const safeJobs = Array.isArray(jobsData) ? jobsData : jobsData?.content ?? [];
      setJobs(safeJobs);

      if (summaryData) {
        setSummary(summaryData);
      } else {
        setSummary({
          totalJobs: safeJobs.length,
          totalApplications: 0,
          pendingApplications: 0,
          shortlistedApplications: 0,
          rejectedApplications: 0,
        });
      }
    } catch (err) {
      console.error('Error loading recruiter data:', err);
      setError(
        err.message || 'Could not load your job postings. Please check that Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!isRecruiter) {
      return;
    }

    async function fetchRecruiterData() {
      try {
        const [jobsData, summaryData] = await Promise.all([
          getMyJobs().catch(() => []),
          getRecruiterSummary().catch(() => null),
        ]);

        if (!ignore) {
          const safeJobs = Array.isArray(jobsData) ? jobsData : jobsData?.content ?? [];
          setJobs(safeJobs);

          if (summaryData) {
            setSummary(summaryData);
          } else {
            setSummary({
              totalJobs: safeJobs.length,
              totalApplications: 0,
              pendingApplications: 0,
              shortlistedApplications: 0,
              rejectedApplications: 0,
            });
          }
          setError('');
        }
      } catch (err) {
        console.error('Error loading recruiter data:', err);
        if (!ignore) {
          setError(
            err.message || 'Could not load your job postings. Please check that Spring Boot is running.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecruiterData();

    return () => {
      ignore = true;
    };
  }, [isRecruiter]);

  // Handle Form Input Validation
  function validateForm() {
    const errs = {};
    if (!jobForm.title.trim()) errs.title = 'Job title is required';
    else if (jobForm.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';

    if (!jobForm.companyName.trim()) errs.companyName = 'Company name is required';
    else if (jobForm.companyName.trim().length > 100)
      errs.companyName = 'Company name cannot exceed 100 characters';

    if (!jobForm.location.trim()) errs.location = 'Location is required';
    if (!jobForm.jobType.trim()) errs.jobType = 'Job type is required';

    if (!jobForm.description.trim()) errs.description = 'Job description is required';
    else if (jobForm.description.trim().length > 2000)
      errs.description = 'Description cannot exceed 2000 characters';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Open Create Job Modal
  function handleOpenCreate() {
    setJobForm({
      title: '',
      companyName: '',
      location: '',
      jobType: 'Full-time',
      description: '',
    });
    setFormErrors({});
    setShowCreateModal(true);
  }

  // Open Edit Job Modal
  function handleOpenEdit(job) {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      companyName: job.companyName || '',
      location: job.location || '',
      jobType: job.jobType || 'Full-time',
      description: job.description || '',
    });
    setFormErrors({});
  }

  // Save (Create or Update)
  async function handleSaveJob(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobForm);
        showToast(`Job #${editingJob.id} updated successfully!`);
        setEditingJob(null);
      } else {
        const created = await createJob(jobForm);
        showToast(`New job "${created.title || jobForm.title}" created successfully!`);
        setShowCreateModal(false);
      }
      loadData();
    } catch (err) {
      console.error('Failed to save job:', err);
      alert(err.message || 'Failed to save job posting.');
    } finally {
      setSubmitting(false);
    }
  }

  // Confirm Delete
  async function handleConfirmDelete() {
    if (!deletingJob) return;
    setSubmitting(true);
    try {
      await deleteJob(deletingJob.id);
      showToast(`Job #${deletingJob.id} was deleted.`);
      setDeletingJob(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert(err.message || 'Failed to delete job posting.');
    } finally {
      setSubmitting(false);
    }
  }

  // View Applicants
  async function handleViewApplicants(job) {
    setViewingApplicantsJob(job);
    setApplicantsLoading(true);
    try {
      const data = await getJobApplicants(job.id);
      setApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  }

  // Update Applicant Status
  async function handleStatusChange(applicationId, newStatus) {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      showToast(`Applicant status changed to ${newStatus}`);
      if (viewingApplicantsJob) {
        handleViewApplicants(viewingApplicantsJob);
      }
      loadData();
    } catch (err) {
      console.error('Status update failed:', err);
      alert(err.message || 'Failed to update applicant status.');
    }
  }

  // Filtered jobs by search text
  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.companyName} ${job.location} ${job.jobType}`.toLowerCase();
    return text.includes(searchFilter.trim().toLowerCase());
  });

  // Not signed in as recruiter guard
  if (!isRecruiter) {
    return (
      <main className="recruiter-dashboard">
        <button className="back-btn" onClick={onBack}>
          ← Back to CareerConnect
        </button>

        <section className="auth-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
          <div className="auth-brand-header">
            <div className="brand-icon">💼</div>
            <span className="brand-text">
              Recruiter <span>Workspace</span>
            </span>
          </div>

          <h2>Recruiter Authentication Required</h2>
          <p className="auth-description">
            To view the Recruiter Dashboard, post new opportunities, or manage existing listings,
            please sign in with an account having <strong>ROLE_RECRUITER</strong> credentials.
          </p>

          <div className="auth-hint" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <p><strong>Note for testing:</strong></p>
            <p>
              In Spring Security, endpoints under <code>/api/jobs/my-jobs</code>,{' '}
              <code>POST /api/jobs</code>, and <code>/api/recruiter/dashboard/**</code> are protected
              with <code>hasRole('RECRUITER')</code> using HTTP Basic Authentication.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={onRequireLogin}
            >
              Sign In as Recruiter
            </button>
            <button type="button" className="btn-outline" onClick={onBack}>
              Return to Homepage
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="recruiter-dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          ✓ {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header-container">
        <div className="dashboard-title-area">
          <p className="eyebrow">RECRUITER PORTAL</p>
          <h1>Recruiter Dashboard</h1>
          <p className="section-description">
            Manage your company postings, review applicants, and track your recruitment pipeline.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="btn-primary" onClick={handleOpenCreate}>
            + Post a New Job
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <section className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">💼</div>
          <div>
            <span className="stat-label">Total Jobs Posted</span>
            <h2 className="stat-number">{summary ? summary.totalJobs : jobs.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">📥</div>
          <div>
            <span className="stat-label">Total Applicants</span>
            <h2 className="stat-number">{summary?.totalApplications ?? 0}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">⏳</div>
          <div>
            <span className="stat-label">Pending Review</span>
            <h2 className="stat-number">{summary?.pendingApplications ?? 0}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">⭐</div>
          <div>
            <span className="stat-label">Shortlisted</span>
            <h2 className="stat-number">{summary?.shortlistedApplications ?? 0}</h2>
          </div>
        </div>
      </section>

      {/* Jobs Listing Section */}
      <section className="recruiter-jobs-panel">
        <div className="panel-toolbar">
          <div>
            <h2>Your Job Listings ({filteredJobs.length})</h2>
            <p className="panel-sub">Active opportunities published by your account</p>
          </div>

          <div className="search-filter-box">
            <input
              type="search"
              placeholder="Filter your listings..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="dashboard-search-input"
            />
          </div>
        </div>

        {loading && (
          <div className="message-card">
            <p>Loading your listings from Spring Boot...</p>
          </div>
        )}

        {!loading && error && (
          <div className="auth-alert error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
            <button
              type="button"
              className="btn-outline-sm"
              style={{ marginLeft: 'auto' }}
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="message-card empty-recruiter-state">
            <div className="empty-icon">📋</div>
            <h3>
              {jobs.length === 0 ? 'No job listings posted yet' : 'No jobs matching filter'}
            </h3>
            <p>
              {jobs.length === 0
                ? 'Create your first job posting to start receiving applications from qualified candidates.'
                : 'Try adjusting your search keywords.'}
            </p>
            {jobs.length === 0 && (
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '14px' }}
                onClick={handleOpenCreate}
              >
                + Post Your First Job
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="recruiter-table-wrapper">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Job Title & Role</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Applicants</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="table-job-title">
                        <strong>{job.title}</strong>
                        <span className="table-company">{job.companyName} · ID #{job.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-loc">📍 {job.location}</span>
                    </td>
                    <td>
                      <span className="job-type-pill">{job.jobType}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-view-applicants"
                        onClick={() => handleViewApplicants(job)}
                      >
                        👥 View Applicants
                      </button>
                    </td>
                    <td>
                      <div className="table-action-buttons">
                        <button
                          type="button"
                          className="btn-action-edit"
                          title="Edit this listing"
                          onClick={() => handleOpenEdit(job)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          title="Delete this listing"
                          onClick={() => setDeletingJob(job)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div style={{ marginTop: '30px' }}>
        <button className="back-btn" onClick={onBack}>
          ← Back to Homepage
        </button>
      </div>

      {/* CREATE / EDIT JOB MODAL */}
      {(showCreateModal || editingJob) && (
        <div className="modal-backdrop" onClick={() => {
          setShowCreateModal(false);
          setEditingJob(null);
        }}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>{editingJob ? `Edit Job #${editingJob.id}` : 'Create New Job Posting'}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingJob(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} noValidate className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-title">
                  Job Title <span className="req">*</span>
                </label>
                <input
                  id="modal-title"
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className={formErrors.title ? 'input-error' : ''}
                  disabled={submitting}
                />
                {formErrors.title && <span className="field-error">{formErrors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-company">
                    Company Name <span className="req">*</span>
                  </label>
                  <input
                    id="modal-company"
                    type="text"
                    placeholder="e.g. Acme Tech"
                    value={jobForm.companyName}
                    onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                    className={formErrors.companyName ? 'input-error' : ''}
                    disabled={submitting}
                  />
                  {formErrors.companyName && (
                    <span className="field-error">{formErrors.companyName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="modal-location">
                    Location <span className="req">*</span>
                  </label>
                  <input
                    id="modal-location"
                    type="text"
                    placeholder="e.g. Remote, Bangalore, New York"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className={formErrors.location ? 'input-error' : ''}
                    disabled={submitting}
                  />
                  {formErrors.location && (
                    <span className="field-error">{formErrors.location}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modal-jobType">
                  Employment Type <span className="req">*</span>
                </label>
                <select
                  id="modal-jobType"
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  disabled={submitting}
                  className="modal-select"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-description">
                  Job Description <span className="req">*</span>
                </label>
                <textarea
                  id="modal-description"
                  rows={6}
                  placeholder="Describe role responsibilities, qualifications, requirements, and benefits..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className={formErrors.description ? 'input-error' : ''}
                  disabled={submitting}
                />
                {formErrors.description && (
                  <span className="field-error">{formErrors.description}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Saving to Backend...'
                    : editingJob
                    ? 'Update Posting'
                    : 'Publish Job Posting'}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingJob(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingJob && (
        <div className="modal-backdrop" onClick={() => setDeletingJob(null)}>
          <div
            className="modal-container danger-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingJob(null)}
              >
                ✕
              </button>
            </div>
            <p>
              Are you sure you want to permanently delete the job posting for{' '}
              <strong>"{deletingJob.title}"</strong> (ID #{deletingJob.id})? This will call{' '}
              <code>DELETE /api/jobs/{deletingJob.id}</code> on your Spring Boot backend.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Job'}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setDeletingJob(null)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW APPLICANTS MODAL */}
      {viewingApplicantsJob && (
        <div className="modal-backdrop" onClick={() => setViewingApplicantsJob(null)}>
          <div
            className="modal-container large-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="modal-header">
              <div>
                <h2>Applicants for {viewingApplicantsJob.title}</h2>
                <span className="table-company">
                  {viewingApplicantsJob.companyName} · Opportunity #{viewingApplicantsJob.id}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingApplicantsJob(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              {applicantsLoading && <p>Loading applicants from database...</p>}

              {!applicantsLoading && applicants.length === 0 && (
                <div className="empty-applicants-state">
                  <p>No student applications received for this job yet.</p>
                </div>
              )}

              {!applicantsLoading && applicants.length > 0 && (
                <div className="applicants-list">
                  {applicants.map((app) => (
                    <div className="applicant-card" key={app.id}>
                      <div className="applicant-info">
                        <strong>
                          {app.student?.name || app.student?.email || `Applicant #${app.id}`}
                        </strong>
                        <span className="applicant-email">{app.student?.email}</span>
                        <div className="applicant-status-row">
                          <span className={`status-tag status-${app.status?.toLowerCase()}`}>
                            Status: {app.status || 'PENDING'}
                          </span>
                        </div>
                      </div>

                      <div className="applicant-actions">
                        <button
                          type="button"
                          className="btn-status-shortlist"
                          onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                        >
                          ⭐ Shortlist
                        </button>
                        <button
                          type="button"
                          className="btn-status-reject"
                          onClick={() => handleStatusChange(app.id, 'REJECTED')}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setViewingApplicantsJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RecruiterDashboard;
