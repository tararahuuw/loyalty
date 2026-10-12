import ProductManagementService from "../../productManagementService";

export const GetAllSpesification = async () => {
  try {
    const response = await ProductManagementService.get("/api/v1/products/specifications");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllProductSummary = async (params) => {
  try {
    const { dataFilter, dataSearch, page, body } = params;

    const response = await ProductManagementService.post(`/api/v1/system-admin/total-products`, body, {
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

export const GetAllProduct = async (params) => {
  try {
    const { dataFilter, dataSearch, page, body } = params;

    const response = await ProductManagementService.post(`/api/v1/products/pagination`, body, {
      params: {
        [dataFilter]: dataSearch,
        page: page,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditProducts = async (roleAccess, body, id) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/products/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateProduct = async (roleAccess, body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/products`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateItemBrand = async (body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/brands`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateItemColor = async (body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/colors`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const CreateItemSize = async (body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/sizes`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditItemBrand = async (id, body) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/brands/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const EditItemColor = async (id, body) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/colors/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const EditItemSize = async (id, body) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/sizes/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const EditItemCustom = async (id, body) => {
  try {
    const response = await ProductManagementService.patch(`/api/v1/specifications-values/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteBrand = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteColor = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/colors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteSize = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/sizes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCustomSpecification = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/specifications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const DeleteCustom = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/specifications-values/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteProduct = async (id) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteProductSpecifications = async (id, specificationId) => {
  try {
    const response = await ProductManagementService.delete(`/api/v1/products/${id}/specifications/${specificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetProductById = async (params) => {
  try {
    const { roleAccess, id } = params;
    const response = await ProductManagementService.get(`/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadProducts = async (params) => {
  try {
    const { dataFilter, dataSearch, body } = params;

    const response = await ProductManagementService.post(`/api/v1/products/download`, body, {
      params: {
        [dataFilter]: dataSearch,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCategory = async () => {
  try {
    const response = await ProductManagementService.post("/api/v1/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCategoryListTree = async () => {
  try {
    const response = await ProductManagementService.get("/api/v1/categories/pagination");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllBrand = async (body) => {
  try {
    const response = await ProductManagementService.post("/api/v1/brands/pagination", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCustomSpecificationTable = async (params) => {
  const { id, search, page } = params;
  try {
    const response = await ProductManagementService.get(`/api/v1/specifications/${id}/pagination`, {
      params: {
        search: search,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCustomSpecification = async (body) => {
  try {
    const response = await ProductManagementService.get("/api/v1/specifications", null, {
      params: {
        companyId: body.companyId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GenerateProduct = async (body) => {
  try {
    let response;
    response = await ProductManagementService.post(`/api/v1/products/generate-code`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewSpecification = async (req) => {
  try {
    const response = await ProductManagementService.post("/api/v1/specifications", req);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewItemSpecification = async (req) => {
  try {
    const response = await ProductManagementService.post("/api/v1/specifications-values", req);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidateProducts = async (body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/products/validate`, body, {
      headers: {
        // Prefer: "status=400",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateProductBulk = async (body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/products/bulk`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateDownloadProducts = async (roleAccess, body) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/products/create-download`, body, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadProductFailed = async (req) => {
  try {
    const response = await ProductManagementService.post(`/api/v1/products/download/${req.id}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
