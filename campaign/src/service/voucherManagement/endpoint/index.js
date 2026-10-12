import VoucherManagementService from "../VoucherManagementService";

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

export const GetAllVoucher = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, dates, startDateCampaign, divisionId, body } = params;

    const response = await VoucherManagementService.post(`/api/voucher`, body, {
      params: {
        [dataFilter]: dataSearch,
        startDateCampaign: startDateCampaign,
        startDate: dates?.startDate,
        endDate: dates?.endDate,
        divisionId: divisionId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherType = async (params) => {
  try {
    const { roleAccess } = params;

    const response = await VoucherManagementService.get(`/api/voucher-type/${generateUrl(roleAccess)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherTemplate = async (params) => {
  try {
    const { roleAccess, clientId, divisionId } = params;

    const response = await VoucherManagementService.get(`/api/voucher-template/${generateUrl(roleAccess)}`, {
      params: {
        "client-id": clientId,
        "division-id": divisionId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Voucher v2 apis
export const GetAllVoucherNoPagination = async (params) => {
  try {
    const { companyId, dataSearch, startDate, endDate, page, body } = params;

    const response = await VoucherManagementService.post("/api/v1/catalog/list", body, {
      params: {
        name: dataSearch,
        companyId,
        page,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherCategory = async (params) => {
  try {
    const { voucherTypeCode } = params;

    const response = await VoucherManagementService.post("/api/v1/catalog/categories", {
      type: voucherTypeCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Voucher API v2
export const GetVoucherList = async (params) => {
  const { companyId, isCampaign } = params;
  try {
    const response = await VoucherManagementService.post(
      "/api/v1/vouchers/list",
      {},
      {
        params: {
          companyId,
          isCampaign,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckoutVouchers = async (body) => {
  try {
    const response = await VoucherManagementService.post("/api/v1/vouchers/checkout", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckVoucherStatus = async (transactionId) => {
  try {
    const response = await VoucherManagementService.get(`/api/v1/vouchers/status/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
