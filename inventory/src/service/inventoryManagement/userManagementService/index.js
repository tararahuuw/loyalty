import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsermanagementService = axios.create({
  baseURL: process.env.REACT_APP_USER_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

UsermanagementService.interceptors.request.use(
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

UsermanagementService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.data.code === 401) {
      const navigateTo = useNavigate();
      navigateTo("/");
    }
    return Promise.reject(error);
  }
);

export default UsermanagementService;
