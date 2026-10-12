import ProgramManagementService from "../programManagementService";

export const GetAllLoyalty = async () => {
  try {
    const response = await ProgramManagementService.get("/api/v1/program");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCurrentPWA = async (companyId) => {
  try {
    const response = await ProgramManagementService.get(`/api/v1/program`, {
      params: { companyId },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const CreateLoyalty = async (body) => {
  try {
    const response = await ProgramManagementService.post("/api/v1/program", body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditLoyalty = async (body) => {
  try {
    const response = await ProgramManagementService.patch("/api/v1/program", body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckProjectValidity = async (body) => {
  try {
    const response = await ProgramManagementService.post("/api/v1/program/check-name-unique", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetLoyaltyByID = async (id) => {
  try {
    const response = await ProgramManagementService.get(`/api/v1/program/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ToggleStatusLoyalty = async (id) => {
  try {
    const response = await ProgramManagementService.patch(`/api/v1/program/deactive/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteLoyalty = async (id) => {
  try {
    const response = await ProgramManagementService.delete(`/api/v1/program/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
