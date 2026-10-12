import axios from "axios";

const MyLoyaltyManagementService = axios.create({
  baseURL: process.env.REACT_APP_MY_LOYALTY_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

MyLoyaltyManagementService.interceptors.request.use(
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

export default MyLoyaltyManagementService;
