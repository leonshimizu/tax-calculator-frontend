// src/api/axios.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000;' // Default to localhost if no env variable is set
console.log('Using API URL:', axios.defaults.baseURL);
console.log(`baseURL: ${baseURL}`)

const instance = axios.create({
  baseURL: baseURL
});

export default instance;