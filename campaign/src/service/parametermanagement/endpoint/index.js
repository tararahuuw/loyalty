import ParameterManagementService from "../parameterService";

export const GetAllParameter = async (companyId) => {
  try {
    const response = await ParameterManagementService.get("/api/v1/setting-parameter/list", {
      params: {
        companyId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllParameterById = async (params) => {
  try {
    const { clientId } = params;

    const response = await ParameterManagementService.get(`/api/v1/system-admin/setting-parameter`, {
      params: {
        clientId: clientId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewParameter = async (body) => {
  try {
    const response = await ParameterManagementService.post(`/api/v1/setting-parameter`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
