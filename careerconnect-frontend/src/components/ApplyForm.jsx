import { useState } from 'react';
import { applyForJob } from '../api';

function ApplyForm({
  job,
  currentUser,
  onBack,
  onRequireLogin,
  onViewApplications,
}) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    resumeLink: '',
    coverLetter: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [applicationResult, setApplicationResult] = useState(null);

  function validate() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9+\s\-()]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid contact number';
    }

    if (!formData.resumeLink.trim()) {
      newErrors.resumeLink = 'Resume URL or portfolio link is required';
    } else {
      try {
        new URL(formData.resumeLink.trim());
      } catch {
        newErrors.resumeLink = 'Please provide a valid URL (starting with http:// or https://)';
      }
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Please write a brief cover note or summary of your qualifications';
    } else if (formData.coverLetter.trim().length < 20) {
      newErrors.coverLetter = 'Cover letter should be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    if (!currentUser) {
      setApiError(
        'Authentication required: The Spring Boot API requires an authenticated Student account to register your application in the database. Please sign in or register.'
      );
      return;
    }

    if (currentUser.role !== 'STUDENT') {
      setApiError('Only student accounts can apply for job postings.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const result = await applyForJob(job.id);
      setApplicationResult(result);
      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      setApiError(
        err.message || 'Failed to submit application. You might have already applied for this role.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="apply-form-card">
        <div className="success-icon-badge">✓</div>
        <h2>Application Submitted!</h2>
        <p className="auth-description">
          Your application for <strong>{job.title}</strong> at <strong>{job.companyName}</strong> has
          been successfully submitted to the backend system.
        </p>

        {applicationResult?.id && (
          <div className="application-confirmation-box">
            <span>Application ID: #{applicationResult.id}</span>
            <span>Status: {applicationResult.status || 'PENDING'}</span>
          </div>
        )}

        <div className="success-card-actions">
          {onViewApplications && (
            <button
              type="button"
              className="btn-primary"
              onClick={onViewApplications}
            >
              View My Applications
            </button>
          )}
          <button type="button" className="btn-outline" onClick={onBack}>
            ← Back to Job Details
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="apply-form-card">
      <button className="back-btn" onClick={onBack}>
        ← Back to Job Details
      </button>

      <div className="apply-card-header">
        <span className="eyebrow">SUBMIT YOUR APPLICATION</span>
        <h1>Apply for {job.title}</h1>
        <p className="apply-company-sub">
          🏢 {job.companyName} &nbsp;·&nbsp; 📍 {job.location || 'Flexible'} &nbsp;·&nbsp; 🏷️ {job.jobType}
        </p>
      </div>

      {!currentUser && (
        <div className="auth-alert info-alert">
          <div>
            <strong>Sign in recommended:</strong> The backend requires a logged-in Student account
            to link this application to your profile.
          </div>
          <button
            type="button"
            className="btn-primary-sm"
            style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
            onClick={onRequireLogin}
          >
            Sign In / Register
          </button>
        </div>
      )}

      {apiError && (
        <div className="auth-alert error-alert" role="alert">
          <span className="alert-icon">⚠️</span>
          <div style={{ flex: 1 }}>
            <p>{apiError}</p>
            {!currentUser && (
              <button
                type="button"
                className="btn-primary-sm"
                style={{ marginTop: '8px' }}
                onClick={onRequireLogin}
              >
                Sign In Now
              </button>
            )}
          </div>
        </div>
      )}

      <form className="application-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Priyanshu Sharma"
              className={errors.fullName ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="req">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="req">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={errors.phone ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="resumeLink">
              Resume / Portfolio URL <span className="req">*</span>
            </label>
            <input
              id="resumeLink"
              name="resumeLink"
              type="url"
              value={formData.resumeLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/... or linkedin.com/..."
              className={errors.resumeLink ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.resumeLink && <span className="field-error">{errors.resumeLink}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="coverLetter">
            Cover Letter / Summary <span className="req">*</span>
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Tell the hiring manager why you are interested in this position and why you are a great fit..."
            rows={5}
            className={errors.coverLetter ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.coverLetter && <span className="field-error">{errors.coverLetter}</span>}
        </div>

        <div className="form-actions">
          <button
            className="btn-primary-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Application →'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={onBack}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ApplyForm;
