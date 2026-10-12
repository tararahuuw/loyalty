import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserManagementService = axios.create({
  baseURL: process.env.REACT_APP_API_PRODUCT_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

UserManagementService.interceptors.request.use(
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

UserManagementService.interceptors.response.use(
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

export default UserManagementService;
