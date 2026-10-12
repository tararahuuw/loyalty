import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import { ModalLoading, ModalResult, Footer, ModalState, DangerButton } from "sprint-asia-custom-component";

import StatusSection from "../../../components/VoucherForm/StatusSection/StatusSection";
import DetailSection from "../../../components/VoucherForm/DetailSection/DetailSection";
import VoucherInformationSection from "../../../components/VoucherForm/VoucherInformationSection/VoucherInformationSection";
import VoucherPhotoSection from "../../../components/VoucherForm/VoucherPhotoSection/VoucherPhotoSection";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import {
  ChangeVoucherStatus,
  DeleteVoucher,
  EditVoucher as EditVoucherService,
  GetAllClient,
  GetAllVoucherCategory,
  GetAllVoucherType,
  GetVoucherById,
} from "../../../service/voucherManagement/endpoint/voucherManagement";
import moment from "moment";
import SpecificVoucherPhotoSection from "../../../components/VoucherForm/SpecificVoucherPhotoSection/SpecificVoucherPhotoSection";
import RedeemInformationSection from "../../../components/VoucherForm/RedeemInformationSection/RedeemInformationSection";
import PreviewSection from "../../../components/VoucherForm/PreviewSection/PreviewSection";
import PPNSection from "../../../components/DetailVoucher/PPNSection/PPNSection";
import { Trash } from "@phosphor-icons/react";

