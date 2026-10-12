import React from "react";
import { XIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton, TextInput } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { customList } from "country-codes-list";
import DropDownReward from "../../../DropDownReward/DropDownReward";
import Modal from "prezent/Modal";
import DropdownPhone from "prezent/DropdownPhone";

const AddSingleRecipientModal = ({ mainFormik, isOpen, onClose, method, channels, rewards, selectedRecipient }) => {
  const totalRewardsQuantity = rewards.reduce((sum, reward) => sum + reward.ownedQuantity, 0);

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

  const formatNumber = (value) => {
    if (value === "" || value === null) return "";
    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  const fullPhoneNumber = selectedRecipient?.phoneNumber || "";
  const detectedCountry = detectCountryFromPhone(fullPhoneNumber);
  const phoneNumber = fullPhoneNumber.replace(`+${detectedCountry?.option.replace("+", "")}`, "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: selectedRecipient?.id || "",
      recipientName: selectedRecipient?.recipientName || "",
      dropdownCountryStore: detectedCountry || {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
      phoneNumber: phoneNumber || "",
      email: selectedRecipient?.email || "",
      distribution: selectedRecipient?.distribution || channels.filter((channel) => channel !== "All"),
      reward: selectedRecipient?.reward || "",
      rewardId: selectedRecipient?.rewardId || "",
      quantity: selectedRecipient?.quantity || 0,
      dropdownCountry: {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
    },
    validationSchema: yup.object().shape({
      recipientName: yup
        .string()
        .required("Please complete this required field to continue.")
        .matches(
          /^[a-zA-Z\s]+$/,
          "Please enter a valid recipient name (3–100 characters, without commas or periods) to continue",
        )
        .min(3, "Please enter a valid recipient name (3–100 characters, without commas or periods) to continue")
        .max(100, "Please enter a valid recipient name (3–100 characters, without commas or periods) to continue"),
      phoneNumber:
        channels.includes("WhatsApp") || channels.includes("SMS")
          ? yup
              .string()
              .required("Phone Number is required")
              .min(8, "Phone Number is too short (min. 8 digit & max. 15 digit)")
              .max(15, "Phone number is too long (min. 8 digit & max. 15 digit)")
          : yup
              .string()
              .notRequired()
              .min(8, "Phone Number is too short (min. 8 digit & max. 15 digit)")
              .max(15, "Phone number is too long (min. 8 digit & max. 15 digit)"),
      email: channels.includes("Email")
        ? yup
            .string()
            .test(
              "no-spaces",
              "Please enter a valid email address (e.g., jumienten@example.com) to continue.",
              (value) => !/\s/.test(value),
            )
            .matches(
              /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
              "Please enter a valid email address (e.g., jumienten@example.com) to continue.",
            )
            .required("Please complete this required field to continue.")
        : yup
            .string()
            .test(
              "no-spaces",
              "Please enter a valid email address (e.g., jumienten@example.com) to continue.",
              (value) => !/\s/.test(value),
            )
            .matches(
              /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
              "Please enter a valid email address (e.g., jumienten@example.com) to continue.",
            )
            .notRequired(),
      reward:
        method === "specific"
          ? yup.string().required("Please complete this required field to continue.")
          : yup.string().notRequired(),
      rewardId:
        method === "specific"
          ? yup.string().required("Please complete this required field to continue.")
          : yup.string().notRequired(),
      quantity:
        method === "specific"
          ? yup
              .number()
              .required("Please complete this required field to continue.")
              .min(1, "Please complete this required field to continue.")
              .integer("Quantity must be an integer")
              .test("max-qty", "Stock not enough", function (value) {
                const { rewardId } = this.parent;
                if (!rewardId) return this.createError({ message: "Please select a reward first" });
                if (!value) return true; // already handled by required rule

                return value <= selectedReward.ownedQuantity;
              })
          : yup.number().notRequired(),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      const fullPhoneNumber = `${values.dropdownCountry.option}${values.phoneNumber}`;

      const payload = {
        ...values,
        phoneNumber: fullPhoneNumber,
      };

      const recipients = mainFormik.values.recipients || [];

      if (method === "random") {
        // if editing an existing recipient
        if (selectedRecipient) {
          const updatedRecipients = recipients.map((r) => (r.id === selectedRecipient.id ? { ...r, ...payload } : r));

          mainFormik.setFieldValue("recipients", updatedRecipients);
        } else {
          // creating a new recipient
          if (payload.rewardId) {
            // recipient already has a reward, just add them
            const updatedRecipients = [
              { ...payload, id: payload.id || (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) },
              ...recipients,
            ];

            mainFormik.setFieldValue("recipients", updatedRecipients);
          } else {
            // pick a random reward from rewards array (those with ownedQuantity > 0)
            const availableRewards = rewards.filter((item) => item.ownedQuantity > 0);

            if (availableRewards.length === 0) {
              return;
            }

            const randomReward = availableRewards[Math.floor(Math.random() * availableRewards.length)];

            const newRecipient = {
              ...payload,
              id: payload.id || (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
              reward: randomReward.name,
              rewardId: randomReward.id,
              quantity: 1,
            };

            const updatedRecipients = [newRecipient, ...recipients];
            mainFormik.setFieldValue("recipients", updatedRecipients);

            // ✅ decrement ownedQuantity using Formik's state
            const updatedRewards = rewards.map((item) =>
              item.id === randomReward.id ? { ...item, ownedQuantity: item.ownedQuantity - 1 } : item,
            );

            mainFormik.setFieldValue("rewards", updatedRewards);
          }
        }
      } else if (method === "specific") {
        const selectedReward = rewards.find((item) => item.id === payload.rewardId);

        if (!selectedReward || selectedReward.ownedQuantity < payload.quantity) {
          return;
        }

        if (selectedRecipient) {
          const updatedRecipients = recipients.map((r) => (r.id === selectedRecipient.id ? { ...r, ...payload } : r));

          mainFormik.setFieldValue("recipients", updatedRecipients);
        } else {
          // Add the recipient with the specific reward + quantity
          const newRecipient = {
            ...payload,
            id: payload.id || (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)),
          };

          const updatedRecipients = [newRecipient, ...recipients];
          mainFormik.setFieldValue("recipients", updatedRecipients);
        }

        // ✅ decrement ownedQuantity by selected quantity using Formik
        const updatedRewards = rewards.map((item) =>
          item.id === payload.rewardId ? { ...item, ownedQuantity: item.ownedQuantity - payload.quantity } : item,
        );

        mainFormik.setFieldValue("rewards", updatedRewards);
      }

      resetForm();
      onClose();
    },
  });

  const selectedReward = rewards.find((reward) => reward.id === formik.values.rewardId);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        formik.resetForm();
      }}
    >
      <div style={{ width: 576 }}>
        <div className="flex justify-between py-3 px-8">
          <p className="font-semibold text-xl">Add Recipient</p>

          <a
            className="cursor-pointer"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
          >
            <XIcon size={24} />
          </a>
        </div>

        {/* Content */}
        <div className="w-full px-8 py-4 flex border-t border-b border-neutral30 flex-col gap-4 overflow-y-auto">
          <div className="rounded-lg bg-primary50 p-4 flex justify-between items-center">
            {!totalRewardsQuantity ? (
              <p className="text-danger500 italic font-medium text-sm">No remaining rewards available to distribute</p>
            ) : (
              <>
                <p className="font-semibold text-neutral300 text-sm">Remaining Rewards</p>
                <p className="font-semibold text-sm">{totalRewardsQuantity.toLocaleString("id", "ID")}</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <TextInput
              title="Recipient Name"
              isRequired
              placeholder="Input Recipient Name"
              value={formik.values.recipientName}
              onChangeInput={(e) => {
                formik.setFieldValue("recipientName", e.target.value);
                formik.setFieldTouched("recipientName", true, false);
              }}
              footer={
                (formik.touched.recipientName || formik.submitCount > 0) && formik.errors.recipientName
                  ? formik.errors.recipientName
                  : null
              }
              mode={
                !totalRewardsQuantity
                  ? "disable"
                  : (formik.touched.recipientName || formik.submitCount > 0) && formik.errors.recipientName
                    ? "danger"
                    : "default"
              }
            />

            <DropdownPhone
              title="Phone Number"
              placeholder="Input Phone Number"
              dropdownCountry={formik.values.dropdownCountry}
              setDropdownCountry={(val) => {
                formik.setFieldValue("dropdownCountry", val);
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
                !totalRewardsQuantity
                  ? "disable"
                  : (formik.touched.phoneNumber || formik.submitCount > 0) && formik.errors.phoneNumber
                    ? "danger"
                    : "default"
              }
              isEdited={totalRewardsQuantity}
            />

            <TextInput
              title="Email"
              isRequired
              value={formik.values.email}
              placeholder="Input Email"
              onChangeInput={(e) => {
                formik.setFieldValue("email", e.target.value);
                formik.setFieldTouched("email", true, false);
              }}
              footer={
                (formik.touched.email || formik.submitCount > 0) && formik.errors.email ? formik.errors.email : null
              }
              mode={
                !totalRewardsQuantity
                  ? "disable"
                  : (formik.touched.email || formik.submitCount > 0) && formik.errors.email
                    ? "danger"
                    : "default"
              }
            />
          </div>

          {method === "specific" && (
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <DropDownReward
                  title="Reward"
                  isRequired
                  onSelect={(e) => {
                    formik.setFieldValue("rewardId", e.value);
                    formik.setFieldValue("reward", e.option);
                    formik.setFieldTouched("reward", true, false);
                  }}
                  placeholder="Choose Reward"
                  currentOption={formik.values.rewardId}
                  options={rewards.map((reward) => ({
                    option: reward.name,
                    value: reward.id,
                    quantity: reward.ownedQuantity,
                  }))}
                  footer={
                    (formik.touched.reward || formik.submitCount > 0) && formik.errors.reward
                      ? formik.errors.reward
                      : null
                  }
                  mode={
                    !totalRewardsQuantity
                      ? "disable"
                      : (formik.touched.reward || formik.submitCount > 0) && formik.errors.reward
                        ? "danger"
                        : "default"
                  }
                />
              </div>
              <div className="col-span-1">
                <TextInput
                  title="Qty"
                  value={formatNumber(formik.values.quantity)}
                  minimum={0}
                  isRequired
                  type="number"
                  onChangeInput={(e) => {
                    const val = Number(e.target.value);
                    const selectedReward = rewards.find((reward) => reward.id === formik.values.rewardId);

                    if (selectedReward) {
                      if (val > selectedReward.ownedQuantity) {
                        // Set the value to max allowed if exceeded
                        formik.setFieldValue("quantity", selectedReward.ownedQuantity);
                      } else {
                        formik.setFieldValue("quantity", val);
                        formik.setFieldError("quantity", undefined);
                      }
                    } else {
                      formik.setFieldValue("quantity", val);
                    }

                    formik.setFieldTouched("quantity", true, false);
                  }}
                  mode={
                    (formik.touched.quantity || formik.submitCount > 0) && formik.errors.quantity ? "danger" : "default"
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end w-full px-8 py-4">
          <OutlineButton
            title="Cancel"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
          />
          <PrimaryButton title="Submit" onClick={formik.handleSubmit} isActive={totalRewardsQuantity} />
        </div>
      </div>
    </Modal>
  );
};

export default AddSingleRecipientModal;
