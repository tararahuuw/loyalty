import ReportManagementService from "../reportManagementService";

export const GetSummaryCampaignReportPagination = async (params) => {
  try {
    const { filter, page } = params;
    const bodyRequest = {
      ...filter,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailCustomerSummaryReport = async (params) => {
  try {
    const { chip, startDate, endDate, id } = params;
    const reqbody = {
      startDate: startDate,
      endDate: endDate ? endDate : startDate
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/activity/${chip === "Point" ? "points" : "rewards"}/summary/${id}`, reqbody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailCustomerReport = async (params) => {
  try {
    const { id } = params;
    const response = await ReportManagementService.get(`/api/v1/report/customer360/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCustomerReportPagination = async (params) => {
  try {
    const { filter, page } = params;
    const bodyRequest = {
      ...filter,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetSummaryRewardReportPagination = async (params) => {
  try {
    const { filter, page } = params;
    const bodyRequest = {
      ...filter,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/reward/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetReportDetailCampaign = async (params) => {
  try {
    const { id } = params;
    const response = await ReportManagementService.get(`/api/v1/report/summary/campaign/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetActivityPointReport = async (params) => {
  try {
    const { filter, id, time, page } = params;
    const bodyRequest = {
      ...filter,
      startDate: time.startDate,
      endDate: time.endDate,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/activity/points/pagination/${id}`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetActivityRewardReport = async (params) => {
  try {
    const { filter, id, time, page } = params;
    const bodyRequest = {
      ...filter,
      startDate: time.startDate,
      endDate: time.endDate || time.startDate,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/activity/rewards/pagination/${id}`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetSummaryCampaignDataReportPagination = async (params) => {
  try {
    const { filter, id, startDate, endDate, page } = params;
    const bodyRequest = {
      filters: filter,
      campaignId: id,
      page:page,
      startDate: startDate,
      endDate: endDate
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/data/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetSummaryCampaignDataRewardReportPagination = async (params) => {
  try {
    const { filter, id, startDate, endDate, page } = params;
    const bodyRequest = {
      ...filter,
      campaignId: id,
      page:page,
      startDate: startDate,
      endDate: endDate
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign-reward/data/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailsReportPagination = async (params) => {
  try {
    const { filter, page } = params;
    const bodyRequest = {
      ...filter,
      page:page
    }
    const response = await ReportManagementService.post(`/api/v1/report/details/pagination`, bodyRequest);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetReportAnalyticsSummaryCampaign = async (params) => {
  try {
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/detail`, params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSummaryCampaignDataDownload = async (params) => {
  try {
    const { filter, id, startDate, endDate } = params;
    const bodyRequest = {
      ...filter,
      campaignId:id,
      startDate: startDate,
      endDate: endDate,
      isIncludeTime: false
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/data/download`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSummaryCampaignRewardDataDownload = async (params) => {
  try {
    const { filter, id, startDate, endDate } = params;
    const bodyRequest = {
      ...filter,
      campaignId:id,
      startDate: startDate,
      endDate: endDate,
      isIncludeTime: false
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign-reward/data/download`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSummaryCampaignReport = async (req) => {
  try {
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/download`, req.filter, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSummaryRewardReport = async (req) => {
  try {
    const response = await ReportManagementService.post(`/api/v1/report/summary/reward/download`, req.filter, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSummaryRewardDetailReport = async (req) => {
  try {
    const response = await ReportManagementService.post(`/api/v1/report/summary/reward/detail/download`, req.filter, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadDetailsReport = async (params) => {
  try {
    const bodyRequest = {
      ...params
    }
    const response = await ReportManagementService.post(`/api/v1/report/summary/campaign/detail/download`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadDetailReport = async (params) => {
  try {
    const bodyRequest = {
      ...params.filter
    }
    const response = await ReportManagementService.post(`/api/v1/report/details/download`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadCustomerReport = async (req) => {
  try {
    const response = await ReportManagementService.post(`/api/v1/report/customer360/download`, req.filter, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const DownloadCustomerDetailPoint = async (req) => {
  try {
    const bodyRequest = {
      ...req.filter,
      startDate: req.time.startDate,
      endDate: req.time.endDate ? req.time.endDate : req.time.startDate
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/activity/points/download/${req.id}`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const DownloadCustomerDetailReward = async (req) => {
  try {
    const bodyRequest = {
      ...req.filter,
      startDate: req.time.startDate,
      endDate: req.time.endDate ? req.time.endDate : req.time.startDate
    }
    const response = await ReportManagementService.post(`/api/v1/report/customer360/activity/rewards/download/${req.id}`, bodyRequest, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};