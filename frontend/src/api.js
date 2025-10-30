// api.js
const API_BASE = process.env.REACT_APP_API_URL || 'https://test-2-ccf0.onrender.com/api/attendance';

async function request(path = '', options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null; // no content

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');

  return data;
}

export default {
  get: (path = '') => request(path, { method: 'GET' }),
  post: (path = '', body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path = '') => request(path, { method: 'DELETE' }),
};
