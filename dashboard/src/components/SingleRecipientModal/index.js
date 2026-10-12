import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, TextInput, DropdownText, OutlineButton } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";

const SingleRecipientModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Loading...",
  formik,
  currentData,
  isEdited = false,
}) => {
  const cancelButtonRef = useRef(null);

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  const state = useFormik({
    enableReinitialize: true,
    initialValues: {
      recipientName: isEdited ? currentData?.name : "",
      phoneNumber: isEdited ? currentData?.phoneNumber : "",
      email: isEdited ? currentData?.email : "",
      voucherID: isEdited ? currentData?.id : "",
      voucherName: isEdited ? currentData?.voucherName : "",
      checkboxWhatsapp: isEdited ? currentData?.channels.includes("Whatsapp") : false,
      checkboxSMS: isEdited ? currentData?.channels.includes("SMS") : false,
      checkboxEmail: isEdited ? currentData?.channels.includes("Email") : false,
      recipientType: formik.values.recipientType,
    },
    validationSchema: yup.object().shape({
      recipientName: yup
        .string()
        .min(1, "Recipient name must be between 1 and 20 characters long")
        .max(20, "Recipient name must be between 1 and 20 characters long")
        .matches(/^[a-zA-Z0-9]+$/, "Recipient name must contain only alphanumeric characters")
        .required("Recipient name is required"),
      phoneNumber: yup.string().when(["checkboxWhatsapp", "checkboxSMS"], {
        is: (checkboxWhatsapp, checkboxSMS) => checkboxWhatsapp || checkboxSMS,
        then: (schema) =>
          schema
            .required("Phone number is required")
            .matches(/^62/, "The phone number must begin with '62'. Please correct it and try again")
            .min(11, "The number is too short please input min. 11 number")
            .max(14, "The Number too long. Max 14 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),
      email: yup.string().when("checkboxEmail", {
        is: (value) => value === true,
        then: () =>
          yup
            .string()
            .required("Email is required")
            .matches(/^[a-zA-Z0-9]+$/, "Email must contain only alphanumeric characters")
            .email("Wrong email format. please use the right format"),
        otherwise: () => yup.string().notRequired(),
      }),
      voucherID: yup.string().when("recipientType", {
        is: (value) => value === "Specific Voucher",
        then: () => yup.string().required("Voucher is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      voucherName: yup.string().when("recipientType", {
        is: (value) => value === "Specific Voucher",
        then: () => yup.string().required("Voucher is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      checkboxWhatsapp: yup.boolean(),
      checkboxSMS: yup.boolean(),
      checkboxEmail: yup.boolean(),
    }),
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      if (values.checkboxWhatsapp || values.checkboxSMS || values.checkboxEmail) {
        const channels = [
          values.checkboxWhatsapp && "Whatsapp",
          values.checkboxSMS && "SMS",
          values.checkboxEmail && "Email",
        ].filter(Boolean);

        let updatedRecipients = [...formik.values.recipients];

        if (isEdited) {
          updatedRecipients = updatedRecipients.filter((item) => item !== currentData);
          formik.setFieldValue("recipients", updatedRecipients);
        }

        const newRecipient = {
          id: values.voucherID,
          voucherName: values.voucherName,
          name: values.recipientName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          channels: channels,
        };
        const recipientList = [...updatedRecipients, newRecipient];

        formik.setFieldValue("recipients", recipientList);
        resetForm();
        onClose();
      }
    },
  });

  useEffect(() => {
    if (state.values.checkboxEmail === false) {
      state.setFieldValue("email", "");
    }
  }, [state.values.checkboxEmail]);

  useEffect(() => {
    if (state.values.checkboxSMS === false && state.values.checkboxWhatsapp === false) {
      state.setFieldValue("phoneNumber", "");
    }
  }, [state.values.checkboxSMS, state.values.checkboxWhatsapp]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={() => isOpen}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleBackgroundClick} />
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
            <Dialog.Panel className="relative w-full max-w-xl bg-white rounded-lg shadow-xl transition-all">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-3">
                <div className="px-6">
                  <div className="mb-2">
                    <p className="text-md font-semibold">Choose Distribution</p>
                    <p className="text-sm text-neutral300">
                      Select your distribution method. Clients will receive their vouchers via the chosen options.
                    </p>
                  </div>
                  <div className="my-4">
                    <div className="flex items-start mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 mr-2"
                        checked={state.values.checkboxWhatsapp}
                        onChange={() => state.setFieldValue("checkboxWhatsapp", !state.values.checkboxWhatsapp)}
                      />
                      <div>
                        <p className="text-sm font-semibold">Whatsapp</p>
                        <p className="text-xs text-neutral300">
                          Communicate your campaign directly with customers using WhatsApp.
                        </p>
                        {!state.values.checkboxWhatsapp && !state.values.checkboxSMS && !state.values.checkboxEmail && (
                          <p className="text-danger500 text-xs">Please choose at least one distribution method.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 mr-2"
                        checked={state.values.checkboxSMS}
                        onChange={() => state.setFieldValue("checkboxSMS", !state.values.checkboxSMS)}
                      />
                      <div>
                        <p className="text-sm font-semibold">SMS</p>
                        <p className="text-xs text-neutral300">Reach your audience instantly through SMS.</p>
                        {!state.values.checkboxWhatsapp && !state.values.checkboxSMS && !state.values.checkboxEmail && (
                          <p className="text-danger500 text-xs">Please choose at least one distribution method.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 mr-2"
                        checked={state.values.checkboxEmail}
                        onChange={() => state.setFieldValue("checkboxEmail", !state.values.checkboxEmail)}
                      />
                      <div>
                        <p className="text-sm font-semibold">Email</p>
                        <p className="text-xs text-neutral300">Expand your campaign reach with Email.</p>
                        {!state.values.checkboxWhatsapp && !state.values.checkboxSMS && !state.values.checkboxEmail && (
                          <p className="text-danger500 text-xs">Please choose at least one distribution method.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <TextInput
                        title="Recipient Name"
                        placeholder="Input Recipient Name"
                        onChangeInput={(e) => state.setFieldValue("recipientName", e.target.value)}
                        footer={state.errors.recipientName}
                        isRequired
                        mode={state.errors.recipientName ? "danger" : "default"}
                        value={state.values.recipientName}
                      />
                    </div>
                    {(state.values.checkboxSMS || state.values.checkboxWhatsapp) && (
                      <div className="mb-2">
                        <TextInput
                          title="Phone Number"
                          placeholder="Input Phone Number"
                          onChangeInput={(e) => state.setFieldValue("phoneNumber", e.target.value)}
                          footer={state.errors.phoneNumber}
                          type="number"
                          isRequired
                          mode={state.errors.phoneNumber ? "danger" : "default"}
                          value={state.values.phoneNumber}
                        />
                      </div>
                    )}
                    {state.values.checkboxEmail && (
                      <div className="mb-2">
                        <TextInput
                          title="Email"
                          placeholder="Input Email"
                          onChangeInput={(e) => state.setFieldValue("email", e.target.value)}
                          footer={state.errors.email}
                          isRequired
                          mode={state.errors.email ? "danger" : "default"}
                          value={state.values.email}
                        />
                      </div>
                    )}
                    {formik.values.recipientType === "Specific Voucher" && (
                      <div>
                        <DropdownText
                          title="Voucher"
                          placeholder="Select Voucher"
                          options={formik.values.vouchers.map(({ voucherName, id }) => ({
                            option: voucherName,
                            value: id,
                          }))}
                          isRequired
                          onSelect={(e) => {
                            state.setFieldValue("voucherID", e.value);
                            state.setFieldValue("voucherName", e.option);
                          }}
                          currentOption={state.values.voucherID}
                          footer={state.errors.voucherName}
                          mode={state.errors.voucherName ? "danger" : "default"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t border-neutral30 py-3 flex justify-end px-6">
                <div className="mr-3">
                  <OutlineButton title="Cancel" onClick={onClose} />
                </div>
                <PrimaryButton title="Save" onClick={state.handleSubmit} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SingleRecipientModal;
