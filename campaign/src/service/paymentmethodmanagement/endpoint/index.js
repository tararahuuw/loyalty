import PaymentMethodManagementService from "../paymentmethodService";

export const GetAllPaymentMethod = async (companyId) => {
  try {
    const response = await PaymentMethodManagementService.get("/api/v1/payment-methods", {
      params: {
        companyId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
