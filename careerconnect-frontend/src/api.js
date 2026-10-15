
const API_BASE_URL = 'http://localhost:8080/api';

export async function getJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`);
  }

 const data = await response.json();

  // Supports either a plain list or Spring Data Page response.
  return Array.isArray(data) ? data : data.content ?? [];
}
