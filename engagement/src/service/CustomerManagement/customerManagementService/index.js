import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerManagementService = axios.create({
  baseURL: process.env.REACT_APP_CUSTOMER_URL,
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
  },
});

CustomerManagementService.interceptors.request.use(
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

CustomerManagementService.interceptors.response.use(
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

export default CustomerManagementService;
