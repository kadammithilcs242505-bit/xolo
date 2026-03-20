export const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // REPLACE this with your actual Render URL later!
    return 'https://your-render-backend-url.onrender.com/api';
  }
  // Local dev server base URL
  return 'http://localhost:5000/api';
};
