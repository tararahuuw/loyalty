import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  PrimaryButton,
  OutlineButton,
  TextInput,
  DropdownText,
} from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "prezent/useDisclosure";
import ResultModal from "prezent/ResultModal";
import { CreateNewSpecification } from "../../../service/inventoryManagement/endpoint/product";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";

const ModalAddSpecification = ({ isOpen = false, onClose = () => {}, onOpen, loyaltyId, clientId, reRender }) => {
  const cancelButtonRef = useRef(null);

  const {
    isOpen: isLoading,
    open: openIsLoading,
    close: closeIsLoading,
    toggle: toggleIsLoading,
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
      specificationName: "",
      specificationType: "",
    },
    validationSchema: yup.object().shape({
      specificationName: yup
        .string()
        .matches(/^[a-zA-Z0-9. ]+$/, "Specification name only alphanumeric characters, dots, and spaces allowed")
        .min(5, "Specification name must be between 5 and 100 characters")
        .max(100, "Specification name must be between 5 and 100 characters")
        .required("Specification name is required"),
      specificationType: yup.string().required("Specification Type is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleSubmitAddSpecification(values);
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

  async function handleSubmitAddSpecification() {
    try {
      onClose();
      openIsLoading();
      var bodyRequest = {
        name: formik.values.specificationName,
        type: formik.values.specificationType,
        specificationType: "custom",
        companyId: clientId,
      };
      await CreateNewSpecification(bodyRequest);
      handleOpenModalResult("success", `${formik.values.specificationName} has been successfully added.`);
      closeConfirmationIsOpen();
      closeIsLoading();
      formik.resetForm();
      reRender();
    } catch (error) {
      closeIsLoading();
      if (error?.response?.data?.rc === 409) {
        formik.setFieldError("specificationName", `Specification name is already exist`);
        formik.setFieldError("specificationType", `Specification type is already exist`);
      } else {
        handleOpenModalResult(
          "failed",
          `Sorry, unable to added ${formik.values.specificationName} at the moment. Please try again`
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

  const nameError = (formik.touched.specificationName || formik.submitCount > 0) && formik.errors.specificationName;
  const typeError = (formik.touched.specificationType || formik.submitCount > 0) && formik.errors.specificationType;

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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

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
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Create New Specification</p>
                  <p className="cursor-pointer text-xl" onClick={handleCancelButton}>
                    ×
                  </p>
                </div>
                <div className="border-t border-b border-neutral30 py-6 px-6">
                  <div className="mb-4">
                    <div className="mb-4">
                      <TextInput
                        title="Specification Name"
                        placeholder="Input Specification Name"
                        onChangeInput={(e) => {
                          formik.setFieldValue("specificationName", e.target.value);
                          formik.setFieldTouched("specificationName", true, false);
                        }}
                        footer={nameError ? formik.errors.specificationName : null}
                        mode={nameError ? "danger" : "default"}
                        isRequired
                        value={formik.values.specificationName}
                      />
                    </div>

                    <DropdownText
                      title="Specification Type"
                      placeholder="Select Specification Type"
                      options={[
                        { option: "text", value: "text" },
                        { option: "number", value: "number" },
                      ]}
                      isRequired
                      onSelect={(e) => {
                        formik.setFieldValue("specificationType", e.value);
                        formik.setFieldTouched("specificationType", true, false);
                      }}
                      footer={typeError ? formik.errors.specificationType : null}
                      mode={typeError ? "danger" : "default"}
                      currentOption={formik.values.specificationType}
                    />
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

export default ModalAddSpecification;