const EditVoucher = ({ roleAccess, setTitleHeader }) => {
  const navigateTo = useNavigate();
  const { id } = useParams();
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
  const { isOpen: confirmationCancelIsOpen, toggle: toggleConfirmationCancel } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { data: voucher, refetch } = useFetch(GetVoucherById, "voucher", [], { roleAccess, voucherId: id });
  const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: types } = useFetch(GetAllVoucherType, "types", [], { roleAccess });

  const handleChangeStatus = async () => {
    try {
      toggleLoadingModal();
      const response = await ChangeVoucherStatus(roleAccess, { voucherId: id, status: !isChecked });
      if (response.code === 200) {
        toggleConfirmationModal();
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Changes have been successfully saved.");
        }, 250);
        setTimeout(() => {
          setIsChecked((prevState) => {
            if (!prevState) {
              return 1;
            } else {
              return 0;
            }
          });
        }, 300);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to save the changes. Please try again");
    }
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

  const handleDeleteVoucher = async () => {
    try {
      toggleLoadingModal();
      await DeleteVoucher(id);
      toggleDeleteModal();
      toggleLoadingModal();
      handleOpenModalResult("success", "Voucher has been successfully deleted.");
      setTimeout(() => {
        handleNavigateToVoucherDashboard();
      }, 4000);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to delete voucher at the moment. Please try again");
    }
  };

  const SubmitVoucher = async (form) => {
    try {
      toggleLoadingModal();
      const response = await EditVoucherService(roleAccess, form);
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
      handleOpenModalResult("failed", "Sorry, we are unable to submit voucher at the moment. Please try again");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      voucherName: voucher?.data?.voucherName || "",
      voucherType: voucher?.data?.voucherTypeId || "",
      voucherCategoryName: voucher?.data?.voucherCategory || "",
      voucherCategory: voucher?.data?.voucherCategoryId || "",
      priceType: voucher?.data?.priceType || "",
      clientId: voucher?.data?.clientId || "",
      productId: voucher?.data?.productId || "",
      denom: voucher?.data?.denom || "",
      activePeriodStartDate: voucher?.data?.activePeriodStartDate || "",
      activePeriodEndDate: voucher?.data?.activePeriodEndDate || "",
      provider: voucher?.data?.provider || "",
      validityStartDate: voucher?.data?.validityStartDate || "",
      validityEndDate: voucher?.data?.validityEndDate || "",
      description: voucher?.data?.description || "",
      howToRedeem: voucher?.data?.howToRedeem || "",
      termAndConditions: voucher?.data?.termAndConditions || "",
      price: voucher?.data?.price || 0,
      stock: voucher?.data?.stock || "",
      voucherPhoto: voucher?.data?.voucherPhoto || "",
      redeemType: voucher?.data?.redeemType || "",
    },
    validationSchema: yup.object().shape({
      voucherName: yup
        .string()
        .min(5, "Voucher name must be between 5 and 50 characters long")
        .max(50, "Voucher name must be between 5 and 50 characters long")
        .required("Voucher name is required"),
      voucherType: yup.string().required("Voucher type is required"),
      voucherCategoryName: yup.string(),
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
      voucherPhoto: yup.mixed(),
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
        } else if (key !== "specificPhotos" && key !== "voucherPhoto") {
          // Skip voucherPhoto here
          formData.append(key, values[key]);
        }
      }

      // Append voucherPhoto only if it has changed
      if (values.voucherPhoto !== formik.initialValues.voucherPhoto) {
        formData.append("voucherPhoto", values.voucherPhoto);
      }

      // Append specificPhotos array
      if (specificPhotos.length) {
        let newPhotoIndex = 0; // Start index for new photos
        specificPhotos.forEach((photo) => {
          if (typeof photo.image !== "string") {
            formData.append(`specificVoucherPhotos[${newPhotoIndex}][file]`, photo.image);
            formData.append(`specificVoucherPhotos[${newPhotoIndex}][clientId]`, photo.clientId);
            formData.append(`specificVoucherPhotos[${newPhotoIndex}][clientName]`, photo.clientName);
            newPhotoIndex++; // Increment index only for new photos
          }
        });
      }

      formData.append("customField", JSON.stringify(contents));
      formData.append("id", id);

      // Append isActive field
      formData.append("isActive", isChecked ? 1 : 0);

      // Submit the form data
      SubmitVoucher(formData);
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
      toggleConfirmationCancel();
    } else {
      handleNavigateToVoucherDashboard();
    }
  };

  useEffect(() => {
    setTitleHeader("Edit Voucher");
  }, []);

  useEffect(() => {
    setIsChecked(voucher?.data?.isActive);
  }, [voucher?.data?.isActive]);

  useEffect(() => {
    if (voucher?.data?.customField) {
      setContents(JSON.parse(voucher.data.customField));
    }
  }, [voucher?.data?.customField]);

  useEffect(() => {
    if (voucher?.data?.specificVoucherPhotos?.length) {
      const transformedImage = voucher.data.specificVoucherPhotos.map((photo) => ({
        clientId: photo.clientId,
        clientName: photo.clientName,
        image: photo.specificVoucherPhotoUrl,
        voucherId: photo.voucherId,
      }));

      setSpecificPhotos(transformedImage);
    } else {
      setSpecificPhotos([]);
    }
  }, [voucher?.data?.specificVoucherPhotos]);

  useEffect(() => {
    if (formik.values.voucherType === "2") {
      formik.setFieldValue("redeemType", "ppob");
    }
  }, [formik.values.voucherType]);

  useEffect(() => {
    setSelectedCategoryName(voucher?.data?.voucherCategory);
  }, [voucher?.data?.voucherCategory]);

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
              editable={isChecked}
              voucherId={id}
              setSelectedCategoryName={setSelectedCategoryName}
            />

            <DetailSection
              formik={formik}
              editable={isChecked}
              selectedCategoryName={selectedCategoryName}
              voucherId={id}
            />

            <PPNSection tax="11" />

            <VoucherPhotoSection formik={formik} />

            <SpecificVoucherPhotoSection
              clients={clients}
              photos={specificPhotos}
              refetchVoucher={refetch}
              roleAccess={roleAccess}
              setPhotos={setSpecificPhotos}
            />

            <div className="grid grid-cols-6 gap-4">
              <div className="md:col-span-4 col-span-6">
                <RedeemInformationSection
                  category={formik.values.voucherCategory}
                  contents={contents}
                  formik={formik}
                  editable={isChecked}
                  voucherId={id}
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
          additionalButton={
            <DangerButton
              isActive={!isChecked}
              onClick={toggleDeleteModal}
              title={
                <div className="flex items-center gap-1">
                  <Trash />
                  <span>Delete</span>
                </div>
              }
            />
          }
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

      <ModalState
        title="Delete Voucher?"
        subtitle="Are you sure you want to delete this Voucher?"
        isOpen={deleteModalIsOpen}
        onClose={toggleDeleteModal}
        type="danger"
        titleButtonRight="Delete"
        leftAction={toggleDeleteModal}
        rightAction={handleDeleteVoucher}
      />

      <ModalState
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationCancelIsOpen}
        onClose={toggleConfirmationCancel}
        type="default"
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleConfirmationCancel}
        rightAction={handleNavigateToVoucherDashboard}
      />
    </>
  );
};

export default EditVoucher;
