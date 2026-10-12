import CampaignManagementService from "../campaignManagementService";

export const GetAllCampaign = async (req) => {
  try {
    const bodyReq = {
      "parameterNames": [],
      "status": [
        "active"
      ]
    }
    const response = await CampaignManagementService.post(`/api/v1/campaigns/list`, bodyReq, {
      params: {
        companyId: req.companyId
      }
    })

    return response.data;
  } catch (error) {
    throw error;
  }
};