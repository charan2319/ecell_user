export const API_BASE = import.meta.env.MODE === 'production' 
  ? '/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://3.111.186.227:5001/api');
// Client ID must be set via VITE_GOOGLE_CLIENT_ID in .env — never hardcode this value
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
