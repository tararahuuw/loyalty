import * as yup from "yup";
import moment from "moment";

export const campaignValidation = yup.object().shape({
  name: yup.string().required("Campaign name is required"),
  description: yup.string(),
  startDate: yup.string().required("Start date is required"),
  endDate: yup
    .string()
    .required("End date is required")
    .test("end-after-start", "End Date cannot be earlier than Start Date", function (endDate) {
      const { startDate } = this.parent;
      if (!startDate || !endDate) return true;
      return moment(endDate).isSameOrAfter(moment(startDate), "minute");
    }),
  rewardUtilizationMethod: yup.string().required(),
  isPointActive: yup.boolean().required(),
  // Create Point
  pointProcessingMethod: yup.string().when("isPointActive", {
    is: (isPointActive) => isPointActive,
    then: (schema) => schema.required("Point processing method is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  pointEarned: yup.number().when(["method", "isPointActive", "pointProcessingMethod"], {
    is: (method, isPointActive, pointProcessingMethod) =>
      method === "all" && isPointActive && pointProcessingMethod !== "upload point",
    then: (schema) =>
      schema
        .typeError("Point earned must be a number")
        .required("Point earned is required")
        .moreThan(0, "Point earned must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
  pointEarnedException: yup.number().when(["method", "isPointActive", "pointProcessingMethod"], {
    is: (method, isPointActive, pointProcessingMethod) =>
      method === "all" && isPointActive && pointProcessingMethod !== "upload point",
    then: (schema) =>
      schema
        .typeError("Point earned exception must be a number")
        .required("Point earned exception is required")
        .moreThan(0, "Point earned exception must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
  method: yup.string().required(),
  segmentedCustomer: yup.array().when(["isPointActive", "method"], {
    is: (isPointActive, method) => isPointActive && method === "segmented",
    then: (schema) =>
      schema.min(1, "Parameter is required").of(
        yup.object().shape({
          tierLevelId: yup.string().required("Tier level is required"),
          pointEarned: yup
            .number()
            .typeError("Point earned must be a number")
            .required("Point earned is required")
            .moreThan(0, "Point earned must be greater than 0"),
          pointEarnedException: yup
            .number()
            .typeError("Point earned exception must be a number")
            .required("Point earned exception is required")
            .moreThan(0, "Point earned exception must be greater than 0"),
        }),
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  isPointEarnedNotification: yup.boolean().required(),
  channels: yup.array().when("isPointEarnedNotification", {
    is: (isPointEarnedNotification) => isPointEarnedNotification,
    then: (schema) => schema.min(1, "Channels is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  emailTemplate: yup.string().when("channels", {
    is: (channels) => channels?.includes("Email"),
    then: (schema) => schema.required("Email template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  senderID: yup.string().when("isPointEarnedNotification", {
    is: (isPointEarnedNotification) => isPointEarnedNotification,
    then: (schema) => schema.required("Sender ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  smsTemplate: yup.string().when("channels", {
    is: (channels) => channels?.includes("SMS"),
    then: (schema) => schema.required("SMS template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  subject: yup.string().when("isPointEarnedNotification", {
    is: (isPointEarnedNotification) => isPointEarnedNotification,
    then: (schema) => schema.required("Subject is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  templateLanguage: yup.string().when("isPointEarnedNotification", {
    is: (isPointEarnedNotification) => isPointEarnedNotification,
    then: (schema) => schema.required("Template language is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  whatsappTemplate: yup.string().when("channels", {
    is: (channels) => channels?.includes("WhatsApp"),
    then: (schema) => schema.required("WhatsApp template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  pointParameters: yup.array().when(["isPointActive", "pointProcessingMethod"], {
    is: (isPointActive, pointProcessingMethod) => isPointActive && pointProcessingMethod !== "upload point",
    then: (schema) =>
      schema.min(1, "Parameter is required").of(
        yup.object().shape({
          id: yup.string().required("ID is required"),
          type: yup.string().required("Type is required"),
          value: yup
            .object()
            .when("type", {
              is: "text",
              then: () =>
                yup.object().shape({
                  text: yup.string().required(" is required"),
                }),
            })
            .when("type", {
              is: "number",
              then: () =>
                yup.object().shape({
                  number: yup.number().min(1, " is required").required(" is required"),
                }),
            })
            .when("type", {
              is: "option",
              then: () =>
                yup.object().shape({
                  options: yup.array().min(1, " is required"),
                }),
            })
            .when("type", {
              is: "datetime",
              then: () =>
                yup.object().shape({
                  startDate: yup.string().required(" is required"),
                }),
            }),
          exception: yup
            .object()
            .when("type", {
              is: "text",
              then: () =>
                yup.object().shape({
                  text: yup.string().notRequired(),
                }),
            })
            .when("type", {
              is: "number",
              then: () =>
                yup.object().shape({
                  number: yup.number().notRequired(),
                }),
            })
            .when("type", {
              is: "option",
              then: () =>
                yup.object().shape({
                  options: yup.array(),
                }),
            })
            .when("type", {
              is: "datetime",
              then: () =>
                yup.object().shape({
                  startDate: yup.string().notRequired(),
                }),
            }),
          withException: yup.boolean().required(),
        }),
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Rewards
  rewardAssignmentMethod: yup.string().required(),
  channels2: yup.array().when(["pointProcessingMethod", "rewardUtilizationMethod"], {
    is: (pointProcessingMethod, rewardUtilizationMethod) =>
      rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point",
    then: (schema) => schema.min(1, "Channels is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  emailTemplate2: yup.string().when(["channels2", "rewardUtilizationMethod"], {
    is: (channels, rewardUtilizationMethod) => channels?.includes("Email") && rewardUtilizationMethod === "dashboard",
    then: (schema) => schema.required("Email template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  senderID2: yup.string().when(["pointProcessingMethod", "rewardUtilizationMethod"], {
    is: (pointProcessingMethod, rewardUtilizationMethod) =>
      rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point",
    then: (schema) => schema.required("Sender ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  smsTemplate2: yup.string().when(["channels2", "rewardUtilizationMethod"], {
    is: (channels, rewardUtilizationMethod) => channels?.includes("SMS") && rewardUtilizationMethod === "dashboard",
    then: (schema) => schema.required("SMS template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  subject2: yup.string().when(["pointProcessingMethod", "rewardUtilizationMethod"], {
    is: (pointProcessingMethod, rewardUtilizationMethod) =>
      rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point",
    then: (schema) => schema.required("Subject is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  templateLanguage2: yup.string().when(["pointProcessingMethod", "rewardUtilizationMethod"], {
    is: (pointProcessingMethod, rewardUtilizationMethod) =>
      rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point",
    then: (schema) => schema.required("Template language is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  whatsappTemplate2: yup.string().when(["channels2", "rewardUtilizationMethod"], {
    is: (channels, rewardUtilizationMethod) =>
      channels?.includes("WhatsApp") && rewardUtilizationMethod === "dashboard",
    then: (schema) => schema.required("WhatsApp template is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  recipients: yup.array().when(["isPointActive", "rewardUtilizationMethod"], {
    is: (isPointActive, rewardUtilizationMethod) => !isPointActive && rewardUtilizationMethod === "dashboard",
    then: (schema) =>
      schema.min(1, "No recipient added yet. Add at least one recipient to continue.").of(
        yup.object().shape({
          email: yup.string(),
          phoneNumber: yup.string(),
          recipientName: yup.string().required("Required"),
          rewardId: yup.string().required("Required"),
          quantity: yup.number().typeError("Required").min(1, "Required").required("Required"),
        }),
      ),
  }),

  rewards: yup.array().when("isPointActive", {
    is: (isPointActive) => !isPointActive,
    then: (schema) =>
      schema.min(1, "No rewards added yet. Add at least one reward to continue.").of(
        yup.object().shape({
          id: yup.string().required("Reward id is required"),
          name: yup.string().required("Reward name is required"),
          type: yup.string().required("Reward type is required"),
          category: yup.string().required("Reward catalog is required"),
          price: yup.string().required("Reward price is required"),
          stock: yup.string().required("Reward stock is required"),
          pointNeeded: yup.string().required("Point needed is required"),
          ownedQuantity: yup.string().required("Owned quantity is required"),
          startDate: yup.string().required("Start date is required"),
          endDate: yup.string().required("End date is required"),
          quantity: yup.string().notRequired(),
          catalogId: yup.string().required("Catalog id is required"),
        }),
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
