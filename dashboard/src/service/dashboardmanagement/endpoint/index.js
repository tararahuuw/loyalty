import DashboardManagementService from "../dashboardmanagementService";

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

export const GetDataDashboardDoughnut = async (params) => {
  try {
    const { clientId } = params;

    const body = { 
      clientId: clientId,
    };

    const { data } = await DashboardManagementService.post('/api/v1/dashboard/doughnut', body);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDataDashboard = async (params) => {
  try {
    const { date, clientId, divisionId } = params;

    const body = {
      date: date, 
      clientId: clientId,
      divisionId: divisionId
    };

    const { data } = await DashboardManagementService.post('/api/v1/dashboard/all', body);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDataDashboardClient = async (params) => {
  try {
    const { date, divisionId } = params;

    const body = {
      date: date, 
      divisionId: divisionId,
    };

    const { data } = await DashboardManagementService.post('/api/v1/client-admin/dashboard-all', body);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetVoucherData = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const GetCampaignData = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetMonthPickerData = async (body) => {
  try {
    const { data } = await DashboardManagementService.post("/get-months", body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetStatisticData = async (params) => {
  try {
    const { date } = params;

    const body = {
      startDate: date?.date,
    };

    const { data } = await DashboardManagementService.post('/dashboard', body);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetStatisticDataExternal = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
}

export const GetSalesAnalyticCard = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
}

export const GetSalesAnalytics = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetClientTraffic = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetBestReward = async (body) => {
  try {
    const { data } = await DashboardManagementService.post('/dashboard', body);
    return data;
  } catch (error) {
    throw error;
  }
};