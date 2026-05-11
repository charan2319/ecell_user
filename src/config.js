export const API_BASE = import.meta.env.MODE === 'production' 
  ? '/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://3.111.186.227:5001/api');
// Using the real Client ID provided by user
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '947215889857-c4o32cqdhv3c7kufta5b1q7jdnv3u9pj.apps.googleusercontent.com';
