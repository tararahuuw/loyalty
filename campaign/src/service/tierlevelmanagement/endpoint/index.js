import TierLevelManagementService from "../tierlevelService";

export const GetAllTierLevelByDivisionId = async (params) => {
  try {
    const { divisionId } = params;

    const response = await TierLevelManagementService.get(`/api/v1/tier-level/division/${divisionId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tier level APIS v2
export const GetTierLevels = async () => {
  try {
    const response = await TierLevelManagementService.get("/api/v1/tiers");
    return response.data;
  } catch (error) {
    throw error;
  }
};
