import { auth } from '../firebase/firebaseConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Auth Header ──────────────────────────────────────────────
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to use this tool.');

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ─── JSON Helper ──────────────────────────────────────────────
const callBackend = async (endpoint, body) => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/ai/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || 'Backend request failed');
    error.code = data.code;
    throw error;
  }

  return data; // { result, creditsRemaining }
};

// ─── FormData Helper (for file uploads) ───────────────────────
const callBackendWithFile = async (endpoint, formData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to use this tool.');

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE_URL}/api/ai/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // No Content-Type — browser sets multipart boundary
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || 'Backend request failed');
    error.code = data.code;
    throw error;
  }

  return data;
};

// ─── CV Optimizer ─────────────────────────────────────────────
export const generateOptimizedCV = async (cvText, targetRole, targetCountry, cvFile) => {
  // If a file is provided, use FormData
  if (cvFile) {
    const formData = new FormData();
    formData.append('cvFile', cvFile);
    formData.append('cvText', cvText || '');
    formData.append('targetRole', targetRole || '');
    formData.append('targetCountry', targetCountry || '');
    return callBackendWithFile('generate-cv', formData);
  }

  // Otherwise use JSON
  return callBackend('generate-cv', { cvText, targetRole, targetCountry });
};

// ─── LinkedIn Optimizer ───────────────────────────────────────
export const optimizeLinkedInProfile = async (headline, role, careerGoal, targetCountry) => {
  return callBackend('optimize-linkedin', { headline, role, careerGoal, targetCountry });
};

// ─── Skill Gap Analyzer ───────────────────────────────────────
export const analyzeSkillGap = async (currentSkills, targetRole, targetCountry) => {
  return callBackend('skill-gap', { currentSkills, targetRole, targetCountry });
};
