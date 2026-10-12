import MyLoyaltyManagementService from "../myLoyaltyManagementService";

export const GetAllLoyalty = async () => {
  try {
    const response = await MyLoyaltyManagementService.get("/api/v1/my-loyalty");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateLoyalty = async (body) => {
  try {
    const response = await MyLoyaltyManagementService.post("/api/v1/my-loyalty", body, {
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
    const response = await MyLoyaltyManagementService.patch("/api/v1/my-loyalty", body, {
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
    const response = await MyLoyaltyManagementService.post("/api/v1/my-loyalty/check-name-unique", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetLoyaltyByID = async (id) => {
  try {
    const response = await MyLoyaltyManagementService.get(`/api/v1/my-loyalty/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ToggleStatusLoyalty = async (id) => {
  try {
    const response = await MyLoyaltyManagementService.patch(`/api/v1/my-loyalty/deactive/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteLoyalty = async (id) => {
  try {
    const response = await MyLoyaltyManagementService.delete(`/api/v1/my-loyalty/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
