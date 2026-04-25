import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function sendAssessment(payload) {
  const response = await axios.post(`${API_BASE}/api/assessment`, payload);
  return response.data;
}

export async function sendChatMessage(payload) {
  const response = await axios.post(`${API_BASE}/api/chat`, payload);
  return response.data;
}

export async function getAssessmentHistory(uid) {
  const response = await axios.get(`${API_BASE}/api/assessment`, { params: { uid } });
  return response.data;
}

// Gamification endpoints
export async function getUserStats(uid) {
  const response = await axios.get(`${API_BASE}/api/gamification/stats`, { params: { uid } });
  return response.data;
}

export async function getTodayChallenge(uid) {
  const response = await axios.get(`${API_BASE}/api/gamification/challenge`, { params: { uid } });
  return response.data;
}

export async function completeChallenge(uid) {
  const response = await axios.post(`${API_BASE}/api/gamification/challenge/complete`, { uid });
  return response.data;
}

export async function getBadges(uid) {
  const response = await axios.get(`${API_BASE}/api/gamification/badges`, { params: { uid } });
  return response.data;
}

export async function saveUserProfile(uid, profile) {
  const response = await axios.post(`${API_BASE}/api/user/profile`, { uid, ...profile });
  return response.data;
}

export async function getUserProfile(uid) {
  const response = await axios.get(`${API_BASE}/api/user/profile`, { params: { uid } });
  return response.data;
}
