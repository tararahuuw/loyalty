import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton, TextInput } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import TextArea from "prezent/TextArea";
import { useDisclosure } from "prezent/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";

const AddPaymentMethodModal = ({ isOpen, onClose, parentFormik, selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);

  const handleToggleConfirmationModal = () => {
    onClose();
    toggleConfirmationModal();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: selectedPaymentMethod?.code || "",
      name: selectedPaymentMethod?.name || "",
      description: selectedPaymentMethod?.description || "",
    },
    validationSchema: yup.object().shape({
      code: yup
        .string()
        .matches(
          /^[A-Za-z0-9_-]+$/,
          "Code can only contain letters, numbers, hyphens (-), and underscores (_), no spaces"
        )
        .min(5, "Code must be at least 5 characters")
        .max(30, "Code cannot be more than 30 characters")
        .required("Payment ID is required"),
      name: yup
        .string()
        .matches(/^[A-Za-z0-9 .\-&']+$/, "Name can only contain letters, numbers, spaces, and symbols: - . & '")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot be more than 50 characters")
        .required("Payment Name is required"),
      description: yup
        .string()
        .matches(/^[A-Za-z0-9 .,:;\/'"()\-]+$/, "Description contains invalid characters")
        .min(10, "Description must be at least 10 characters")
        .max(255, "Description cannot be more than 255 characters")
        .required("Description is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const isEditMode = Boolean(selectedPaymentMethod);

      // Check if code exists in another payment method (excluding the one being edited)
      const isCodeExists = parentFormik.values.paymentMethods.some((method) => {
        if (isEditMode && method.code === selectedPaymentMethod.code) {
          return false;
        }
        return method.code === values.code;
      });

      if (isCodeExists) {
        formik.setFieldError("code", "Payment ID already exists.");
        return;
      }

      if (isEditMode) {
        const updatedPaymentMethods = parentFormik.values.paymentMethods.map((method) =>
          method.code === selectedPaymentMethod.code ? { ...selectedPaymentMethod, ...values } : method
        );
        parentFormik.setFieldValue("paymentMethods", updatedPaymentMethods);
      } else {
        const updatedPaymentMethods = [{ ...values }, ...parentFormik.values.paymentMethods];
        parentFormik.setFieldValue("paymentMethods", updatedPaymentMethods);
      }

      resetForm();
      onClose();
    },
  });

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={() => {
            if (formik.dirty) {
              handleToggleConfirmationModal();
            } else {
              onClose();
              setSelectedPaymentMethod(null);
              formik.resetForm();
            }
          }}
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
              <Dialog.Panel className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl py-3 flex flex-col gap-4">
                <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
                  <p className="font-semibold text-xl text-black">
                    {!selectedPaymentMethod ? "Add Payment Method" : "Edit Payment Method"}
                  </p>
                  <p
                    className="cursor-pointer text-xl"
                    onClick={() => {
                      if (formik.dirty) {
                        handleToggleConfirmationModal();
                      } else {
                        onClose();
                        setSelectedPaymentMethod(null);
                        formik.resetForm();
                      }
                    }}
                  >
                    <X size={24} />
                  </p>
                </div>

                <div className="flex flex-col gap-3 px-6 py-3">
                  <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
                    Basic Information
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      title="Payment ID"
                      placeholder="Input Payment ID"
                      onChangeInput={(e) => {
                        formik.setFieldValue("code", e.target.value);
                        formik.setFieldTouched("code", true, false);
                      }}
                      isRequired
                      footer={
                        (formik.touched.code || formik.submitCount > 0) && formik.errors.code
                          ? formik.errors.code
                          : null
                      }
                      mode={
                        (formik.touched.code || formik.submitCount > 0) && formik.errors.code ? "danger" : "default"
                      }
                      value={formik.values.code}
                    />

                    <TextInput
                      title="Payment Name"
                      placeholder="Input Payment Name"
                      onChangeInput={(e) => {
                        formik.setFieldValue("name", e.target.value);
                        formik.setFieldTouched("name", true, false);
                      }}
                      isRequired
                      footer={
                        (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                          ? formik.errors.name
                          : null
                      }
                      mode={
                        (formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"
                      }
                      value={formik.values.name}
                    />

                    <div className="col-span-2">
                      <TextArea
                        title="Description"
                        isRequired
                        placeholder="Input Description"
                        lengthChecker={false}
                        footer={
                          (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                            ? formik.errors.description
                            : null
                        }
                        mode={
                          (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.description}
                        onChange={(e) => {
                          formik.setFieldValue("description", e.target.value);
                          formik.setFieldTouched("description", true, false);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                  <OutlineButton
                    title="Cancel"
                    onClick={() => {
                      if (formik.dirty) {
                        handleToggleConfirmationModal();
                      } else {
                        onClose();
                        setSelectedPaymentMethod(null);
                        formik.resetForm();
                      }
                    }}
                  />
                  <PrimaryButton title="Submit" onClick={formik.handleSubmit} />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        onClick={() => {
          toggleConfirmationModal();
          formik.resetForm();
          setSelectedPaymentMethod(null);
        }}
        onClose={handleToggleConfirmationModal}
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        title="Do you want to cancel?"
      />
    </>
  );
};

export default AddPaymentMethodModal;
