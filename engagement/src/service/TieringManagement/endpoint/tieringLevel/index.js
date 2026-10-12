import TieringManagementService from "../../tieringManagementService";
import UsermanagementService from "../../userManagementService";

export const GetAllTierLevels = async (params) => {
  try {
    const { dataFilter, dataSearch, page, body } = params;

    const response = await TieringManagementService.post(`/api/v1/tier-level/pagination`, body, {
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

export const GetAllTierLevel = async (params) => {
  try {
    const { dataFilter, dataSearch } = params;

    const response = await TieringManagementService.get(`/api/v1/tiers`, {
      params: {
        [dataFilter]: dataSearch,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTierConfig = async () => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tier-configuration`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewTieringLevel = async (body) => {
  try {
    const response = await TieringManagementService.post(`/api/v1/tiers`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewCriteria = async (body) => {
  try {
    const response = await TieringManagementService.post(`/api/v1/criteria`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateTierLevelFormData = async (loyaltyId, body) => {
  try {
    const response = await TieringManagementService.post(`/api/v1/tiers/${loyaltyId}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateIconTier = async (body) => {
  try {
    const response = await TieringManagementService.post(`/api/v1/icons`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateTierLevelFormData = async (loyaltyId, id, body) => {
  try {
    const response = await TieringManagementService.patch(`/api/v1/tiers/${loyaltyId}/tier/${id}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeStatusTierLevel = async (id, body) => {
  try {
    const response = await TieringManagementService.patch(`/api/v1/change-status-tier/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeTierConfiguration = async (body) => {
  try {
    const response = await TieringManagementService.patch(`/api/v1/tier-configuration`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditTieringLevel = async (body) => {
  try {
    const response = await TieringManagementService.patch(`/api/v1/tiers`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateTierSetting = async (loyaltyId, body) => {
  try {
    const response = await TieringManagementService.patch(`/api/v1/tiers/${loyaltyId}/setting`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTierLevelById = async (id) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tier-level/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCriteria = async () => {
  try {
    const response = await TieringManagementService.get(`/api/v1/criteria`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailTierLevel = async (id) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tiers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTierLevel = async (id) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tiers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllIconsTierLevel = async () => {
  try {
    const response = await TieringManagementService.get(`/api/v1/icons`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetSettingTierLevel = async (id) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tiers/${id}/setting`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteTierLevel = async (id) => {
  try {
    const response = await TieringManagementService.delete(`/api/v1/tiers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDivisionLevel = async (divisionId) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tier-level/check-level/${divisionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetLevelIcon = async (level) => {
  try {
    const response = await TieringManagementService.get(`/api/v1/tier-level/icon/level/${level}`);
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
