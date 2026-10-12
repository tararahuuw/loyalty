import UserManagementService from "../../usermanagementService";

export const GetClientById = async (params) => {
  try {
    const { roleAccess, id } = params;

    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Ops Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Business Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Business Support") {
      url = "sys-admin";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.get(`/api/client/${url}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllClient = async (params) => {
  try {
    const { roleAccess, tab, dataFilter, dataSearch, page, body } = params;

    let url = "";
    if (roleAccess === "System Administrator") {
      url = "internal-role";
    } else if (roleAccess === "Ops Administrator") {
      url = "internal-role";
    } else if (roleAccess === "Business Administrator") {
      url = "internal-role";
    } else if (roleAccess === "Business Support") {
      url = "internal-role";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.post(`/api/client/${url}/pagination`, body, {
      params: {
        [dataFilter]: dataSearch,
        tab: tab,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewClient = async (roleAccess, body) => {
  try {
    let apiUrl = "";

    if (roleAccess === "System Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Ops Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Business Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Business Support") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Client Administrator") {
      apiUrl = "client-admin";
    }

    const response = await UserManagementService.post(`/api/client/${apiUrl}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PatchClient = async (roleAccess, body) => {
  try {
    let apiUrl = "";

    if (roleAccess === "System Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Ops Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Business Administrator") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Business Support") {
      apiUrl = "internal-role";
    } else if (roleAccess === "Client Administrator") {
      apiUrl = "client-admin";
    }

    const response = await UserManagementService.patch(`/api/client/${apiUrl}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchClientFile = async (params) => {
  try {
    const { file } = params;
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await UserManagementService.get(`/api/client/files/${token}/${file}`);
    const convertedFile = new File([response.data], file, {
      type: response.headers["content-type"],
      lastModified: Date.now(),
    });
    return convertedFile;
  } catch (error) {
    throw error;
  }
};

export const FetchClientFileURL = async (params) => {
  try {
    const { file } = params;
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await UserManagementService.get(`/api/client/files/${token}/${file}`, {
      responseType: "blob",
    });
    const fileBlob = res.data;
    const fileUrl = URL.createObjectURL(fileBlob);
    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const DeleteClient = async (id) => {
  try {
    let apiUrl = "internal-role";
    const response = await UserManagementService.delete(`/api/client/${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PatchApprovalClientByInternalRole = async (request) => {
  try {
    const response = await UserManagementService.patch(`/api/client/internal-role/approval`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};
