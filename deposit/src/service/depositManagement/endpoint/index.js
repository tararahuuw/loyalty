import DepositManagementService from "../DepositManagementService";
import UserManagementService from "../UserManagementService";

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

export const GetAllDeposit = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await DepositManagementService.post(`/api/deposit/${generateUrl(roleAccess)}/pagination`, body, {
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

export const GetOverallBalance = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await DepositManagementService.post(
      `/api/deposit/${generateUrl(roleAccess)}/overall-balance`,
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

export const CreateDeposit = async (roleAccess, body) => {
  try {
    const response = await DepositManagementService.post(`/api/deposit/${generateUrl(roleAccess)}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadDepositList = async (roleAccess, body, dataFilter, dataSearch) => {
  try {
    const response = await DepositManagementService.post(`/api/deposit/internal-role/download-excel`, body, {
      params: {
        [dataFilter]: dataSearch,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadPaymentReceipt = async (file) => {
  try {
    const response = await DepositManagementService.post(
      `/api/deposit/internal-role/download/${file}`,
      {},
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllClient = async () => {
  try {
    const response = await UserManagementService.get(`/api/client/sys-admin`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDivisionByClientId = async (params) => {
  try {
    const { clientId } = params;
    const response = await UserManagementService.get(`/api/division/all/${clientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
