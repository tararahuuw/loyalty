import CashbackManagementService from "../../CashbackManagementService";

export const GetAllCashback = async (params) => {
  try {
    const { roleAccess, dataFilter, dataSearch, page, body } = params;

    const response = await CashbackManagementService.post(`/api/v1/cashback/pagination`, body, {
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

export const CreateNewCashback = async (role, body) => {
  try {
    const response = await CashbackManagementService.post(`/api/v1/cashback`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditCashback = async (role, id, body) => {
  try {
    const response = await CashbackManagementService.patch(`/api/v1/cashback/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCashback = async (id) => {
  try {
    const response = await CashbackManagementService.delete(`/api/v1/cashback/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};