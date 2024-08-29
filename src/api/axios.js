// src/api/axios.js
import axios from 'axios';

// Determine the base URL based on the environment
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000' // Use localhost when in development mode
    : process.env.REACT_APP_API_URL || ''; // Use the environment variable or leave empty for production

const instance = axios.create({
  baseURL: baseURL
});

// Set JWT token in headers if it exists
const jwt = localStorage.getItem("jwt");
if (jwt) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export default instance;
