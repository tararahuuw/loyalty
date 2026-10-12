import RedeemPageService from "../redeemPageService";
import SandezaBillsService from "../sandezaBillsService";
import TransactionService from "../transactionService";
import UserManagementService from "../userManagementService";

// Get All Province
export const GetAllProvince = async () => {
  try {
    const response = await UserManagementService.get("/api/public/province");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All City
export const GetAllCity = async (provinceCode) => {
  try {
    const response = await UserManagementService.get(`/api/public/city/${provinceCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All District
export const GetAllDistrict = async (cityCode) => {
  try {
    const response = await UserManagementService.get(`/api/public/district/${cityCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Postal Code
export const GetAllPostalCode = async (districtCode) => {
  try {
    const response = await UserManagementService.get(`/api/public/postal-code/${districtCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RedeemVoucher = async (body) => {
  try {
    const response = await RedeemPageService.post("/api/redeem", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Redeem V2 APIs
export const GetRedeemDetail = async (redeemId) => {
  try {
    const response = await RedeemPageService.get(`/api/v1/public/redeem`, {
      params: {
        urlParam: redeemId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetGeneratedDetail = async (transactionId) => {
  try {
    const response = await TransactionService.get(`/api/v1/campaign-rewards/generate-detail/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RedeemReward = async (body) => {
  try {
    const response = await TransactionService.post(`/api/v1/campaign-rewards/redeem`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckRedeemStatus = async (refId) => {
  try {
    const response = await TransactionService.get(`/api/v1/campaign-rewards/redeem-status/${refId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAvailableStores = async (params) => {
  try {
    const { productID } = params;
    const response = await SandezaBillsService.get(`/api/v1/catalog/outlet/${productID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
