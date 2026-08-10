const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function api(path, options = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok && res.status !== 401) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const ROLL_PATTERN = /^[a-z]{2}\d{7}$/i;

export function isValidRoll(roll) {
  return ROLL_PATTERN.test(roll?.trim?.() || '');
}
