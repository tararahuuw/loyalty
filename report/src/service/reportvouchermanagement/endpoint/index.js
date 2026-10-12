import ReportVoucherManagementService from "../reportVoucherManagementService";

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

export const GetAllReportDetailVoucherWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, currentChip, dataDivision } = params;

    const voucherTypeId = currentChip === "Digital Voucher" ? "1" : "2";
    const body = {
      "voucherTypeId": voucherTypeId,
      "voucherStatus": dataFilter.voucherStatus,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
      "division": dataDivision,
    }

    const response = await ReportVoucherManagementService.post(`/api/report/internal-role/pagination`, body, {
      params: {
        [dataFilterSearch]: dataSearch,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllReportDetailVoucherExternalWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, dataDivision, currentChip } = params;

    const voucherTypeId = currentChip === "Digital Voucher" ? "1" : "2";
    const body = {
      "voucherTypeId": voucherTypeId,
      "voucherStatus": dataFilter.voucherStatus,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
      "division": dataDivision,
    }

    const response = await ReportVoucherManagementService.post(`/api/report/external-role/pagination`, body, {
      params: {
        [dataFilterSearch]: dataSearch,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllReportPartnerVoucherWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, currentChip } = params;

    const voucherTypeId = currentChip === "Digital Voucher" ? "1" : "2";
    const body = {
      "voucherTypeId": voucherTypeId,
      "voucherStatus": dataFilter.voucherStatus,
      "rewardTypeId": currentTab,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await ReportVoucherManagementService.post(`/api/report/merchant-role/pagination`, body, {
      params: {
        [dataFilterSearch]: dataSearch,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadReportMerchant = async (params) => {
  try {
    const { dataFilter, dataFilterSearch, dataSearch, dates, currentChip, currentTab, roleAccess } = params;

    const voucherTypeId = currentChip === "Digital Voucher" ? "1" : "2";
    const body = {
      "voucherTypeId": voucherTypeId,
      "voucherStatus": dataFilter.voucherStatus,
      "campaignType": dataFilter.campaignType,
      "campaignCategory": dataFilter.campaignCategory,
      "redeemType": dataFilter.redeemType,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
      "priceType": dataFilter.priceType
    }

    const endpoint =
      roleAccess === "Client Administrator"
        ? "/api/report/merchant-role/download"
        :
      currentTab === "1"
        ? "/api/report/internal-role/download"
        : "/api/report/merchant-role/download";

    const response = await ReportVoucherManagementService.post(endpoint, body, {
      responseType: "blob",
      params: {
        [dataFilterSearch]: dataSearch
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailReportReward = async (params) => {
  try {
    const { id, roleAccess, page } = params;

    const body = {
      "campaignId": id,
    }

    const response = await ReportVoucherManagementService.post(`/api/v1/report-rewards/${id}`, body, {
      params: {
        page: page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetRewardList = async (params) => {
  try {
    const { roleAccess, id, tab, dataFilter, dataSearch, page, body } = params;

    const response = await ReportVoucherManagementService.post(`/api/v1/report-rewards/rewards/pagination`, body, {
      params: {
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

