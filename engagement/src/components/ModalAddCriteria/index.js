import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { OutlineButton, PrimaryButton, TextInput, DropdownText } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import { useDisclosure } from "prezent/useDisclosure";
import * as yup from "yup";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import { CreateNewCriteria } from "../../service/TieringManagement/endpoint/tieringLevel";

const ModalAddCriteria = ({
  isOpen = false,
  handleSubmitModal,
  onClose = () => {},
  onOpen = () => {},
  setReRender,
}) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      type: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Criteria Name is required"),
      type: yup.string().required("Type is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      handleSubmitModal(values);
    },
  });

  async function handleSubmitModal(values) {
    try {
      onClose();
      toggleLoadingModal();
      var bodyReq = {
        criteriaName: values.name,
        criteriaType: values.type,
        isDefault: false,
      };
      await CreateNewCriteria(bodyReq);
      toggleLoadingModal();
      handleOpenModalResult("success", "Criteria has been successfully added");
      formik.resetForm();
      setReRender();
    } catch (error) {
      toggleLoadingModal();
      if (error?.response?.data?.rc === 409) {
        formik.setFieldError("name", "Criteria Name can't be duplicated");
        formik.setFieldError("type", "Type can't be duplicated");
        onOpen();
      } else {
        handleOpenModalResult("failed", "Failed to add criteria. Please try again.");
        setTimeout(() => {
          onOpen();
        }, 3600);
      }
    }
  }
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={onClose}
          static={false}
          style={{ zIndex: 1001 }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={(e) => e.stopPropagation()} />
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
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Create New Criteria</p>
                  <p className="cursor-pointer text-xl" onClick={onClose}>
                    x
                  </p>
                </div>
                <div className="border-t border-b border-neutral30 py-6">
                  <div className="px-6">
                    <div className="w-full mb-4">
                      <TextInput
                        title={"Criteria Name"}
                        placeholder={`Input Criteria Name`}
                        onChangeInput={(e) => {
                          formik.setFieldValue("name", e.target.value);
                          formik.setFieldTouched("name", true, false);
                        }}
                        footer={
                          (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                            ? formik.errors.name
                            : null
                        }
                        mode={
                          (formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "white"
                        }
                        isRequired
                        value={formik.values.name}
                      />
                    </div>
                    <DropdownText
                      title="Type"
                      placeholder="Choose Type"
                      options={[
                        {
                          option: "Progressive",
                          value: "Progressive",
                        },
                        {
                          option: "Accumulation",
                          value: "Accumulation",
                        },
                      ]}
                      isRequired
                      onSelect={(e) => {
                        formik.setFieldValue("type", e.option);
                        formik.setFieldTouched("type", true, false);
                      }}
                      currentOption={formik.values.type}
                      footer={
                        (formik.touched.type || formik.submitCount > 0) && formik.errors.type
                          ? formik.errors.type
                          : null
                      }
                      mode={(formik.touched.type || formik.submitCount > 0) && formik.errors.type ? "danger" : "white"}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                  <div className="my-3">
                    <div className="ml-2">
                      <PrimaryButton title="Submit" type="wrap" size="large" onClick={formik.handleSubmit} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <OutlineButton title="Cancel" type="full" size="large" onClick={onClose} />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />
      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
    </>
  );
};

export default ModalAddCriteria;
