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

export const GetAllDivision = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

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

    const response = await UserManagementService.post(`/api/division/${url}/pagination`, body, {
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

export const GetAllDivisionByClientID = async (params) => {
  try {
    const { id, dataFilter, dataSearch, page } = params;

    const response = await UserManagementService.post(`/api/division/all/pagination/${id}`, null, {
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

export const CreateNewDivision = async (role, body) => {
  try {
    let url = "";
    if (role === "System Administrator") {
      url = "internal-role";
    } else if (role === "Ops Administrator") {
      url = "internal-role";
    } else if (role === "Business Administrator") {
      url = "internal-role";
    } else if (role === "Business Support") {
      url = "internal-role";
    } else if (role === "Client Administrator") {
      url = "client-admin";
    }

    const response = await UserManagementService.post(`/api/division/${url}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditDivision = async (role, body) => {
  try {
    let url = "";
    if (role === "System Administrator") {
      url = "internal-role";
    } else if (role === "Ops Administrator") {
      url = "internal-role";
    } else if (role === "Business Administrator") {
      url = "internal-role";
    } else if (role === "Business Support") {
      url = "internal-role";
    } else if (role === "Client Administrator") {
      url = "client-admin";
    }

    const response = await UserManagementService.patch(`/api/division/${url}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchDivisionFile = async (params) => {
  try {
    const { file } = params;
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await UserManagementService.get(`/api/division/files/${token}/${file}`);
    const convertedFile = new File([response.data], file, {
      type: response.headers["content-type"],
      lastModified: Date.now(),
    });
    return convertedFile;
  } catch (error) {
    throw error;
  }
};

export const FetchDivisionFileURL = async (params) => {
  try {
    const { file } = params;
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await UserManagementService.get(`/api/division/files/${token}/${file}`, {
      responseType: "blob",
    });
    const fileBlob = res.data;
    const fileUrl = URL.createObjectURL(fileBlob);
    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const DeleteDivision = async (roleAccess, id) => {
  try {
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
    }

    const response = await UserManagementService.delete(`/api/division/${url}/${id}`);
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

export const GetAllClient = async (params) => {
  try {
    const { roleAccess } = params;
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

    const response = await UserManagementService.get(`/api/client/${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
