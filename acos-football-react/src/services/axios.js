import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // ton backend
  withCredentials: true,            // pour Sanctum
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

export default api;
