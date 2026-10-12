import CategoryManagementService from "../../CategoryManagementService";
import GoodsManagementService from "../../GoodsManagementService";

export const GetAllGoods = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await GoodsManagementService.post(`/api/v1/goods/pagination`, body, {
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

export const GetCategoryList = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await CategoryManagementService.get(`/api/v1/categories/tree`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewGoods = async (role, body) => {
  try {
    const response = await GoodsManagementService.post(`/api/v1/goods`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditGoods = async (role, id, body) => {
  try {
    const response = await GoodsManagementService.patch(`/api/v1/goods/${id}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteGoods = async (id) => {
  try {
    const response = await GoodsManagementService.delete(`/api/v1/goods/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetGoodsById = async (id) => {
  try {
    const response = await GoodsManagementService.get(`/api/v1/goods/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};







