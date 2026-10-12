import VoucherManagementService from "../../VoucherManagementService";
import UserManagementService from "../../UserManagementService";

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

export const GetAllTemplate = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await VoucherManagementService.post(
      `/api/voucher-template/${generateUrl(roleAccess)}/pagination`,
      body,
      {
        params: {
          [dataFilter]: dataSearch,
          page: page,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTemplateById = async (params) => {
  try {
    const { roleAccess, templateId } = params;

    const response = await VoucherManagementService.get(
      `/api/voucher-template/${generateUrl(roleAccess)}/${templateId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateTemplate = async (role, body) => {
  try {
    const response = await VoucherManagementService.post(`/api/voucher-template/${generateUrl(role)}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditTemplate = async (role, body) => {
  try {
    const response = await VoucherManagementService.patch(`/api/voucher-template/${generateUrl(role)}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteTemplate = async (id) => {
  try {
    const response = await VoucherManagementService.delete(`/api/voucher-template/internal-role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetClientById = async (params) => {
  try {
    const { roleAccess, clientId } = params;

    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Ops Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Business Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Business Support") {
      url = "sys-admin";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.get(`/api/client/${url}/${clientId}`);
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
