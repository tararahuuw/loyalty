import ProductManagementService from "../../productManagementService";

export const GetFirstCategoryList = async () => {
  try {
    const response = await ProductManagementService.get("/api/v1/categories/list?level=1");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetSecondCategoryList = async (companyId) => {
  try {
    const response = await ProductManagementService.get("/api/v1/categories/list", {
      params: {
        level: 2,
        companyId: companyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCategories = async (params) => {
  try {
    const { dataFilter, dataSearch, companyId, page } = params;

    const response = await ProductManagementService.get(`/api/v1/categories/pagination`, {
      params: {
        page,
        companyId,
        [dataFilter]: dataSearch,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTreeByID = async (id) => {
  try {
    const response = await ProductManagementService.get(`/api/v1/categories/tree/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllTree = async () => {
  try {
    const response = await ProductManagementService.get(`/api/v1/categories/tree`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateCategoryTree = async (body) => {
  try {
    const response = await ProductManagementService.post("/api/v1/categories", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateCategoryTree = async (id, body) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/categories/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCategoryByID = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadCategories = async (params) => {
  try {
    const { dataFilter, dataSearch, companyId } = params;

    const response = await ProductManagementService.post(`/api/v1/categories/download`, null, {
      params: {
        companyId,
        [dataFilter]: dataSearch,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
