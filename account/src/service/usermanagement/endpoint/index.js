import UserManagementService from "../usermanagementService";

// Post Login

export const PostLoginUser = async (email, password) => {
  try {
    const response = await UserManagementService.post("/api/user/login", {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// System Administrator

export const GetAllUserBySystemAdministration = async (dataFilter, dataSearch, page, body) => {
  try {
    const response = await UserManagementService.post("/api/user/get/sys-admin", body, {
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

export const GetAllUserByOpsAdministration = async (dataFilter, dataSearch, page, body) => {
  try {
    const response = await UserManagementService.post("/api/user/get/ops-admin", body, {
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

// Get File
export const GetFileBySystemAdministration = async (filename) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await UserManagementService.get(`/api/client/files/${token}/${filename}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    throw error;
  }
};

// Get File
export const PatchApprovalClientByInternalRole = async (request) => {
  try {
    const response = await UserManagementService.patch(`/api/client/internal-role/approval`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: Change to correct API LINK
export const GetAllDivisionBySystemAdministration = async (dataFilter, dataSearch, page, body) => {
  try {
    const response = await UserManagementService.post("/api/division/internal-role/pagination", body, {
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

export const GetAllRoleBySystemAdministration = async ({ roleAccess }) => {
  try {
    let url = "";
    if (roleAccess === "System Administrator") {
      url = "sys-admin";
    } else if (roleAccess === "Ops Administrator") {
      url = "ops-admin";
    } else if (roleAccess === "Client Administrator") {
      url = "client-admin";
    } else if (roleAccess === "Client Support") {
      url = "client-admin";
    }

    const response = await UserManagementService.get(`/api/role/${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailUserBySystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailClientBySystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/client/sys-admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostCreateUserBySystemAdministration = async (body) => {
  try {
    const response = await UserManagementService.post("/api/user/sys-admin", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PatchEditUserBySystemAdministration = async (body) => {
  try {
    const response = await UserManagementService.patch("/api/user/sys-admin", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUserIdBySystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.delete(`/api/user/sys-admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: Change to correct API LINK
export const DeleteDivisionIdBySystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.delete(`/api/user/sys-admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Client Administrator
export const GetAllUserByClientAdministration = async (dataFilter, dataSearch, page, body) => {
  try {
    const response = await UserManagementService.post("/api/user/get/client-admin", body, {
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
export const GetAllClientByClientAdministration = async () => {
  try {
    const response = await UserManagementService.get("/api/client/client-admin");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllDivisionByClientAdministration = async () => {
  try {
    const response = await UserManagementService.get("/api/division/client-admin");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllRoleByClientAdministration = async () => {
  try {
    const response = await UserManagementService.get("/api/role/client-admin");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailUserByClientAdministration = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PostCreateUserByClientAdministration = async (body) => {
  try {
    const response = await UserManagementService.post("/api/user/client-admin", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PatchEditUserByClientAdministration = async (body) => {
  try {
    const response = await UserManagementService.patch("/api/user/client-admin", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUserIdByClientAdministration = async (id) => {
  try {
    const response = await UserManagementService.delete(`/api/user/client-admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Detail User By ID
export const GetDetailUserByID = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/user/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get Resend Email User By ID
export const GetResendEmailUser = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/user/resend-email/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change Password
export const ChangePasswordUser = async (request) => {
  try {
    const response = await UserManagementService.patch(`/api/user/change-password`, request);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get All Province
export const GetAllProvince = async () => {
  try {
    const response = await UserManagementService.get("/api/province");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All City
export const GetAllCity = async (provinceCode) => {
  try {
    const response = await UserManagementService.get(`/api/city/${provinceCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All District
export const GetAllDistrict = async (cityCode) => {
  try {
    const response = await UserManagementService.get(`/api/district/${cityCode}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Bank
export const GetAllBank = async () => {
  try {
    const response = await UserManagementService.get("/api/bank");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Industry
export const GetAllIndustry = async () => {
  try {
    const response = await UserManagementService.get("/api/industry");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Internal Role

// TODO: Change name if get the proper role account for testing (now the account testing name is still for the role sys admin)
export const GetAllClientBySystemAdministration = async (tab, dataFilter, dataSearch, page, body) => {
  try {
    const response = await UserManagementService.post("/api/client/internal-role/pagination", body, {
      params: {
        [dataFilter]: dataSearch,
        tab: tab,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error response:", error.response);
    throw error;
  }
};

// TODO: Change name if get the proper role account for testing
export const DeleteClientIdBySystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.delete(`/api/client/internal-role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteClientByInternalRole = async (id) => {
  try {
    const response = await UserManagementService.delete(`/api/client/internal-role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO: Change name if get the proper role account for testing
export const GetDivisionByIdSystemAdministration = async (id) => {
  try {
    const response = await UserManagementService.get(`/api/division/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllClientsBySystemAdministratorAddUser = async () => {
  try {
    const response = await UserManagementService.get("/api/client/sys-admin");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDetailDivisionByIDAddUser = async (divisionId) => {
  try {
    const response = await UserManagementService.get(`/api/division/all/${divisionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
