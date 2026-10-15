
import { useState } from 'react';

function ApplyForm({ job, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeLink: '',
    coverLetter: '',
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Frontend demonstration only.
    // No application is saved to the backend yet.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="apply-form-card">
        <h2>Application form completed!</h2>
        <p>
          Your form has been completed for {job.title}.
          Applications will be saved when backend integration is added.
        </p>

        <button className="back-btn" onClick={onBack}>
          ← Back to job details
        </button>
      </section>
    );
  }

  return (
    <section className="apply-form-card">
      <button className="back-btn" onClick={onBack}>
        ← Back to job details
      </button>

      <h1>Apply for {job.title}</h1>
      <p className="section-description">
        {job.companyName} · {job.location}
      </p>

      <form className="application-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />

        <label htmlFor="resumeLink">Resume link</label>
        <input
          id="resumeLink"
          name="resumeLink"
          type="url"
          value={formData.resumeLink}
          onChange={handleChange}
          placeholder="https://..."
          required
        />

        <label htmlFor="coverLetter">Cover letter</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          placeholder="Tell the recruiter why you're a good fit"
          rows={5}
          required
        />

        <button className="apply-btn" type="submit">
          Submit application
        </button>
      </form>
    </section>
  );
}

export default ApplyForm;
