import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import { Footer, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import PhoneLayout from "prezent/PhoneLayout";
import VoucherInformationSection from "../../../components/TemplateForm/VoucherInformationSection/VoucherInformationSection";
import VoucherMessagesSection from "../../../components/TemplateForm/VoucherMessagesSection/VoucherMessagesSection";
import { useFetch } from "prezent/useFetch";
import { GetAllClient, GetAllDivisionByClientId } from "../../../service/voucherManagement/endpoint/voucherManagement";
import { useDisclosure } from "prezent/useDisclosure";
import {
  EditTemplate as EditTemplateService,
  GetClientById,
  GetTemplateById,
} from "../../../service/voucherManagement/endpoint/voucherTemplate";
import moment from "moment";

const EditTemplate = ({ roleAccess, setTitleHeader, clientId }) => {
  const navigateTo = useNavigate();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [type, setType] = useState("manual");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { data: template } = useFetch(GetTemplateById, "template", [], { roleAccess, templateId: id });
  const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: client } = useFetch(GetClientById, "client", [], { roleAccess, clientId });

  const handleNavigateToTemplateDashboard = () => {
    navigateTo("/prezent/reward/template");
  };

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 3500);
    }, 250);
  };

  const submitTemplate = async (form) => {
    try {
      toggleLoadingModal();
      const response = await EditTemplateService(roleAccess, form);
      if (response.code === 200) {
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Template voucher has been successfully edited.");
          setTimeout(() => {
            handleNavigateToTemplateDashboard();
          }, 4000);
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      if (error?.response?.data?.code === 409) {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to edited template at the moment. The template is currently being used for an active voucher."
        );
      } else {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to edited template at the moment. Please refresh the page and try again"
        );
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      background: template?.data?.background || "",
      templateVoucherPhoto: template?.data?.templateVoucherPhoto || "",
      templateName: template?.data?.templateName || "",
      clientId: template?.data?.clientId || "",
      divisionId: template?.data?.divisionId || "",
      messageTitle: template?.data?.messageTitle || "-",
      messageDescription: template?.data?.messageDescription || "-",
      theme: template?.data?.theme || "",
      language: template?.data?.language || "english",
    },
    validationSchema: yup.object().shape({
      background: yup.string().required("Voucher background is required"),
      templateVoucherPhoto: yup.mixed(),
      templateName: yup.string().when("background", {
        is: (value) => value === "solid_color",
        then: () => yup.string().required("Color is required"),
        otherwise: () => yup.string().required("Template name is required"),
      }),
      clientId: yup.string().required("Client is required"),
      divisionId: yup.string().required("Division is required"),
      messageTitle: yup
        .string()
        .min(10, "Message title must be between 10 and 50 characters long")
        .max(50, "Message title must be between 10 and 50 characters long")
        .required("Message title is required"),
      messageDescription: yup
        .string()
        .min(10, "Message must be between 10 and 150 characters long")
        .max(150, "Message must be between 10 and 150 characters long")
        .required("Messages is required"),
      theme: yup.string(),
      language: yup.string().required("Language is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      for (let key in values) {
        if (key === "templateVoucherPhoto") {
          if (formik.values.background === "upload_image" && values[key]) {
            if (values[key] !== formik.initialValues.templateVoucherPhoto) {
              formData.append(key, values[key]);
            }
          }
        } else {
          formData.append(key, values[key]);
        }
      }
      formData.append("id", id);
      submitTemplate(formData);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const { data: divisions } = useFetch(formik.values.clientId && GetAllDivisionByClientId, "divisions", [], {
    clientId: formik.values.clientId,
  });

  const handleCancelButton = () => {
    handleNavigateToTemplateDashboard();
  };

  useEffect(() => {
    if (formik.values.theme) {
      setType("template");
    }
  }, [formik.values.theme]);

  // Reset states when user change background type
  useEffect(() => {
    if (formik.initialValues.templateName[0] === "#" && formik.initialValues.background === "solid_color") {
      if (formik.values.background === "solid_color") {
        formik.setFieldValue("templateVoucherPhoto", formik.initialValues.templateVoucherPhoto);
        setImageUrl(null);
        formik.setFieldValue("templateName", formik.initialValues.templateName);
      } else {
        formik.setFieldValue("templateName", "");
      }
    } else {
      if (formik.values.background === "solid_color") {
        formik.setFieldValue("templateVoucherPhoto", formik.initialValues.templateVoucherPhoto);
        setImageUrl(null);
        formik.setFieldValue("templateName", "#e5e5e5");
      } else {
        formik.setFieldValue("templateName", formik.initialValues.templateName);
      }
    }
  }, [formik.values.background, formik.initialValues.templateName]);

  useEffect(() => {
    setTitleHeader("Edit Template Voucher");
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
        <div className="flex flex-row flex-wrap gap-6">
          <form className="w-2/3 flex flex-col gap-7">
            <VoucherInformationSection
              formik={formik}
              setImageUrl={setImageUrl}
              clients={clients}
              divisions={divisions}
            />

            <VoucherMessagesSection formik={formik} type={type} setType={setType} />
          </form>

          <div className="flex flex-col gap-7 bg-white rounded-lg border border-neutral40 shadow-md p-6 flex-1">
            <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
              Voucher Preview
            </div>

            <div className="flex justify-center">
              <PhoneLayout
                mode="Voucher"
                data={{
                  productName: "Voucher MAP 100.000",
                  orderNumber: "1234567890",
                  validDate: moment().format("DD MMMM YYYY"),
                  voucherDescription:
                    "MAP Gift Voucher is the official gift voucher of PT Mitra Adiperkasa Tbk. Accepted in2 retail stores managed under MAP Group Indonesia, with a wide range of product brands. It is a perfect gift for Birthdays, Annivesaries, Valentines, Holidays, Festivals",
                  voucherBackgroundType: formik.values.background === "upload_image" ? "image" : "color",
                  voucherBackground:
                    formik.values.background === "upload_image"
                      ? typeof formik.values.templateVoucherPhoto === "string"
                        ? `${process.env.REACT_APP_API_URL}/template_voucher/${formik.values.templateVoucherPhoto}`
                        : imageUrl
                      : formik.values.templateName || "#e5e5e5", // default color or placeholder
                  messageTitle: formik.values.messageTitle,
                  message: formik.values.messageDescription,
                  howToRedeem: "This is how to redeem",
                  terms: "This is terms and conditions",
                  clientLogo: "",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={handleCancelButton}
        onClickRightButton={formik.handleSubmit}
      />

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default EditTemplate;
