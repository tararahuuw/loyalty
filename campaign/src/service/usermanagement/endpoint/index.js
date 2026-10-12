import UserManagementService from "../usermanagementService";

export const GetAllClient = async (params) => {
  try {
    const { roleAccess } = params;
    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Ops Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Business Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Business Support") {
      url = "client-admin";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.get(`/api/client/${url}`);
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

export const GetDivisionById = async (params) => {
  try {
    const { roleAccess, id } = params;

    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin/";
    } else if (roleAccess === "Ops Administrator") {
      url = "";
    } else if (roleAccess === "Business Administrator") {
      url = "";
    } else if (roleAccess === "Business Support") {
      url = "";
    } else if (roleAccess === "Client Administrator") {
      url = "";
    } else if (roleAccess === "Client Support") {
      url = "";
    }

    const response = await UserManagementService.get(`/api/division/${url}${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllProvince = async () => {
  try {
    // nanti bisa ngirim query params province name keynya = name
    const response = await UserManagementService.get("/api/v1/provinces");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All City
export const GetAllCity = async (params) => {
  const { provinceCode } = params;
  try {
    // nanti bisa ngirim query params city name keynya = name
    const response = await UserManagementService.get(`/api/v1/cities?provinceCode=${provinceCode || 0}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All District
export const GetAllDistrict = async (params) => {
  const { cityCode } = params;
  try {
    // nanti bisa ngirim query params district name keynya = name
    const response = await UserManagementService.get(`/api/v1/districts?regencyCode=${cityCode || 0}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
