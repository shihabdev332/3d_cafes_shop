import axios from 'axios';

const API = axios.create({
  // Base URL fetched from Vite environment variables
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;