import axios from 'axios';

const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Check if we are running locally on localhost or a local network IP
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocalHost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' || 
                      hostname.startsWith('192.168.') || 
                      hostname.startsWith('10.') || 
                      hostname.startsWith('172.');
                      
  // If we are running locally, we want the API to point to our local port 5000 backend
  if (isLocalHost) {
    return `http://${hostname}:5000/api`;
  }
  
  return envUrl || "https://e-commerce-platform-5.onrender.com/api";
};

const API_URL = getBaseApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Access token stored in-memory for security
let accessTokenInMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
  if (token) {
    localStorage.setItem('hasSession', 'true');
  } else {
    localStorage.removeItem('hasSession');
  }
};

export const getAccessToken = () => accessTokenInMemory;

// Request Interceptor: Attach bearer access token
api.interceptors.request.use(
  (config) => {
    if (accessTokenInMemory) {
      config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh on 401
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the error code is specifically TOKEN_EXPIRED, try refreshing
      if (error.response.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call the refresh endpoint to obtain a new access token via HTTP-only cookie
          const res = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          if (res.data.success && res.data.accessToken) {
            const newToken = res.data.accessToken;
            setAccessToken(newToken);
            processQueue(null, newToken);
            isRefreshing = false;
            
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          setAccessToken(null);
          
          // Clear session status
          localStorage.removeItem('hasSession');
          
          // Force page reload/redirect to login if session expires
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
