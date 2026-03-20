export const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Determine the base URL dynamically in production to avoid CORS and fixed HTTP/HTTPS schema.
    return '/api';
  }
  // Local dev server base URL
  return 'http://localhost:5000/api';
};
