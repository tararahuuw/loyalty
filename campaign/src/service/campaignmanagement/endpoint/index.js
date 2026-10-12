import CampaignManagementService from "../campaignmanagementService";

const generateUrl = (role) => {
  let url = "internal-role";
  if (
    role === "System Administrator" ||
    role === "Business Support" ||
    role === "Business Administrator" ||
    role === "Ops Administrator" ||
    role === "Rekon"
  ) {
    url = "internal-role";
  } else {
    url = "external-role";
  }

  return url;
};

export const GetAllCampaign = async (params) => {
  try {
    const { roleAccess, tab, dataFilter, dataSearch, page, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}/pagination`, body, {
      params : {
        tab: tab,
        [dataFilter]: dataSearch,
        page: page
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherList = async (params) => {
  try {
    const { roleAccess, id, dataFilter, dataSearch, page, dates, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}/${id}/voucher`, body, {
      params : {
        [dataFilter]: dataSearch,
        page: page,
        startDate: dates?.startDate,
        endDate: dates?.endDate,
        limit : 10
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherGenerated = async (params) => {
  try {
    const { roleAccess, id, dataFilter, dataSearch, page, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}/${id}/generated-voucher`, body, {
      params : {
        [dataFilter]: dataSearch,
        page: page,
        limit : 10
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewCampaign = async (params) => {
  try {
    const { roleAccess, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateDraftCampaign = async (params) => {
  try {
    const { roleAccess, id, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}/cancel`, body, {
      params : {
        id : id
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateCampaign = async (params) => {
  try {
    const { roleAccess, id, body } = params;

    const response = await CampaignManagementService.patch(`/api/order/${generateUrl(roleAccess)}/${id}`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChekcoutCampaign = async (params) => {
  try {
    const { roleAccess, body } = params;

    const response = await CampaignManagementService.post(`/api/order/${generateUrl(roleAccess)}/checkout`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadVoucherGenerated = async (roleAccess, id) => {
  try {
      const response = await CampaignManagementService.get(`/api/order/${generateUrl(roleAccess)}/${id}/generated-voucher/export`);
      return response.data;
  } catch (error) {
      console.error("Error fetching voucher data:", error);
      throw error;
  }
};

export const GetTemplateMessageSandeza = async (params) => {
  try {
      const response = await CampaignManagementService.get(`/api/distribution-template?channel=${params}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching template sandeza:", error);
      throw error;
  }
};

export const GetCartOrder = async (params) => {
  const { roleAccess, id } = params
  try {
      const response = await CampaignManagementService.get(`/api/order/${generateUrl(roleAccess)}/${id}/cart`);
      return response.data;
  } catch (error) {
      console.error("Error :", error);
      throw error;
  }
};

export const GetDetailEditOrder = async (params) => {
  const { roleAccess, id } = params
  try {
      const response = await CampaignManagementService.get(`/api/order/${generateUrl(roleAccess)}/${id}/edit`);
      return response.data;
  } catch (error) {
      console.error("Error :", error);
      throw error;
  }
};

export const GetCampaignById = async (params) => {
  try {
    const { roleAccess, id } = params;
    const response = await CampaignManagementService.get(`/api/order/${generateUrl(roleAccess)}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCampaign = async (id, roleAccess) => {
  try {
    const response = await CampaignManagementService.delete(`/api/order/${generateUrl(roleAccess)}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};