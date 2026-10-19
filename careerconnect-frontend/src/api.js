/**
 * CareerConnect API Service Module
 * Connects to Spring Boot REST API at http://localhost:8080/api
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  '/api';

const AUTH_STORAGE_KEY = 'careerconnect_auth_user';

// --- Authentication Session Storage Helpers ---

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthHeaders(user = getCurrentUser()) {
  if (!user || !user.email || !user.password) {
    return {};
  }
  const token = btoa(`${user.email}:${user.password}`);
  return {
    Authorization: `Basic ${token}`,
  };
}

// --- Error Helper ---
async function handleResponse(response, defaultErrorMessage) {
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail =
        errorJson.message ||
        errorJson.error ||
        (Array.isArray(errorJson.errors) ? errorJson.errors.join(', ') : '');
    } catch {
      // response wasn't JSON
    }

    if (response.status === 401) {
      throw new Error(errorDetail || 'Invalid credentials or unauthorized access.');
    }
    if (response.status === 403) {
      throw new Error(errorDetail || 'Access denied. You do not have permission for this action.');
    }
    if (response.status === 404) {
      throw new Error(errorDetail || 'Requested resource was not found.');
    }
    throw new Error(errorDetail || `${defaultErrorMessage} (Status: ${response.status})`);
  }

  // If response is 204 No Content
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ==========================================
// 1. PUBLIC JOB ENDPOINTS
// ==========================================

export async function getJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  const data = await handleResponse(response, 'Failed to fetch jobs');
  return Array.isArray(data) ? data : data?.content ?? [];
}

export async function getJobById(id) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
  return handleResponse(response, `Failed to fetch job #${id}`);
}

export async function searchJobs({ keyword = '', location = '', jobType = '', page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (location) params.append('location', location);
  if (jobType) params.append('jobType', jobType);
  params.append('page', page);
  params.append('size', size);

  const response = await fetch(`${API_BASE_URL}/jobs/search?${params.toString()}`);
  const data = await handleResponse(response, 'Failed to search jobs');
  return Array.isArray(data) ? data : data?.content ?? [];
}

// ==========================================
// 2. AUTHENTICATION & REGISTRATION
// ==========================================

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  return handleResponse(response, 'Registration failed');
}

/**
 * Validate credentials against the backend.
 * Checks recruiter or student endpoints with HTTP Basic Auth.
 */
export async function loginUser(email, password, role = 'STUDENT') {
  const cleanEmail = email.trim().toLowerCase();
  const token = btoa(`${cleanEmail}:${password}`);
  const authHeader = { Authorization: `Basic ${token}` };

  // Try authenticating by accessing role-specific endpoints
  if (role === 'RECRUITER') {
    const response = await fetch(`${API_BASE_URL}/jobs/my-jobs`, {
      headers: authHeader,
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }
      if (response.status === 403) {
        throw new Error('Account exists, but does not have RECRUITER permissions.');
      }
      throw new Error(`Authentication check failed (${response.status})`);
    }
  } else {
    // STUDENT check
    const response = await fetch(`${API_BASE_URL}/students/me/applications`, {
      headers: authHeader,
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }
      if (response.status === 403) {
        throw new Error('Account does not have STUDENT permissions.');
      }
      throw new Error(`Authentication check failed (${response.status})`);
    }
  }

  const user = {
    email: cleanEmail,
    password,
    role,
    name: cleanEmail.split('@')[0],
  };

  setCurrentUser(user);
  return user;
}

// ==========================================
// 3. RECRUITER ACTIONS (ROLE_RECRUITER)
// ==========================================

export async function getMyJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs/my-jobs`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response, 'Failed to fetch recruiter jobs');
}

export async function createJob({ title, companyName, location, jobType, description }) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      title: title.trim(),
      companyName: companyName.trim(),
      location: location.trim(),
      jobType: jobType.trim(),
      description: description.trim(),
    }),
  });
  return handleResponse(response, 'Failed to create job posting');
}

export async function updateJob(id, { title, companyName, location, jobType, description }) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      title: title.trim(),
      companyName: companyName.trim(),
      location: location.trim(),
      jobType: jobType.trim(),
      description: description.trim(),
    }),
  });
  return handleResponse(response, `Failed to update job #${id}`);
}

export async function deleteJob(id) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response, `Failed to delete job #${id}`);
}

export async function getRecruiterSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/recruiter/dashboard/summary`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Dashboard summary endpoint failed, computing fallback metrics:', err);
  }

  // Fallback: fetch my jobs and count
  const myJobs = await getMyJobs();
  return {
    totalJobs: myJobs?.length || 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    rejectedApplications: 0,
  };
}

export async function getJobApplicants(jobId) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response, `Failed to fetch applicants for job #${jobId}`);
}

export async function updateApplicationStatus(applicationId, status) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/status?status=${encodeURIComponent(status)}`,
    {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
      },
    }
  );
  return handleResponse(response, `Failed to update status for application #${applicationId}`);
}

// ==========================================
// 4. STUDENT ACTIONS (ROLE_STUDENT)
// ==========================================

export async function applyForJob(jobId) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response, `Failed to submit application for job #${jobId}`);
}

export async function getMyApplications() {
  const response = await fetch(`${API_BASE_URL}/students/me/applications`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response, 'Failed to fetch student applications');
}
