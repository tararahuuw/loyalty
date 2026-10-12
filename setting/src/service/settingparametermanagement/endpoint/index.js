import SettingParameterManagementService from "../SettingParameterManagementService";

export const GetAllParameter = async (params) => {
  try {
    const { companyId, dataFilter, dataSearch, page } = params;

    const response = await SettingParameterManagementService.get("/api/v1/setting-parameter", {
      params: {
        companyId: companyId,
        [dataFilter]: dataSearch,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailParameter = async (id) => {
  try {
    const response = await SettingParameterManagementService.get(`/api/v1/setting-parameter/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewParameter = async (body) => {
  try {
    const response = await SettingParameterManagementService.post(`/api/v1/setting-parameter`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateParameter = async (body) => {
  try {
    const response = await SettingParameterManagementService.patch("/api/v1/setting-parameter", body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteParameter = async (id) => {
  try {
    const response = await SettingParameterManagementService.delete(`/api/v1/setting-parameter/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteOption = async (id) => {
  try {
    const response = await SettingParameterManagementService.delete(`/api/v1/setting-parameter/${id}/delete-option`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailParameterInformation = async (params) => {
  try {
    const { roleAccess, id, tab, dataFilter, dataSearch, page, body } = params;

    const response = await SettingParameterManagementService.get(`/api/v1/client-admin/setting-parameter/${id}`, body, {
      params: {
        tab: tab,
        [dataFilter]: dataSearch,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailParameterClient = async (params) => {
  try {
    const { roleAccess, id, tab, dataFilter, dataSearch, page, body } = params;

    const response = await SettingParameterManagementService.post(
      `/api/v1/client-admin/setting-parameter/${id}`,
      body,
      {
        params: {
          tab: tab,
          [dataFilter]: dataSearch,
          page: page,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewParameterInformation = async (params) => {
  try {
    const { roleAccess, body } = params;

    const url =
      roleAccess === "System Administrator"
        ? "/api/v1/system-admin/setting-parameter"
        : "/api/v1/client-admin/setting-parameter";

    const response = await SettingParameterManagementService.post(url, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateParameterInformation = async (params) => {
  try {
    const { roleAccess, id, body } = params;

    const response = await SettingParameterManagementService.patch(`/api/v1/client-admin/setting-parameter`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteParameterInformation = async (id, roleAccess) => {
  try {
    const url =
      roleAccess === "System Administrator"
        ? `/api/v1/system-admin/setting-parameter/detail/${id}`
        : `/api/v1/client-admin/setting-parameter/${id}`;

    const response = await SettingParameterManagementService.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDashboardParameterClient = async (params) => {
  try {
    const { roleAccess, tab, dataFilter, dataSearch, page, body } = params;

    const response = await SettingParameterManagementService.post(`/api/v1/client-admin/setting-parameter`, body, {
      params: {
        tab: tab,
        [dataFilter]: dataSearch,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadParameters = async (params) => {
  try {
    const { companyId, dataFilter, dataSearch } = params;

    const response = await SettingParameterManagementService.post("/api/v1/setting-parameter/download", null, {
      params: {
        companyId: companyId,
        [dataFilter]: dataSearch,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
