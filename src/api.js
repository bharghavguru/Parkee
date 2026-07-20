/**
 * src/api.js
 * Centralised fetch helpers for the Parkee backend API.
 * Replace the localStorage-based data layer in App.jsx with these functions.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Auth token helpers ────────────────────────────────────────────────────────
export const getToken  = ()       => localStorage.getItem('parkee_token');
export const setToken  = (token)  => localStorage.setItem('parkee_token', token);
export const clearToken = ()      => localStorage.removeItem('parkee_token');

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

// ─── Users ────────────────────────────────────────────────────────────────────

/** Sign up a new user. Returns { user, token }. */
export const signup = (full_name, email, phone, country_code = '+91') =>
  request('/users/signup', { method: 'POST', body: { full_name, email, phone, country_code } });

/** Email-based login (magic-link style). Returns { user, token }. */
export const loginWithEmail = (email) =>
  request('/users/login/email', { method: 'POST', body: { email } });

/** Guest login. Returns { user, token }. */
export const loginAsGuest = () =>
  request('/users/guest', { method: 'POST' });

/** Get the currently logged-in user's profile. */
export const getMe = () =>
  request('/users/me');

/** Update logged-in user's profile. */
export const updateMe = (fields) =>
  request('/users/me', { method: 'PATCH', body: fields });

// ─── OTP ──────────────────────────────────────────────────────────────────────

/** Send OTP to a phone number. Returns { otp } in dev mode. */
export const sendOtp = (phone) =>
  request('/otp/send', { method: 'POST', body: { phone } });

/** Verify OTP code. Returns { user, token } on success. */
export const verifyOtp = (phone, otp_code) =>
  request('/otp/verify', { method: 'POST', body: { phone, otp_code } });

// ─── Spots ────────────────────────────────────────────────────────────────────

/** Get all public/active spots. Optional filters: { status, type, suitable_for } */
export const getSpots = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/spots${params ? `?${params}` : ''}`);
};

/** Get the logged-in host's own spots. */
export const getMySpots = () =>
  request('/spots/mine');

/** Get a single spot with photos and reviews. */
export const getSpot = (id) =>
  request(`/spots/${id}`);

/** Create a new spot listing. */
export const createSpot = (spotData) =>
  request('/spots', { method: 'POST', body: spotData });

/** Update an existing spot. */
export const updateSpot = (id, fields) =>
  request(`/spots/${id}`, { method: 'PATCH', body: fields });

/** Delete a spot. */
export const deleteSpot = (id) =>
  request(`/spots/${id}`, { method: 'DELETE' });

// ─── Bookings ─────────────────────────────────────────────────────────────────

/** Get the logged-in parker's bookings. */
export const getMyBookings = () =>
  request('/bookings/mine');

/** Get bookings on the host's spots. */
export const getHostBookings = () =>
  request('/bookings/host');

/** Create a new booking. */
export const createBooking = (spot_id, booking_date, start_time, end_time) =>
  request('/bookings', { method: 'POST', body: { spot_id, booking_date, start_time, end_time } });

/** Cancel a booking. */
export const cancelBooking = (id) =>
  request(`/bookings/${id}/cancel`, { method: 'PATCH' });

// ─── Reviews ──────────────────────────────────────────────────────────────────

/** Get all reviews for a spot. */
export const getReviews = (spotId) =>
  request(`/reviews/spot/${spotId}`);

/** Post a review for a spot. */
export const postReview = (spot_id, rating, comment, booking_id) =>
  request('/reviews', { method: 'POST', body: { spot_id, rating, comment, booking_id } });

/** Delete a review. */
export const deleteReview = (id) =>
  request(`/reviews/${id}`, { method: 'DELETE' });
