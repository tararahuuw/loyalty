import React from "react";
import { DropdownText, TextInput } from "sprint-asia-custom-component";
import TextInputMask from "prezent/TextInputMask";
import { Percent } from "@phosphor-icons/react";

const BillingInformation = ({ formik, banks, roleAccess }) => {
  const billingType1 = [
    { option: "Prepaid", value: "Prepaid" },
    { option: "Postpaid", value: "Postpaid" },
  ];

  const billingType2 = [{ option: "Prepaid", value: "Prepaid" }];
  return (
    <div className="flex flex-col gap-5">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Billing Information
      </div>

      <div className="flex flex-row gap-6 flex-wrap">
        <DropdownText
          title="Bank Name"
          placeholder="Select Bank"
          options={banks?.data?.map(({ name }) => ({
            option: name,
            value: name,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("bankName", e.value);
            formik.setFieldTouched("bankName", true, false);
          }}
          footer={(formik.touched.bankName || formik.submitCount > 0) && formik.errors.bankName ? formik.errors.bankName : null}
          mode={(formik.touched.bankName || formik.submitCount > 0) && formik.errors.bankName ? "danger" : "default"}
          currentOption={formik.values.bankName}
          className="max-w-sm"
        />

        <TextInput
          title="Account Name"
          placeholder="Input Account Name"
          onChangeInput={(e) => {
            formik.setFieldValue("accountName", e.target.value);
            formik.setFieldTouched("accountName", true, false);
          }}
          footer={(formik.touched.accountName || formik.submitCount > 0) && formik.errors.accountName ? formik.errors.accountName : null}
          mode={(formik.touched.accountName || formik.submitCount > 0) && formik.errors.accountName ? "danger" : "default"}
          isRequired
          value={formik.values.accountName}
          className="max-w-sm"
        />

        <TextInput
          title="Account Number"
          placeholder="Input Account Number"
          onChangeInput={(e) => {
            formik.setFieldValue("accountNumber", e.target.value);
            formik.setFieldTouched("accountNumber", true, false);
          }}
          footer={(formik.touched.accountNumber || formik.submitCount > 0) && formik.errors.accountNumber ? formik.errors.accountNumber : null}
          mode={(formik.touched.accountNumber || formik.submitCount > 0) && formik.errors.accountNumber ? "danger" : "default"}
          isRequired
          value={formik.values.accountNumber}
          className="max-w-sm"
          type="number"
        />

        <TextInputMask
          title="Tax Registration Number"
          placeholder="Input Tax Registration Number"
          type="number"
          onChange={(e) => {
            const cleanedValue = e.target.value.replace(/_/g, "");
            formik.setFieldValue("taxRegistrationNumber", cleanedValue);
            formik.setFieldTouched("taxRegistrationNumber", true, false);
          }}
          footer={(formik.touched.taxRegistrationNumber || formik.submitCount > 0) && formik.errors.taxRegistrationNumber ? formik.errors.taxRegistrationNumber : null}
          mode={(formik.touched.taxRegistrationNumber || formik.submitCount > 0) && formik.errors.taxRegistrationNumber ? "danger" : "default"}
          isRequired
          value={formik.values.taxRegistrationNumber}
          className="max-w-sm"
        />

        {
          roleAccess === "System Administrator" &&
          <DropdownText
            title="Billing Type"
            placeholder="Select Billing Type"
            options={roleAccess === "Client Administrator" ? billingType2 : billingType1}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("billingType", e.value);
              formik.setFieldTouched("billingType", true, false);
            }}
            footer={(formik.touched.billingType || formik.submitCount > 0) && formik.errors.billingType ? formik.errors.billingType : null}
            mode={(formik.touched.billingType || formik.submitCount > 0) && formik.errors.billingType ? "danger" : "default"}
            currentOption={formik.values.billingType}
            className="max-w-sm"
          />
        }

        {formik.values.billingType === "Postpaid" && (
          <TextInput
            title="Limit Amount"
            placeholder="Input Limit Amount"
            onChangeInput={(e) => {
              formik.setFieldValue("limitAmount", e.target.value);
              formik.setFieldTouched("limitAmount", true, false);
            }}
            footer={(formik.touched.limitAmount || formik.submitCount > 0) && formik.errors.limitAmount ? formik.errors.limitAmount : null}
            mode={(formik.touched.limitAmount || formik.submitCount > 0) && formik.errors.limitAmount ? "danger" : "default"}
            isRequired
            value={formik.values.limitAmount}
            minimum={0}
            maximum={1000000000}
            className="max-w-sm"
            type="number"
          />
        )}

        {
          roleAccess === "System Administrator" &&
          <TextInput
            title="Admin Fee"
            placeholder="Example: 12"
            onChangeInput={(e) => {
              formik.setFieldValue("adminFee", e.target.value);
              formik.setFieldTouched("adminFee", true, false);
            }}
            footer={(formik.touched.adminFee || formik.submitCount > 0) && formik.errors.adminFee ? formik.errors.adminFee : null}
            mode={(formik.touched.adminFee || formik.submitCount > 0) && formik.errors.adminFee ? "danger" : "default"}
            isRequired={false}
            value={formik.values.adminFee}
            minimum={0}
            maximum={100}
            className="max-w-sm"
            type="number"
            rightAdornment={<Percent />}
          />
        }
      </div>
    </div>
  );
};

export default BillingInformation;
