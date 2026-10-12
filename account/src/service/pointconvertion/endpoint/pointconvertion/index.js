import PointConvertionService from "../../pointconvertionService";

export const GetPointConversion = async (params) => {
  try {
    const { companyId } = params;

    const response = await PointConvertionService.get(`/api/v1/point-conversion/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdatePointConversion = async (body) => {
  try {
    const response = await PointConvertionService.patch(`/api/v1/point-conversion`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreatePointConvertion = async (body) => {
  try {
    const response = await PointConvertionService.post(`/api/v1/point-conversion`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
