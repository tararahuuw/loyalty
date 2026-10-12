import SettingManagementService from "../settingmanagementService";
import UserManagementService from "../../usermanagement/usermanagementService";

const generateUrl = (role) => {
  let url = "internal-role";
  if (
    role === "System Administrator" ||
    role === "Business Support" ||
    role === "Business Administrator" ||
    role === "Ops Administrator" ||
    role === "Reconcile"
  ) {
    url = "internal-role";
  } else {
    url = "external-role";
  }

  return url;
};

export const GetAllIntegration = async (params) => {
  try {
    const { roleAccess, page, body } = params;

    const response = await SettingManagementService.post(
      `/api/client-integration/${generateUrl(roleAccess)}/pagination`,
      body,
      {
        params: {
          page: page,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetIntegrationById = async (params) => {
  try {
    const { roleAccess, integrationId } = params;
    const response = await SettingManagementService.get(
      `/api/client-integration/${generateUrl(roleAccess)}/${integrationId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteIntegration = async (id) => {
  try {
    const response = await SettingManagementService.delete(`/api/client-integration/${generateUrl(roleAccess)}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditIntegration = async (role, body) => {
  try {
    const response = await SettingManagementService.patch(`/api/client-integration/${generateUrl(role)}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApproveIpAddress = async (role, body) => {
  try {
    const response = await SettingManagementService.post(
      `/api/client-whitelist-ip/${generateUrl(role)}/approval`,
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllClient = async (params) => {
  try {
    const { roleAccess } = params;
    const response = await SettingManagementService.post(`/api/client-integration/${generateUrl(roleAccess)}/clients`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDivisionByClientId = async (parameter) => {
  try {
    const { roleAccess, clientId } = parameter;
    const response = await SettingManagementService.post(
      `/api/client-integration/${generateUrl(roleAccess)}/divisions`,
      {},
      {
        params: {
          clientId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetClientById = async (params) => {
  try {
    const { clientId } = params;
    const response = await UserManagementService.get(`/api/client/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDivisionById = async (params) => {
  try {
    const { divisionId } = params;
    const response = await UserManagementService.get(`/api/division/${divisionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetClientByName = async (parameter) => {
  try {
    const { roleAccess, clientName } = parameter;
    const response = await UserManagementService.get(`/api/client/${generateUrl(roleAccess)}/search`, {
      params: {
        "client-name": clientName,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDivisionByName = async (parameter) => {
  try {
    const { roleAccess, divisionName } = parameter;
    const response = await UserManagementService.get(`/api/division/${generateUrl(roleAccess)}/search`, {
      params: {
        "division-name": divisionName,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// LOYALTY V2 END POINTS
export const GetAllIpAddress = async (params) => {
  try {
    const { page } = params;

    const response = await SettingManagementService.get("/api/v1/ip-whitelist/pagination", {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewIpAddress = async (body) => {
  try {
    const response = await SettingManagementService.post("/api/v1/ip-whitelist", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteIpAddress = async (id) => {
  try {
    const response = await SettingManagementService.delete(`/api/v1/ip-whitelist/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllURLCallback = async (companyId) => {
  try {
    const response = await SettingManagementService.get(`/api/v1/url-callbacks/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditURLCallback = async (companyId, body) => {
  try {
    const response = await SettingManagementService.patch(`/api/v1/url-callbacks/${companyId}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
