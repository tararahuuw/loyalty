import PointRulesManagementService from "../pointrulesService";
import ProgramManagementService from "../programService";

export const GetAllPointRules = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await PointRulesManagementService.post(`/api/v1/point-rules/pagination`, body, {
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

export const GetAllProductPointRules = async (params) => {
  try {
    const { id, dataFilter, dataSearch, page } = params;

    const response = await PointRulesManagementService.get(`/api/v1/point-rules-product/pagination/point-rules/${id}`, {
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

export const GetPointRulesById = async (params) => {
  try {
    const { roleAccess, id } = params;
    const response = await PointRulesManagementService.get(`/api/v1/point-rules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewPointRules = async (params) => {
  try {
    const { roleAccess, body } = params;

    const response = await PointRulesManagementService.post(`/api/v1/point-rules`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdatePointRules = async (params) => {
  try {
    const { roleAccess, body } = params;

    const response = await PointRulesManagementService.patch(`/api/v1/point-rules`, body);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PatchApprovalPointRules = async (body) => {
  try {
    const response = await PointRulesManagementService.patch(`/api/v1/point-rules/approve`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeletePointRules = async (id) => {
  try {
    const response = await PointRulesManagementService.delete(`/api/v1/point-rules/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Campaign APIS v2
export const CreateCampaign = async (body) => {
  try {
    const response = await PointRulesManagementService.post(`/api/v1/campaigns`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditCampaign = async (id, body) => {
  try {
    const response = await PointRulesManagementService.patch(`/api/v1/campaigns/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCampaignsPagination = async (params) => {
  try {
    const { name, companyId, startDate, endDate, body, page } = params;

    const response = await PointRulesManagementService.post("/api/v1/campaigns/pagination", body, {
      params: {
        name,
        companyId,
        startDate,
        endDate,
        page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailCampaign = async (id) => {
  try {
    const response = await PointRulesManagementService.get(`/api/v1/campaigns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetCampaignRewards = async (params) => {
  try {
    const { id, companyId } = params;
    const response = await PointRulesManagementService.get(`/api/v1/campaigns/${id}/rewards`, {
      params: {
        companyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeCampaignStatus = async (id, body) => {
  try {
    const response = await PointRulesManagementService.patch(`/api/v1/campaigns/${id}/status`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCampaign = async (id) => {
  try {
    const response = await PointRulesManagementService.delete(`/api/v1/campaigns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllPrograms = async (companyId) => {
  try {
    const response = await ProgramManagementService.get("/api/v1/program");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCampaignList = async (companyId) => {
  try {
    const response = await PointRulesManagementService.post(
      "/api/v1/campaigns/list",
      {},
      {
        params: {
          companyId,
          point: "active",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllTemplates = async (companyId) => {
  try {
    const response = await PointRulesManagementService.get("/api/v1/campaign-templates/list", {
      params: {
        companyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadRewards = async (id) => {
  try {
    const response = await PointRulesManagementService.get(`/api/v1/campaigns/${id}/rewards/download`, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllSenderId = async (companyId) => {
  try {
    const response = await PointRulesManagementService.get(`/api/v1/campaign-configurations/list`, {
      params: {
        companyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Simulation APIs
export const GetAllSimulationHistory = async (params) => {
  try {
    const { companyId, campaignId, dataFilterSearch, dataSearch, startDate, endDate, isIncludeTime, page, body } =
      params;

    const queryParams = {
      companyId,
      campaignId,
      startDate,
      endDate,
      isIncludeTime,
      page,
    };

    if (dataFilterSearch?.value) {
      queryParams[dataFilterSearch.value] = dataSearch;
    }

    const response = await PointRulesManagementService.post("/api/v1/campaign-simulation/pagination", body, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CalculatePoints = async (body) => {
  try {
    const response = await PointRulesManagementService.post("/api/v1/campaign-simulation/calculate", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetSimulationDetail = async (id) => {
  try {
    const response = await PointRulesManagementService.get(`/api/v1/campaign-simulation/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateSimulation = async (body) => {
  try {
    const response = await PointRulesManagementService.post("/api/v1/campaign-simulation/create", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteSimulation = async (id) => {
  try {
    const response = await PointRulesManagementService.delete(`/api/v1/campaign-simulation/${id}`);
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
    const response = await PointRulesManagementService.post(`/api/v1/campaign-simulation/download-template`, bodyReq, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateBulkSimulation = async (body) => {
  try {
    const response = await PointRulesManagementService.post(`/api/v1/campaign-simulation/upload-template`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSimulationFailed = async (req) => {
  try {
    const response = await PointRulesManagementService.post(`/api/v1/campaign-simulation/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidateSimulations = async (body) => {
  try {
    const response = await PointRulesManagementService.post(`/api/v1/campaign-simulation/validate-template`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadCampaign = async (req) => {
  try {
    const { params, body } = req;
    const response = await PointRulesManagementService.post(`/api/v1/campaigns/download`, body, {
      params,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadSimulation = async (params) => {
  try {
    const { companyId, campaignId, dataFilterSearch, dataSearch, startDate, endDate, isIncludeTime, page, body } =
      params;

    const queryParams = {
      companyId,
      campaignId,
      startDate,
      endDate,
      isIncludeTime,
      page,
    };

    if (dataFilterSearch?.value) {
      queryParams[dataFilterSearch.value] = dataSearch;
    }

    const response = await PointRulesManagementService.post(`/api/v1/campaign-simulation/download`, body, {
      params: queryParams,
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
