import StoreManagementService from "../../storeManagementService";
import UsermanagementService from "../../userManagementService";

const generateUrl = (role) => {
  let url = "system-admin";
  if (role === "System Administrator") {
    url = "system-admin";
  } else {
    url = "client-admin";
  }

  return url;
};

export const GetAllSummaries = async (params) => {
  try {
    const { dataFilter, dataSearch, page } = params;

    const response = await StoreManagementService.get(`/api/v1/store-summaries/pagination`, {
      params: {
        [dataFilter]: dataSearch,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetStoreSummaryById = async (id) => {
  try {
    const response = await StoreManagementService.get(`/api/v1/store-summaries/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllSandezaBillsMerchants = async () => {
  try {
    const response = await StoreManagementService.get(`/api/v1/sandeza-bills/merchants`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllMerchantOutlets = async (params) => {
  try {
    const { merchantId } = params;
    const response = await StoreManagementService.get(`api/v1/sandeza-bills/merchants/${merchantId}/outlets`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateStore = async (roleAccess, body) => {
  try {
    let response;
    response = await StoreManagementService.post(`/api/v1/stores`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GenerateStore = async (body) => {
  try {
    let response;
    response = await StoreManagementService.post(`/api/v1/stores/code`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditStore = async (roleAccess, id, body) => {
  try {
    const response = await StoreManagementService.patch(`/api/v1/stores/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteStore = async (roleAccess, id) => {
  try {
    let response;
    response = await StoreManagementService.delete(`/api/v1/stores/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidateStore = async (body) => {
  try {
    const response = await StoreManagementService.post(`/api/v1/stores/validate`, body, {
      headers: {
        // Prefer: "status=400",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllStores = async (params) => {
  try {
    const { dataFilter, dataSearch, page, body } = params;

    const response = await StoreManagementService.post(`/api/v1/stores/pagination`, body, {
      params: {
        [dataFilter]: dataSearch,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadStores = async (params) => {
  try {
    const { dataFilter, dataSearch, page, body } = params;

    const response = await StoreManagementService.post(`/api/v1/stores/download`, body, {
      params: {
        [dataFilter]: dataSearch,
        page: page,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetStoreById = async (req) => {
  try {
    const response = await StoreManagementService.get(`/api/v1/stores/${req.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateStoreBulk = async (req) => {
  try {
    const response = await StoreManagementService.post(`/api/v1/stores/${req.id}`, req.body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadStoreFailed = async (req) => {
  try {
    const response = await StoreManagementService.post(`/api/v1/stores/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllClient = async () => {
  try {
    const response = await UsermanagementService.get(`/api/client/sys-admin`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDivisionByClientId = async (clientId) => {
  try {
    const response = await UsermanagementService.get(`/api/division/all/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllProvince = async () => {
  try {
    const response = await UsermanagementService.get("/api/v1/provinces");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllProvinceStore = async () => {
  try {
    const response = await StoreManagementService.post("/api/v1/stores/provinces", null);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All City
export const GetAllCity = async (provinceCode) => {
  try {
    // nanti bisa ngirim query params city name keynya = name
    const response = await UsermanagementService.get(`/api/v1/cities?provinceCode=${provinceCode || 0}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostAllCity = async (provinceCode) => {
  try {
    const response = await UsermanagementService.post(`/api/v1/cities`, provinceCode);
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

export const GetAllDistrict = async (cityCode) => {
  try {
    const response = await UsermanagementService.get(`/api/v1/districts?regencyCode=${cityCode || 0}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostAllDistrict = async (cityCode) => {
  try {
    const response = await UsermanagementService.post(`/api/v1/districts`, cityCode);
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
