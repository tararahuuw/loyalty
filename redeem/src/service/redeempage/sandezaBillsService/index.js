import axios from "axios";

const SandezaBillsService = axios.create({
  baseURL: process.env.REACT_APP_SANDEZA_BILLS_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

SandezaBillsService.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default SandezaBillsService;
