import { auth } from '../firebase/firebaseConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Auth Header ──────────────────────────────────────────────
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in.');

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ════════════════════════════════════════════════════════════════
// HISTORY API
// ════════════════════════════════════════════════════════════════

/**
 * Fetch all AI generations for the current user.
 * @param {number} [limit=50] - Max results to return
 * @returns {{ generations: Array }}
 */
export const getUserGenerations = async (limit = 50) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/history?limit=${limit}`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch history');
  }

  return data.generations;
};

/**
 * Fetch the most recent AI generations (for Dashboard widget).
 * @param {number} [limit=5]
 * @returns {Array}
 */
export const getRecentGenerations = async (limit = 5) => {
  return getUserGenerations(limit);
};

/**
 * Delete a single AI generation by ID.
 * @param {string} id - Firestore document ID
 */
export const deleteGeneration = async (id) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete generation');
  }

  return data;
};
