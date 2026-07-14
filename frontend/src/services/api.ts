import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the auth token is invalid or the user record no longer exists, clear stored auth and redirect.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const isAuthError = status === 401 || (status === 404 && url.includes('/users/profile'));

    if (isAuthError) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('hasAccount');
      window.location.href = '/signup';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
