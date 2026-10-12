import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import { ModalLoading, ModalResult, Footer, ModalState } from "sprint-asia-custom-component";

import StatusSection from "../../../components/VoucherForm/StatusSection/StatusSection";
import DetailSection from "../../../components/VoucherForm/DetailSection/DetailSection";
import VoucherInformationSection from "../../../components/VoucherForm/VoucherInformationSection/VoucherInformationSection";
import VoucherPhotoSection from "../../../components/VoucherForm/VoucherPhotoSection/VoucherPhotoSection";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import {
  CreateNewVoucher,
  GetAllClient,
  GetAllVoucherCategory,
  GetAllVoucherType,
} from "../../../service/voucherManagement/endpoint/voucherManagement";
import moment from "moment";
import SpecificVoucherPhotoSection from "../../../components/VoucherForm/SpecificVoucherPhotoSection/SpecificVoucherPhotoSection";
import RedeemInformationSection from "../../../components/VoucherForm/RedeemInformationSection/RedeemInformationSection";
import PreviewSection from "../../../components/VoucherForm/PreviewSection/PreviewSection";
import PPNSection from "../../../components/DetailVoucher/PPNSection/PPNSection";

const AddVoucher = ({ roleAccess, setTitleHeader }) => {
  const navigateTo = useNavigate();
  const [redeemInformationIsError, setRedeemInformationIsError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [specificPhotos, setSpecificPhotos] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: types } = useFetch(GetAllVoucherType, "types", [], { roleAccess });

  const handleChangeStatus = () => {
    toggleConfirmationModal();
    setTimeout(() => {
      setIsChecked((prevState) => {
        if (!prevState) {
          return 1;
        } else {
          return 0;
        }
      });
    }, 300);
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

  const handleNavigateToVoucherDashboard = () => {
    navigateTo("/prezent/reward/voucher");
  };

  const submitNewVoucher = async (form) => {
    try {
      toggleLoadingModal();
      const response = await CreateNewVoucher(roleAccess, form);
      if (response.code === 200) {
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Voucher has been successfully created");
          setTimeout(() => {
            handleNavigateToVoucherDashboard();
          }, 4000);
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to create voucher at the moment. Please try again");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      voucherName: "",
      voucherType: "",
      voucherCategory: "",
      priceType: "",
      clientId: "",
      productId: "",
      denom: "",
      activePeriodStartDate: "",
      activePeriodEndDate: "",
      provider: "",
      validityStartDate: "",
      validityEndDate: "",
      description: "",
      howToRedeem: "",
      termAndConditions: "",
      price: 0,
      stock: "",
      voucherPhoto: "",
      redeemType: "",
    },
    validationSchema: yup.object().shape({
      voucherName: yup
        .string()
        .min(5, "Voucher name must be between 5 and 50 characters long")
        .max(50, "Voucher name must be between 5 and 50 characters long")
        .required("Voucher name is required"),
      voucherType: yup.string().required("Voucher type is required"),
      voucherCategory: yup.string().required("Voucher category is required"),
      priceType: yup.string().required("Price type is required"),
      clientId: yup.string().when("voucherType", {
        is: (value) => value === "3",
        then: () => yup.string().required("Client name is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      productId: yup
        .string()
        .min(2, "Product name must be between 2 and 50 characters long")
        .max(50, "Product name must be between 2 and 50 characters long")
        .required("Product name is required"),
      denom: yup.string().required("Denom is required"),
      activePeriodStartDate: yup.string().when("voucherCategory", {
        is: (value) => value === "2.1" || value === "2.2",
        then: () => yup.string().required("Active period is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      activePeriodEndDate: yup.string().when("voucherCategory", {
        is: (value) => value === "2.1" || value === "2.2",
        then: () => yup.string().required("Active period is required").nullable(),
        otherwise: () => yup.string().notRequired(),
      }),
      provider: yup.string().when("voucherCategory", {
        is: (value) => value === "2.1" || value === "2.2",
        then: () => yup.string().required("Provider is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      validityStartDate: yup.string().required("Validity period is required"),
      validityEndDate: yup.string().required("Validity period is required").nullable(),
      description: yup
        .string()
        .min(10, "Description must be between 10 and 2000 characters long")
        .max(2000, "Description must be between 10 and 2000 characters long")
        .required("Description is required"),
      howToRedeem: yup
        .string()
        .min(10, "How to redeem must be between 10 and 2000 characters long")
        .max(2000, "How to redeem must be between 10 and 2000 characters long")
        .required("How to redeem is required"),
      termAndConditions: yup
        .string()
        .min(10, "Terms & condition must be between 10 and 2000 characters long")
        .max(2000, "Terms & condition must be between 10 and 2000 characters long")
        .required("Terms & condition is required"),
      price: yup.number().required("Voucher price is required"),
      stock: yup.string().when("type", {
        is: (value) => value === "2",
        then: () => yup.string().required("Stock is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      voucherPhoto: yup.mixed().required("Photo is required"),
      redeemType: yup.string().required("Redeem type is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append regular form fields
      for (let key in values) {
        if (key === "activePeriodStartDate" || key === "activePeriodEndDate") {
          if (values[key]) {
            formData.append(key, moment.utc(values[key]).format("YYYY-MM-DD HH:mm:ss"));
          } else {
            formData.append(key, values[key]);
          }
        } else if (key === "validityStartDate" || key === "validityEndDate") {
          formData.append(key, moment.utc(values[key]).format("YYYY-MM-DD HH:mm:ss"));
        } else if (key !== "specificPhotos") {
          // Skip specificPhotos for now
          formData.append(key, values[key]);
        }
      }

      // Append specificPhotos array
      if (specificPhotos.length) {
        specificPhotos.forEach((photo, index) => {
          formData.append(`specificVoucherPhotos[${index}][file]`, photo.image);
          formData.append(`specificVoucherPhotos[${index}][clientId]`, photo.clientId);
          formData.append(`specificVoucherPhotos[${index}][clientName]`, photo.clientName);
        });
      }

      formData.append("customField", JSON.stringify(contents));

      // Append isActive field
      formData.append("isActive", isChecked ? 1 : 0);

      // Submit the form data
      submitNewVoucher(formData);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const { data: categories } = useFetch(formik.values.voucherType && GetAllVoucherCategory, "categories", [], {
    roleAccess,
    voucherTypeCode: [formik.values.voucherType],
  });

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      handleNavigateToVoucherDashboard();
    }
  };

  useEffect(() => {
    if (formik.values.voucherType === "2") {
      formik.setFieldValue("redeemType", "ppob");
    }
  }, [formik.values.voucherType]);

  useEffect(() => {
    setTitleHeader("Add Voucher");
  }, []);

  return (
    <>
      <div>
        <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
          {roleAccess !== "Client Administrator" && (
            <StatusSection handleToggle={toggleConfirmationModal} isChecked={isChecked} />
          )}

          <form className="flex flex-col gap-7">
            <VoucherInformationSection
              formik={formik}
              clients={clients}
              types={types}
              categories={categories}
              setSelectedCategoryName={setSelectedCategoryName}
            />

            <DetailSection formik={formik} selectedCategoryName={selectedCategoryName} />

            <PPNSection tax="11" />

            <VoucherPhotoSection formik={formik} />

            <SpecificVoucherPhotoSection clients={clients} photos={specificPhotos} setPhotos={setSpecificPhotos} />

            <div className="grid grid-cols-6 gap-4">
              <div className="md:col-span-4 col-span-6">
                <RedeemInformationSection
                  category={formik.values.voucherCategory}
                  contents={contents}
                  formik={formik}
                  setContents={setContents}
                  setRedeemInformationIsError={setRedeemInformationIsError}
                />
              </div>

              <div className="md:col-span-2 col-span-6">
                <PreviewSection contents={contents} selectedType={formik.values.redeemType} formik={formik} />
              </div>
            </div>
          </form>
        </div>

        <Footer
          modeLeftButton="outline"
          modeRightButton="primary"
          titleLeftButton="Cancel"
          titleRightButton="Submit"
          isActiveLeftButton
          isActiveRightButton
          isActive={!redeemInformationIsError}
          onClickLeftButton={handleCancelButton}
          onClickRightButton={formik.handleSubmit}
        />
      </div>

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />

      <ModalState
        title={`Confirm Voucher ${isChecked ? "Inactivation" : "Activation"}`}
        subtitle={`Are you sure you want to ${
          isChecked ? "deactivate" : "activate"
        } this voucher? This action will pause all related transactions`}
        isOpen={confirmationModalIsOpen}
        onClose={toggleConfirmationModal}
        type={isChecked ? "danger" : "default"}
        titleButtonRight={isChecked ? "Inactive" : "Active"}
        leftAction={toggleConfirmationModal}
        rightAction={handleChangeStatus}
      />
    </>
  );
};

export default AddVoucher;
