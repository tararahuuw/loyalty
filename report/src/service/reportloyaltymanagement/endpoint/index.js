import reportLoyaltyManagementService from "../reportLoyaltyManagementService";

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

export const GetAllReportLoyaltySummaryWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, currentChip } = params;

    const body = {
      "campaignStatus": dataFilter.campaignStatus,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/summary/pagination`, body, {
      params : {
        [dataFilterSearch] : dataSearch,
        page:page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllReportLoyaltyDetailPointWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, currentChip } = params;

    const loyaltyTypeId = currentChip === "Point" ? "1" : "2";

    const body = {
      "loyaltyTypeId": loyaltyTypeId,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/detail/pagination`, body, {
      params : {
        [dataFilterSearch] : dataSearch,
        page:page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllReportLoyaltyDetailRewardWithPagination = async (params) => {
  try {
    const { roleAccess, page, dataFilter, dataFilterSearch, dataSearch, dates, currentTab, currentChip } = params;

    const loyaltyTypeId = currentChip === "Point" ? "1" : "2";

    const body = {
      "loyaltyTypeId": loyaltyTypeId,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/detail/reward/pagination`, body, {
      params : {
        [dataFilterSearch] : dataSearch,
        page:page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailReportPoint = async (params) => {
  try {
    const { id, date, roleAccess, page } = params;

    const body = {
      date: date,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/detail/${id}`, body, {
      params : {
        page:page
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadReportLoyaltyDetailPoint = async (params) => {
  try {
    const { id, roleAccess, page, dataFilter, dataSearch, dates, currentTab, dataFilterSearch } = params;

    const body = {
      "pointTypeId": currentTab,
      "campaignStatus": dataFilter.campaignStatus,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/detail/download`, body, {
      responseType: "blob",
      params : {
        [dataFilterSearch] : dataSearch
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadReportLoyaltyDetailReward = async (params) => {
  try {
    const { id, roleAccess, page, dataFilter, dataSearch, dates, currentTab, dataFilterSearch } = params;

    const body = {
      "pointTypeId": currentTab,
      "campaignStatus": dataFilter.campaignStatus,
      "startDate": dates?.startDate,
      "endDate": dates?.endDate,
    }

    const response = await reportLoyaltyManagementService.post(`/api/v1/loyalty/report-point/detail/reward/download`, body, {
      responseType: "blob",
      params : {
        [dataFilterSearch] : dataSearch
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};