// src/api/axios.js
import axios from 'axios';

const baseURL = 'http://localhost:3000'; // Default to localhost if no env variable is set

const instance = axios.create({
  baseURL: baseURL
});

export default instance;