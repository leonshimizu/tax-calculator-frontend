// src/api/axios.js
import axios from 'axios';

// Determine the base URL based on the environment
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000' // Use localhost when in development mode
    : process.env.REACT_APP_API_URL || ''; // Use the environment variable or leave empty for production

const instance = axios.create({
  baseURL: baseURL,
});

// Set JWT token in headers if it exists
const jwt = localStorage.getItem("jwt");
if (jwt) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

// Helper function to refresh the token
async function refreshToken() {
  try {
    const response = await instance.post("/sessions/refresh"); // Adjust the URL as necessary
    const newToken = response.data.jwt;
    localStorage.setItem("jwt", newToken);
    instance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
}

// Axios interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return instance(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        localStorage.removeItem("jwt");
        window.location.href = "/login"; // Redirect to login on token refresh failure
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
