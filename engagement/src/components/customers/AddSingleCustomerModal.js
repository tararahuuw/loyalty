import React from "react";
import { X } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton, TextInput, DropdownText } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "prezent/useDisclosure";
import ConfirmationModal from "../shared/ConfirmationModal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { customList } from "country-codes-list";
import Modal from "prezent/Modal";
import DropdownPhone from "prezent/DropdownPhone";

const AddSingleCustomerModal = ({
  isOpen,
  onClose,
  selectedCustomer,
  handleSubmitCustomer,
  tiers = [],
  setSelectedCustomer = () => {},
}) => {
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);

  const handleToggleConfirmationModal = () => {
    onClose();
    toggleConfirmationModal();
  };
  const detectCountryFromPhone = (phoneNumber) => {
    if (!phoneNumber) return null;

    const phoneData = parsePhoneNumberFromString(phoneNumber);
    if (!phoneData || !phoneData.countryCallingCode || !phoneData.country) {
      return null;
    }

    const list = Object.entries(customList("countryCode", "{countryNameEn} +{countryCallingCode}")).map(
      ([code, label]) => {
        const [countryName, callingCode] = label.split(" +");
        return {
          option: `+${callingCode}`,
          value: code.toLowerCase(),
          label: countryName,
        };
      },
    );

    const match = list.find(
      (item) => item.option === `+${phoneData.countryCallingCode}` && item.value === phoneData.country.toLowerCase(),
    );

    return (
      match || {
        option: `+${phoneData.countryCallingCode}`,
        value: phoneData.country.toLowerCase(),
        label: phoneData.country || "Unknown",
      }
    );
  };

  const fullPhoneNumber = selectedCustomer?.phoneNumber || "";
  const detectedCountryCustomer = detectCountryFromPhone(fullPhoneNumber);
  const phoneNumber = fullPhoneNumber.replace(`+${detectedCountryCustomer?.option.replace("+", "")}`, "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: selectedCustomer?.customerName || "",
      dropdownCountryCustomer: detectedCountryCustomer || {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
      phoneNumber: phoneNumber || "",
      email: selectedCustomer?.email || "",
      tierLevel: selectedCustomer?.tierName || "",
    },
    validationSchema: yup.object().shape({
      customerName: yup
        .string()
        .min(3, "Customer Name must be at least 3 characters")
        .max(100, "Customer Name cannot be more than 100 characters")
        .required("Please complete this required field to continue."),
      phoneNumber: yup
        .string()
        .required("Phone Number is required")
        .min(8, "Phone number is too short (min. 8 digit & max. 15 digit)")
        .max(15, "Phone number is too long (min. 8 digit & max. 15 digit)"),
      email: yup
        .string()
        .min(10, "Email must be between 10 and 50 characters long")
        .max(50, "Email must be between 10 and 50 characters long")
        .test("no-spaces", "Email cannot contain spaces", (value) => !/\s/.test(value))
        .matches(
          /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address (e.g., johndoe@example.com) to continue.",
        )
        .required("Please complete this required field to continue."),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const fullCustomerNumber = `${formik.values.dropdownCountryCustomer.option}${formik.values.phoneNumber}`;

      const payload = {
        ...values,
        phoneNumber: fullCustomerNumber,
      };

      handleSubmitCustomer(payload);
      setSelectedCustomer(null);
      resetForm();
      onClose();
    },
  });

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          if (formik.dirty) {
            handleToggleConfirmationModal();
          } else {
            onClose();
            setSelectedCustomer(null);
            formik.resetForm();
          }
        }}
      >
        <div className="w-full max-w-6xl bg-white sm:my-8 sm:w-full sm:max-w-4xl flex flex-col gap-4">
          <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
            <p className="font-semibold text-xl text-black">{!selectedCustomer ? "New Customer" : "Edit Customer"}</p>
            <p
              className="cursor-pointer text-xl"
              onClick={() => {
                if (formik.dirty) {
                  handleToggleConfirmationModal();
                } else {
                  onClose();
                  setSelectedCustomer(null);
                  formik.resetForm();
                }
              }}
            >
              <X size={24} />
            </p>
          </div>

          <div className="flex flex-col px-6 py-3 gap-10">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                title="Customer Name"
                placeholder="Input Customer Name"
                onChangeInput={(e) => {
                  formik.setFieldValue("customerName", e.target.value);
                  formik.setFieldTouched("customerName", true, false);
                }}
                footer={
                  (formik.touched.customerName || formik.submitCount > 0) && formik.errors.customerName
                    ? formik.errors.customerName
                    : null
                }
                mode={
                  (formik.touched.customerName || formik.submitCount > 0) && formik.errors.customerName
                    ? "danger"
                    : "default"
                }
                isRequired
                value={formik.values.customerName}
              />
              <DropdownPhone
                title="Phone Number"
                placeholder="Phone Number"
                dropdownCountry={formik.values.dropdownCountryCustomer}
                setDropdownCountry={(val) => {
                  formik.setFieldValue("dropdownCountryCustomer", val);
                }}
                value={formik.values.phoneNumber}
                onChangeInput={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  formik.setFieldValue("phoneNumber", onlyDigits);
                  formik.setFieldTouched("phoneNumber", true, false);
                }}
                footer={
                  (formik.touched.phoneNumber || formik.submitCount > 0) && formik.errors.phoneNumber
                    ? formik.errors.phoneNumber
                    : null
                }
                mode={
                  selectedCustomer
                    ? "disable"
                    : (formik.touched.phoneNumber || formik.submitCount > 0) && formik.errors.phoneNumber
                      ? "danger"
                      : "default"
                }
                isEdited={selectedCustomer ? false : true}
              />
              <TextInput
                title="Email"
                placeholder="Input Email"
                onChangeInput={(e) => {
                  formik.setFieldValue("email", e.target.value);
                  formik.setFieldTouched("email", true, false);
                }}
                footer={
                  (formik.touched.email || formik.submitCount > 0) && formik.errors.email ? formik.errors.email : null
                }
                mode={
                  selectedCustomer
                    ? "disable"
                    : (formik.touched.email || formik.submitCount > 0) && formik.errors.email
                      ? "danger"
                      : "default"
                }
                isRequired
                value={formik.values.email}
              />
              <DropdownText
                title="Tier Level (Optional)"
                placeholder="Choose Tier Level"
                options={tiers.map(({ tierName }) => ({
                  option: tierName,
                  value: tierName,
                }))}
                isRequired={false}
                onSelect={(e) => {
                  formik.setFieldValue("tierLevel", e.value);
                  formik.setFieldTouched("tierLevel", true, false);
                }}
                isEdited={selectedCustomer ? false : true}
                footer={
                  (formik.touched.tierLevel || formik.submitCount > 0) && formik.errors.tierLevel
                    ? formik.errors.tierLevel
                    : null
                }
                mode={
                  (formik.touched.tierLevel || formik.submitCount > 0) && formik.errors.tierLevel ? "danger" : "default"
                }
                currentOption={formik.values.tierLevel}
              />
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
                  setSelectedCustomer(null);
                  formik.resetForm();
                }
              }}
            />
            <PrimaryButton title="Submit" onClick={formik.handleSubmit} />
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        onClick={() => {
          toggleConfirmationModal();
          formik.resetForm();
          setSelectedCustomer(null);
        }}
        onClose={handleToggleConfirmationModal}
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        title="Do you want to cancel?"
      />
    </>
  );
};

export default AddSingleCustomerModal;
