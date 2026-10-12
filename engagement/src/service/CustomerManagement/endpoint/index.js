import CustomerManagementService from "../customerManagementService";

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

export const DeleteCustomer = async (id) => {
  try {
    let response;
    response = await CustomerManagementService.delete(`/api/v1/customer/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SuspendCustomer = async (id, body) => {
  try {
    let response;
    response = await CustomerManagementService.patch(`/api/v1/customer/change-status/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateCustomer = async (body) => {
  try {
    let response;
    response = await CustomerManagementService.post(`/api/v1/customer`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditCustomer = async (id, body) => {
  try {
    const response = await CustomerManagementService.patch(`/api/v1/customer/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadCustomers = async (params) => {
  try {
    const { filter } = params;

    const bodyReq = {
      ...filter,
    };

    const response = await CustomerManagementService.post(`/api/v1/customer/download`, bodyReq, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCustomer = async (params) => {
  try {
    const { clientId, dataFilter, dataSearch, dates, page } = params;

    const response = await CustomerManagementService.post(
      `/api/v1/customer-360/pagination/dashboard`,
      {},
      {
        params: {
          clientId: clientId,
          [dataFilter]: dataSearch,
          startDate: dates?.startDate,
          endDate: dates?.endDate,
          page: page,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCustomers = async (params) => {
  try {
    const { filter, page } = params;

    const bodyReq = {
      ...filter,
      page: page,
    };

    const response = await CustomerManagementService.post(`/api/v1/customer/pagination`, bodyReq);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllTransactions = async (params) => {
  try {
    const { filters, page, campaignId, startDate, endDate } = params;

    const bodyReq = {
      campaignId: campaignId,
      filters: filters,
      startDate: startDate ? startDate : "",
      endDate: startDate && endDate ? endDate : "",
      page: page,
    };

    const response = await CustomerManagementService.post(`/api/v1/transactions/pagination`, bodyReq);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadTransactions = async (params) => {
  try {
    const { filters, campaignId, startDate, endDate } = params;

    const bodyReq = {
      campaignId: campaignId,
      filters: filters,
      startDate: startDate ? startDate : "",
      endDate: startDate && endDate ? endDate : "",
    };

    const response = await CustomerManagementService.post(`/api/v1/transactions/download`, bodyReq, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetLatestTransactionsCampaign = async () => {
  try {
    const response = await CustomerManagementService.get(`/api/v1/transactions/upload-latest`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetLatestPointCampaign = async () => {
  try {
    const response = await CustomerManagementService.get(`/api/v1/points/upload-latest`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllPoints = async (params) => {
  try {
    const { filters, page, campaignId, startDate, endDate } = params;

    const bodyReq = {
      campaignId: campaignId,
      filters: filters,
      startDate: startDate ? startDate : "",
      endDate: startDate && endDate ? endDate : "",
      page: page,
    };

    const response = await CustomerManagementService.post(`/api/v1/points/pagination`, bodyReq);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadPoints = async (params) => {
  try {
    const { filters, campaignId, startDate, endDate } = params;

    const bodyReq = {
      campaignId: campaignId,
      filters: filters,
      startDate: startDate ? startDate : "",
      endDate: startDate && endDate ? endDate : "",
    };

    const response = await CustomerManagementService.post(`/api/v1/points/download`, bodyReq, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDetailGenerated = async (params) => {
  try {
    const { id, dataFilter, dataSearch, dates, page } = params;

    const response = await CustomerManagementService.post(
      `/api/v1/customer-360/pagination/generated-point/${id}`,
      {},
      {
        params: {
          [dataFilter]: dataSearch,
          startDate: dates?.startDate,
          endDate: dates?.endDate,
          page: page,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDetailRedeemed = async (params) => {
  try {
    const { id, dataFilter, dataSearch, dates, page } = params;

    const response = await CustomerManagementService.post(
      `/api/v1/customer-360/pagination/redeemed-point/${id}`,
      {},
      {
        params: {
          [dataFilter]: dataSearch,
          startDate: dates?.startDate,
          endDate: dates?.endDate,
          page: page,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCustomerById = async (params) => {
  try {
    const { roleAccess, id } = params;
    const response = await CustomerManagementService.get(`/api/v1/customer-360/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCustomerConfiguration = async () => {
  try {
    const response = await CustomerManagementService.get(`/api/v1/customer/configuration`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeCustomerConfiguration = async (body) => {
  try {
    const response = await CustomerManagementService.patch(`/api/v1/customer/configuration`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidateCustomers = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/customer/validate`, body, {
      headers: {
        // Prefer: "status=400",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadCustomerFailed = async (req) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/customer/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadTemplate = async (req) => {
  try {
    const bodyReq = {
      campaignId: req.campaignId,
      fileType: req.fileType,
    };
    const response = await CustomerManagementService.post(`/api/v1/transactions/download-template`, bodyReq, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateCustomerBulk = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/customer/bulk`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidateTransactions = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/transactions/validate`, body, {
      headers: {
        // Prefer: "status=400",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadTransactionFailed = async (req) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/transactions/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateTransactionBulk = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/transactions/bulk`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePoints = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/points/validate`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadPointFailed = async (req) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/points/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreatePointBulk = async (body) => {
  try {
    const response = await CustomerManagementService.post(`/api/v1/points/bulk`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
