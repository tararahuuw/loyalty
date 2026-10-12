import React, { Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { OutlineButton, PrimaryButton, TextInput, Switch } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import ResultModal from "prezent/ResultModal";
import { Trash } from "@phosphor-icons/react";
import { EditItemCustom, CreateNewItemSpecification } from "../../../service/inventoryManagement/endpoint/product";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";

const ModalAddItemSpecification = ({
  isOpen = false,
  onClose = () => {},
  onOpen,
  loyaltyId,
  clientId,
  currentData,
  titleParent,
  reRender,
  type,
  specificationId,
}) => {
  const cancelButtonRef = useRef(null);
  const {
    isOpen: isLoading,
    toggle: toggleIsLoading,
    open: openIsLoading,
    close: closeIsLoading,
  } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const {
    isOpen: confirmationIsOpen,
    open: openConfirmationIsOpen,
    close: closeConfirmationIsOpen,
  } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      specificationType: currentData?.specificationType || "text",
      itemName: currentData?.name || "",
      itemStatus: String(currentData?.status).toLowerCase() === "inactive" ? false : true,
      unit: currentData?.unit || "",
      size: "",
      sizes: currentData?.size || [],
      sizesBucket: currentData?.size || [],
      type: type,
    },
    validationSchema: yup.object().shape({
      itemName: yup
        .string()
        .min(5, `${titleParent} name must be between 5 and 100 characters`)
        .max(100, `${titleParent} name must be between 5 and 100 characters`)
        .required(`${titleParent} name is required`),
      unit: yup.string().when("type", {
        is: "number",
        then: () =>
          yup
            .string()
            .matches(/^[a-zA-Z0-9. ]+$/, "Only letters, numbers, dots, and spaces allowed")
            .min(5, "Unit must be between 5 and 100 characters")
            .max(100, "Unit must be between 5 and 100 characters")
            .required("Unit is required"),
        otherwise: () => yup.string().notRequired(),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (values.type === "number") {
        if (values.sizes.length > 0) {
          handleSubmitAddItemSpecification(values);
        }
      } else {
        handleSubmitAddItemSpecification(values);
      }
    },
  });

  function handleCancelButton() {
    if (formik.dirty) {
      onClose();
      openConfirmationIsOpen();
    } else {
      handleCloseModal();
    }
  }

  function handleCloseModal() {
    onClose();
    closeConfirmationIsOpen();
    formik.resetForm();
  }

  async function handleSubmitAddItemSpecification() {
    try {
      onClose();
      openIsLoading();
      var bodyRequest = {};
      if (type === "text") {
        bodyRequest = {
          name: formik.values.itemName,
          status: formik.values.itemStatus ? "Active" : "Inactive",
          loyaltyId: loyaltyId,
          specificationId: specificationId,
          companyId: clientId,
        };
        if (currentData) {
          await EditItemCustom(currentData.id, bodyRequest);
        } else {
          await CreateNewItemSpecification(bodyRequest);
        }
      }

      if (type === "number") {
        bodyRequest = {
          name: formik.values.itemName,
          unit: formik.values.unit,
          size: formik.values.sizes,
          status: formik.values.itemStatus ? "Active" : "Inactive",
          specificationId: specificationId,
          companyId: clientId,
        };
        if (formik.values.sizes.length > 0) {
          if (currentData) {
            await EditItemCustom(currentData.id, bodyRequest);
          } else {
            await CreateNewItemSpecification(bodyRequest);
          }
        }
      }
      handleOpenModalResult("success", `${titleParent} has been successfully ${currentData ? "edited" : "added"}.`);
      handleCloseModal();
      closeIsLoading();
      reRender();
    } catch (error) {
      closeIsLoading();
      if (error?.response?.data?.rc === 409) {
        if (type === "text") {
          formik.setFieldError("itemName", `${titleParent} name is already exist`);
        } else {
          formik.setFieldError("itemName", `${titleParent} label name is already exist`);
          formik.setFieldError("unit", `${titleParent} unit is already exist`);
        }
      } else {
        handleOpenModalResult(
          "failed",
          `Sorry, unable to ${currentData ? "editing" : "adding"} ${titleParent} at the moment. Please try again`
        );
      }
      onOpen();
    }
  }

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1000);
    }, 250);
  };

  function handleCloseConfirmationModal() {
    closeConfirmationIsOpen();
    onOpen();
  }

  const handleAddSize = () => {
    const size = formik.values.size.trim();

    // Cek jika size tidak kosong dan belum ada di list
    const isAlreadyAdded = formik.values.sizes.some((s) => s.name === size);

    if (size && !isAlreadyAdded) {
      // Cari apakah size ini ada di bucket
      const matchedBucket = formik.values.sizesBucket.find(
        (bucket) => bucket.name.toLowerCase() === size.toLowerCase()
      );

      const newSizeObj = matchedBucket ? { id: matchedBucket.id, name: matchedBucket.name } : { id: "", name: size };

      const newSizes = [...formik.values.sizes, newSizeObj];

      formik.setFieldValue("sizes", newSizes);
      formik.setFieldValue("size", "");
    }
  };

  const handleDeleteSize = (index) => {
    const newSizes = [...formik.values.sizes];
    newSizes.splice(index, 1);
    formik.setFieldValue("sizes", newSizes);
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
          style={{ zIndex: 1001 }}
        >
          <div className="min-h-screen flex items-center justify-center px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg">
                {/* Header */}
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">
                    {currentData ? "Edit " : "Add "}
                    {titleParent}
                  </p>
                  <p className="cursor-pointer text-xl" onClick={handleCancelButton}>
                    ×
                  </p>
                </div>
                {/* Form Body */}
                <div className="border-t border-b border-neutral30 py-6 px-6">
                  <div className="mb-4">
                    {type === "text" ? (
                      <TextInput
                        title={`${titleParent} Name`}
                        placeholder={`Input ${titleParent} Name`}
                        onChangeInput={(e) => {
                          formik.setFieldValue("itemName", e.target.value);
                          formik.setFieldTouched("itemName", true, false);
                        }}
                        footer={(formik.touched.itemName || formik.submitCount > 0) && formik.errors.itemName}
                        mode={
                          (formik.touched.itemName || formik.submitCount > 0) && formik.errors.itemName
                            ? "danger"
                            : "default"
                        }
                        isRequired
                        value={formik.values.itemName}
                      />
                    ) : (
                      <div>
                        <TextInput
                          title={`Label Name`}
                          placeholder={`Input Label Name`}
                          onChangeInput={(e) => {
                            formik.setFieldValue("itemName", e.target.value);
                            formik.setFieldTouched("itemName", true, false);
                          }}
                          footer={(formik.touched.itemName || formik.submitCount > 0) && formik.errors.itemName}
                          mode={
                            (formik.touched.itemName || formik.submitCount > 0) && formik.errors.itemName
                              ? "danger"
                              : "default"
                          }
                          isRequired
                          value={formik.values.itemName}
                        />
                        <div className="py-4">
                          <TextInput
                            title="Unit"
                            placeholder="Input Unit"
                            onChangeInput={(e) => {
                              formik.setFieldValue("unit", e.target.value);
                              formik.setFieldTouched("unit", true, false);
                            }}
                            footer={(formik.touched.unit || formik.submitCount > 0) && formik.errors.unit}
                            mode={
                              (formik.touched.unit || formik.submitCount > 0) && formik.errors.unit
                                ? "danger"
                                : "default"
                            }
                            isRequired
                            value={formik.values.unit}
                          />
                        </div>
                        <div className="flex items-center">
                          <TextInput
                            title="Size"
                            placeholder="Input Size"
                            onChangeInput={(e) => formik.setFieldValue("size", e.target.value)}
                            footer={
                              formik.values.sizes.length === 0 && formik.submitCount > 0 ? "Size is required" : null
                            }
                            mode={formik.values.sizes.length === 0 && formik.submitCount > 0 ? "danger" : "default"}
                            isRequired
                            value={formik.values.size}
                          />
                          <div
                            className={`ml-2 ${
                              formik.values.sizes.length === 0 && formik.submitCount > 0 ? "" : "mt-6"
                            }`}
                          >
                            <PrimaryButton
                              title="Add"
                              type="wrap"
                              onClick={handleAddSize}
                              isActive={formik.values.size}
                            />
                          </div>
                        </div>

                        {/* List of sizes */}
                        <div className="mt-4">
                          {type === "number" &&
                            formik.values?.sizes.map((value, index) => (
                              <div
                                key={index}
                                className="p-4 flex items-center justify-between my-2 bg-neutral20 rounded-lg"
                              >
                                <p>{value.name}</p>
                                <Trash
                                  className="text-danger500 cursor-pointer"
                                  size={20}
                                  onClick={() => handleDeleteSize(index)}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Status Toggle */}
                    <div className="mt-2">
                      <p className="font-semibold py-3">Status</p>
                      <hr className="w-full text-neutral40 mb-2" />
                      <div className="flex items-center justify-between mb-2">
                        <p>Activate your {titleParent}</p>
                        <Switch
                          onChange={() => formik.setFieldValue("itemStatus", !formik.values.itemStatus)}
                          checked={formik.values.itemStatus}
                          isEdit
                        />
                      </div>
                      <p className="text-sm text-neutral80">
                        when you disable the toggle, your {titleParent} will be inactive and cannot be used as a
                        parameter in the campaign.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse py-3">
                  <div className="sm:ml-2 mb-2 sm:mb-0">
                    <PrimaryButton title={"Submit"} type="wrap" onClick={formik.handleSubmit} />
                  </div>
                  <div>
                    <OutlineButton title={"Cancel"} type="full" onClick={handleCancelButton} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} onClose={() => {}} />
      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />
      <StateModal
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationIsOpen}
        onClose={handleCloseConfirmationModal}
        titleButtonLeft="Back"
        titleButtonRight="Close"
        leftAction={handleCloseConfirmationModal}
        rightAction={handleCloseModal}
      />
    </>
  );
};

export default ModalAddItemSpecification;
