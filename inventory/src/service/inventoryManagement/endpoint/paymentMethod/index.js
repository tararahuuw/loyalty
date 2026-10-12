import PaymentMethodManagementService from "../../paymentMethodManagementService";

export const GetAllPaymentMethodSummaries = async (params) => {
  try {
    const { filter, page } = params;

    const bodyRequest = {
      filters: filter,
      page: page,
    };

    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods/pagination`, bodyRequest);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetPaymentMethodSummaryById = async (id) => {
  try {
    const response = await PaymentMethodManagementService.get(`/api/v1/payment-methods/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeletePaymentMethod = async (id) => {
  try {
    const response = await PaymentMethodManagementService.delete(`/api/v1/payment-methods/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreatePaymentMethod = async (roleAccess, body) => {
  try {
    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreatePaymentMethodBulk = async (roleAccess, body) => {
  try {
    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods/bulk`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateDownloadPaymentMethod = async (roleAccess, body) => {
  try {
    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods/create-download`, body, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditPaymentMethod = async (roleAccess, id, body) => {
  try {
    const response = await PaymentMethodManagementService.patch(`/api/v1/payment-methods/${id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePaymentMethod = async (body) => {
  try {
    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods/validate`, body, {
      headers: {
        // Prefer: "status=400",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadPaymentMethods = async (params) => {
  try {
    const { filter } = params;

    const bodyRequest = {
      filters: filter,
    };

    const response = await PaymentMethodManagementService.post(`/api/v1/payment-methods/download`, bodyRequest, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
