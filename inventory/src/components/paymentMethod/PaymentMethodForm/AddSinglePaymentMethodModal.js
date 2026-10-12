import React, { useRef, Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { ModalState, OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import StatusSection from "../../shared/StatusSection";
import ModalBasicInformationSection from "./ModalBasicInformationSection";
import AddressInformationSection from "./AddressInformationSection";
import { useFormik } from "formik";
import * as yup from "yup";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { GetAllCity, GetAllDistrict, GetAllProvince } from "../../../service/inventoryManagement/endpoint/store";
import ConfirmationModal from "../../shared/ConfirmationModal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { customList } from "country-codes-list";

const AddSinglePaymentMethodModal = ({
  isOpen,
  onClose,
  parentFormik,
  selectedPaymentMethod,
  roleAccess,
  onSubmit,
  setSelectedPaymentMethod = () => {},
}) => {
  const cancelButtonRef = useRef(null);
  const [isChecked, setIsChecked] = useState(true);
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const isAddMode = !selectedPaymentMethod;

  const openConfirmationModal = () => setConfirmationModalIsOpen(true);
  const closeConfirmationModal = () => setConfirmationModalIsOpen(false);

  const handleCancelClick = () => {
    openConfirmationModal();
  };

  const handleConfirmCancel = () => {
    closeConfirmationModal();

    if (isAddMode) {
      formik.resetForm();
      setSelectedPaymentMethod(null);
    }

    onClose();
  };

  const handleBackCancel = () => {
    closeConfirmationModal();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      payments: [
        {
          paymentID: selectedPaymentMethod?.paymentID || "",
          paymentName: selectedPaymentMethod?.paymentName || "",
        },
      ],
      status: selectedPaymentMethod?.status || "active",
    },
    validationSchema: yup.object().shape({
      payments: yup.array().of(
        yup.object().shape({
          paymentID: yup
            .string()
            .matches(/^[A-Za-z0-9\-_]+$/, "Payment ID cannot contain special characters")
            .min(5, "Payment ID must be at least 5 characters")
            .max(30, "Payment ID cannot be more than 30 characters")
            .required("Payment ID is required"),
          paymentName: yup
            .string()
            .matches(/^[A-Za-z0-9\s.,\-&']+$/, "Payment Name contains invalid characters")
            .min(3, "Payment Name must be at least 3 characters")
            .max(50, "Payment Name cannot be more than 50 characters")
            .required("Payment Name is required"),
        })
      ),
      status: yup.string().required("Status is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const payment = values.payments[0];

      const payload = !selectedPaymentMethod
        ? {
            ...values,
            status: isChecked ? "active" : "inactive",
          }
        : {
            id: selectedPaymentMethod?.id,
            loyaltyID: selectedPaymentMethod?.loyaltyID,
            paymentID: payment.paymentID,
            paymentName: payment.paymentName,
            status: isChecked ? "active" : "inactive",
          };

      onSubmit(payload, resetForm);
    },
  });

  const handleToggle = () => {
    setIsChecked((prevState) => {
      const newStatus = !prevState;
      formik.setFieldValue("status", newStatus ? "active" : "inactive");
      return newStatus;
    });
  };

  useEffect(() => {
    if (selectedPaymentMethod) {
      setIsChecked(selectedPaymentMethod.status === "Active" ? true : false);
    }
  }, [selectedPaymentMethod?.status]);

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={handleCancelClick}
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
                  <p className="cursor-pointer text-xl" onClick={handleCancelClick}>
                    <X size={24} />
                  </p>
                </div>

                <div className="flex flex-col px-6 py-3 gap-10">
                  <ModalBasicInformationSection formik={formik} isAddMode={isAddMode} />
                  <StatusSection handleToggle={handleToggle} isChecked={isChecked} itemName="Payment Method" />
                </div>

                <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                  <OutlineButton title="Cancel" onClick={handleCancelClick} />
                  <PrimaryButton title="Submit" onClick={formik.handleSubmit} />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        onClick={handleConfirmCancel}
        onClose={handleBackCancel}
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
      />
    </>
  );
};

export default AddSinglePaymentMethodModal;
