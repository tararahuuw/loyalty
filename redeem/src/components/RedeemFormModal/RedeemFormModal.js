import React, { useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Info } from "@phosphor-icons/react";
import { PrimaryButton, TextInput } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import DropdownPhone from "prezent/DropdownPhone";

const RedeemFormModal = ({
  isOpen,
  onClose,
  voucherType,
  voucherCategory,
  errorReason,
  handleRedeem,
  generatedReward,
}) => {
  const cancelButtonRef = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      meterNumber: "",
      dropdownCountryStore: {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
      phoneNumber: "",
      storeCode: "",
      captcha: "",
    },
    validationSchema: yup.object().shape({
      meterNumber:
        voucherCategory === "PLN"
          ? yup.string().required("Please complete this required field to continue.")
          : yup.string().notRequired(),
      phoneNumber:
        voucherCategory === "Data Package" ||
        voucherCategory === "Paket Data" ||
        voucherCategory === "E-wallet" ||
        voucherCategory === "Pulsa"
          ? yup
              .string()
              .required("Phone Number is required")
              .min(8, "Phone Number is too short (min. 8 digit & max. 15 digit)")
              .max(15, "Phone number is too long (min. 8 digit & max. 15 digit)")
          : yup.string().notRequired(),
      storeCode:
        voucherType === "Non PPOB"
          ? yup.string().required("Please complete this required field to continue.")
          : yup.string().notRequired(),
      captcha: yup.string().required("Please complete this required field to continue."),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      const fullPhoneNumber = `${values.dropdownCountryStore.option}${values.phoneNumber}`;

      const payload = {
        ...values,
        phoneNumber: fullPhoneNumber,
      };

      handleRedeem(payload, voucherType);
    },
  });

  const onChange = (val) => {
    formik.setFieldValue("captcha", val);
  };

  // Map error message from BE if there is any error in redeem before
  useEffect(() => {
    if (errorReason) {
      const errorReason = generatedReward.errorReason;

      if (errorReason === "PROVIDER SERVER ERROR") {
        // Do nothing
        return;
      }

      switch (errorReason) {
        case "INCORRECT DESTINATION NUMBER":
        case "INVALID FORMAT":
          if (generatedReward.voucherCategory === "PLN") {
            formik.setFieldError("meterNumber", "Invalid meter number");
          }
          break;

        case "NUMBER NOT MATCH WITH OPERATOR":
          if (
            generatedReward.voucherCategory === "Data Package" ||
            generatedReward.voucherCategory === "Paket Data" ||
            generatedReward.voucherCategory === "E-wallet" ||
            generatedReward.voucherCategory === "Pulsa"
          ) {
            formik.setFieldError("phoneNumber", "Invalid phone number prefix in operator");
          }
          break;

        case "CUSTOMER NUMBER BLOCKED":
          if (
            generatedReward.voucherCategory === "Data Package" ||
            generatedReward.voucherCategory === "Paket Data" ||
            generatedReward.voucherCategory === "E-wallet" ||
            generatedReward.voucherCategory === "Pulsa"
          ) {
            formik.setFieldError("phoneNumber", "Phone number blocked");
          }
          break;

        default:
          // Handle custom error message containing "Store code don't match"
          if (errorReason.includes("Invalid store code")) {
            formik.setFieldError("storeCode", "Invalid store code");
          }
          break;
      }
    }
  }, [errorReason]);

  return (
    <Transition show={isOpen} as={Fragment}>
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 flex flex-col gap-4 mx-2 my-2">
              <div className="flex justify-center border-b border-neutral50 px-6 pb-2">
                <Dialog.Title className="font-semibold text-xl text-black">Redeem Reward</Dialog.Title>
              </div>

              <section className="bg-neutral10 flex-1 flex flex-col px-4 py-2 gap-4">
                {voucherType === "PPOB" ? (
                  <>
                    {voucherCategory === "PLN" && (
                      <TextInput
                        title="Meter Number"
                        isRequired
                        placeholder="Input Meter Number"
                        footer={(formik.submitCount || formik.touched.meterNumber) && formik.errors.meterNumber}
                        mode={
                          (formik.submitCount || formik.touched.meterNumber) && formik.errors.meterNumber
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.meterNumber}
                        onChangeInput={(e) => formik.setFieldValue("meterNumber", e.target.value)}
                      />
                    )}

                    {(voucherCategory === "Data Package" ||
                      voucherCategory === "Paket Data" ||
                      voucherCategory === "E-wallet" ||
                      voucherCategory === "Pulsa") && (
                      <DropdownPhone
                        title="Phone Number"
                        placeholder="Input Phone Number"
                        dropdownCountry={formik.values.dropdownCountryStore}
                        setDropdownCountry={(val) => {
                          formik.setFieldValue("dropdownCountryStore", val);
                        }}
                        onChangeInput={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          formik.setFieldValue("phoneNumber", onlyDigits);
                        }}
                        footer={formik.errors.phoneNumber}
                        isRequired={false}
                        mode={formik.errors.phoneNumber ? "danger" : "default"}
                        value={formik.values.phoneNumber}
                      />
                    )}
                  </>
                ) : (
                  <TextInput
                    title="Store Code"
                    isRequired
                    placeholder="Input Store Code"
                    footer={(formik.submitCount || formik.touched.storeCode) && formik.errors.storeCode}
                    mode={
                      (formik.submitCount || formik.touched.storeCode) && formik.errors.storeCode ? "danger" : "default"
                    }
                    value={formik.values.storeCode}
                    onChangeInput={(e) => formik.setFieldValue("storeCode", e.target.value)}
                  />
                )}

                <div className="flex flex-col items-center">
                  <ReCAPTCHA sitekey={process.env.REACT_APP_GRECAPTCHA_API_KEY} onChange={onChange} />
                </div>
                {(formik.submitCount || formik.touched.captcha) && formik.errors.captcha && (
                  <div className="flex items-center justify-start gap-1 ml-3 -mt-3">
                    <Info size={16} className="text-danger500" />
                    <span className="text-xs text-danger500">{formik.errors.captcha}</span>
                  </div>
                )}
              </section>
              <div className="flex flex-col px-6 py-3 gap-4">
                <PrimaryButton title="Submit" type="full" onClick={formik.handleSubmit} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default RedeemFormModal;
