import VoucherManagementService from "../../VoucherManagementService";
import UserManagementService from "../../UserManagementService";
import ProductManagementService from "../../ProductManagementService";
import OrderManagementService from "../../OrderManagementService";

const generateUrl = (role) => {
  let url = "internal-role";
  if (
    role === "System Administrator" ||
    role === "Business Support" ||
    role === "Business Administrator" ||
    role === "Ops Administrator" ||
    role === "Reconcile"
  ) {
    url = "internal-role";
  } else {
    url = "external-role";
  }

  return url;
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

export const GetAllVoucherType = async (params) => {
  try {
    const { roleAccess } = params;

    const response = await VoucherManagementService.get(`/api/voucher-type/${generateUrl(roleAccess)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateNewVoucher = async (role, body) => {
  try {
    const response = await VoucherManagementService.post(`/api/voucher/${generateUrl(role)}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditVoucher = async (role, body) => {
  try {
    const response = await VoucherManagementService.patch(`/api/voucher/${generateUrl(role)}`, body, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetVoucherById = async (params) => {
  try {
    const { roleAccess, voucherId } = params;

    const response = await VoucherManagementService.get(`/api/voucher/${generateUrl(roleAccess)}/${voucherId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetVoucherHistory = async (params) => {
  try {
    const { roleAccess, voucherId, dataFilter, dataSearch, page } = params;

    const response = await OrderManagementService.get(`/api/order/${generateUrl(roleAccess)}/pagination/${voucherId}`, {
      params: {
        [dataFilter]: dataSearch,
        page: page,
        tab: "all",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteVoucher = async (id) => {
  try {
    const response = await VoucherManagementService.delete(`/api/voucher/internal-role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeVoucherStatus = async (roleAccess, body) => {
  try {
    const response = await VoucherManagementService.post(`/api/voucher/${generateUrl(roleAccess)}/update-status`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteSpesificPhoto = async (roleAccess, body) => {
  try {
    const response = await VoucherManagementService.post(
      `/api/specific-voucher-photo/${generateUrl(roleAccess)}/delete`,
      body,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadVoucherList = async (roleAccess, body) => {
  try {
    const response = await VoucherManagementService.post(`/api/voucher/internal-role/download-excel`, body, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetProductBySearch = async (params) => {
  try {
    const { body } = params;

    const response = await ProductManagementService.post(`/api/product-ppob-non-ppob/search`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Voucher v2 apis
export const GetAllVoucher = async (params) => {
  try {
    const { companyId, dataFilter, dataSearch, page, status, body } = params;

    const response = await VoucherManagementService.post(`/api/v1/vouchers/pagination`, body, {
      params: {
        name: dataFilter === "name" ? dataSearch : "",
        companyId,
        price: dataFilter === "price" ? dataSearch : "",
        page: page,
        status,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DownloadVouchers = async (params) => {
  try {
    const { companyId, dataFilter, dataSearch, status, body } = params;

    const response = await VoucherManagementService.post(`/api/v1/vouchers/download`, body, {
      params: {
        name: dataFilter === "name" ? dataSearch : "",
        companyId,
        price: dataFilter === "price" ? dataSearch : "",
        status,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherNoPagination = async (params) => {
  try {
    const { companyId, dataSearch, startDate, endDate, page, body } = params;

    const response = await VoucherManagementService.post("/api/v1/catalog/list", body, {
      params: {
        name: dataSearch,
        companyId,
        page,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckoutVouchers = async (body) => {
  try {
    const response = await VoucherManagementService.post("/api/v1/vouchers/checkout", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetVoucherDetail = async (id) => {
  try {
    const response = await VoucherManagementService.get(`/api/v1/vouchers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllVoucherCategory = async (params) => {
  try {
    const { voucherTypeCode } = params;

    const response = await VoucherManagementService.post("/api/v1/catalog/categories", {
      type: voucherTypeCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
