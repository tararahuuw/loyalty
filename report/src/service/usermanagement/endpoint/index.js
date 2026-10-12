import UserManagementService from "../usermanagementService";

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

export const GetAllDivisionByClientName = async (params) => {
  try {
    const { clientName } = params;
    const response = await UserManagementService.get(`/api/division/name/${clientName}`);
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