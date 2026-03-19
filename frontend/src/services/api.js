import axios from 'axios';
const api = axios.create({
  baseURL: 'https://mindtrace-94bp.onrender.com/api',
  withCredentials: true   // if you already had this
});

export default api