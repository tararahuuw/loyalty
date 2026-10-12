import UserManagementService from "../usermanagementService";
import SettingManagementService from "../settingmanagementService";
import DepositManagementService from "../depositmanagementService";
import MyLoyaltyManagementService from "../myloyaltymanagementService";

// Post Login
export const PostLoginUser = async (request) => {
  try {
    const response = await UserManagementService.post("/api/v1/auth/login", request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post Register
export const PostRegisterUser = async (request) => {
  try {
    const response = await UserManagementService.post("/api/v1/auth/register", request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post Forgot Password
export const PostForgotPasswordUser = async (request) => {
  try {
    const response = await UserManagementService.post("/api/v1/auth/forgot-password", request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post Reset Password
export const PostResetPasswordUser = async (request) => {
  try {
    const response = await UserManagementService.post("/api/v1/auth/reset-password", request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Detail User By ID
export const GetDetailUserByID = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/v1/auth/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get Detail User By ID
export const GetVerifyEmailUser = async (id, code) => {
  try {
    const response = await UserManagementService.get("/api/v1/auth/verify-email", {
      params: {
        id: id,
        code: code,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Change Password
export const ChangePasswordUser = async (request) => {
  try {
    const response = await UserManagementService.patch(`/api/v1/auth/user/change-password`, request);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get All Province
export const GetAllProvince = async () => {
  try {
    const response = await UserManagementService.get("/api/provinces");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All City
export const GetAllCity = async (provinceCode) => {
  try {
    const response = await UserManagementService.get(`/api/cities/${provinceCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All District
export const GetAllDistrict = async (cityCode) => {
  try {
    const response = await UserManagementService.get(`/api/districts/${cityCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Bank
export const GetAllBank = async () => {
  try {
    const response = await UserManagementService.get("/api/bank");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Client Integration
export const GetAllIntegration = async (params) => {
  try {
    const { body } = params;

    const response = await SettingManagementService.post(`/api/client-integration/external-role/pagination`, body, {
      params: {
        page: 1,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Updated Balance
export const GetBalance = async (params) => {
  try {
    const { body } = params;
    const response = await DepositManagementService.post(`/api/deposit/external-role/check-balance`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RefreshToken = async (token) => {
  try {
    const response = await UserManagementService.post("/api/v1/auth/refresh-token", {
      Headers: token,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
