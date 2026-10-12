import UserManagementService from "../../usermanagementService";

const generateUrl = (role) => {
  let url = "internal-role";
  if (role === "System Administrator") {
    url = "sys-admin";
  } else if (role === "Ops Administrator") {
    url = "ops-admin";
  } else if (role === "Client Administrator") {
    url = "client-admin";
  } else if (role === "Client Support") {
    url = "client-support";
  }

  return url;
};

export const GetAllUser = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Ops Administrator") {
      url = "ops-admin";
    } else if (roleAccess === "Business Administrator") {
      url = "ops-admin";
    } else if (roleAccess === "Business Support") {
      url = "ops-admin";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.post(`/api/user/get/${url}`, body, {
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

export const CreateNewUser = async (role, body) => {
  try {
    let url = "";
    if (role === "System Administrator") {
      url = "sys-admin";
    } else if (role === "Ops Administrator") {
      url = "ops-admin";
    } else if (role === "Business Administrator") {
      url = "ops-admin";
    } else if (role === "Business Support") {
      url = "ops-admin";
    } else if (role === "Client Administrator") {
      url = "client-admin";
    }

    const response = await UserManagementService.post(`/api/user/${url}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditUser = async (role, body) => {
  try {
    let url = "";
    if (role === "System Administrator") {
      url = "sys-admin";
    } else if (role === "Ops Administrator") {
      url = "ops-admin";
    } else if (role === "Business Administrator") {
      url = "ops-admin";
    } else if (role === "Business Support") {
      url = "ops-admin";
    } else if (role === "Client Administrator") {
      url = "client-admin";
    }

    const response = await UserManagementService.patch(`/api/user/${url}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUser = async (role, userId) => {
  try {
    let url = "";
    if (role === "System Administrator") {
      url = "sys-admin";
    } else if (role === "Ops Administrator") {
      url = "ops-admin";
    } else if (role === "Business Administrator") {
      url = "ops-admin";
    } else if (role === "Business Support") {
      url = "ops-admin";
    } else if (role === "Client Administrator") {
      url = "client-admin";
    }

    const response = await UserManagementService.delete(`/api/user/${url}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetUserById = async (params) => {
  try {
    const { userId } = params;
    const response = await UserManagementService.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SendEmailVerification = async (userId) => {
  try {
    const response = await UserManagementService.get(`/api/user/resend-email/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
    console.error("Error response:", error.response);
    throw error;
  }
};
