export const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Determine the base URL dynamically in production to point to Render
    return 'https://xolo-t5uo.onrender.com/api';
  }
  // Local dev server base URL
  return 'http://localhost:5000/api';
};
