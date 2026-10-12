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