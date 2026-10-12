import ProductManagementService from "../productService";
import StoreManagementService from "../storeService";

export const GetAllProvinceStore = async () => {
  try {
    const response = await StoreManagementService.post("/api/v1/stores/provinces", null);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostAllCityStore = async (provinceCode) => {
  try {
    const response = await StoreManagementService.post(`/api/v1/stores/cities`, provinceCode);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostAllDistrictStores = async (cityCode) => {
  try {
    const response = await StoreManagementService.post(`/api/v1/stores/districts`, cityCode);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllStores = async (body) => {
  try {
    const response = await StoreManagementService.post("/api/v1/stores/list", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllProducts = async () => {
  try {
    const response = await ProductManagementService.post("/api/v1/products/list", {
      status: [],
    });
    return response;
  } catch (error) {
    throw error;
  }
};
