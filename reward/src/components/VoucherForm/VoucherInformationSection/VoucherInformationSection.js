import React from "react";
import { DropdownText, TextInput } from "sprint-asia-custom-component";

const VoucherInformationSection = ({
  formik,
  clients,
  types,
  categories,
  editable,
  voucherId,
  setSelectedCategoryName,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Voucher Information
      </div>

      <div className={`grid grid-cols-3 gap-4`}>
        <TextInput
          title="Voucher Name"
          placeholder="Input Voucher Name"
          onChangeInput={(e) => {
            formik.setFieldValue("voucherName", e.target.value);
            formik.setFieldTouched("voucherName", true, false);
          }}
          footer={
            (formik.touched.voucherName || formik.submitCount > 0) && formik.errors.voucherName
              ? formik.errors.voucherName
              : null
          }
          mode={
            (formik.touched.voucherName || formik.submitCount > 0) && formik.errors.voucherName ? "danger" : "default"
          }
          isRequired
          value={formik.values.voucherName}
        />

        <DropdownText
          title="Voucher Type"
          placeholder="Select Type"
          options={types?.data?.map(({ voucher_type_name, voucher_type_code }) => ({
            option: voucher_type_name,
            value: voucher_type_code,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("voucherType", e.value);
            formik.setFieldTouched("voucherType", true, false);
          }}
          currentOption={formik.values.voucherType}
          footer={
            (formik.touched.voucherType || formik.submitCount > 0) && formik.errors.voucherType
              ? formik.errors.voucherType
              : null
          }
          mode={
            (formik.touched.voucherType || formik.submitCount > 0) && formik.errors.voucherType ? "danger" : "default"
          }
          isEdited={!voucherId}
        />

        <DropdownText
          title="Voucher Category"
          placeholder="Select Category"
          options={categories?.data?.map(({ voucher_category_name, voucher_category_code }) => ({
            option: voucher_category_name,
            value: voucher_category_code,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("voucherCategory", e.value);
            formik.setFieldTouched("voucherCategory", true, false);
            setSelectedCategoryName(
              categories?.data?.filter((category) => category.voucher_category_code == e.value)[0]
                ?.voucher_category_name
            );
          }}
          currentOption={formik.values.voucherCategory}
          footer={
            (formik.touched.voucherCategory || formik.submitCount > 0) && formik.errors.voucherCategory
              ? formik.errors.voucherCategory
              : null
          }
          mode={
            (formik.touched.voucherCategory || formik.submitCount > 0) && formik.errors.voucherCategory
              ? "danger"
              : "default"
          }
          isEdited={!voucherId}
        />

        <DropdownText
          title="Price Type"
          placeholder="Select Price Type"
          options={[
            { option: "Normal", value: "normal" },
            { option: "Special", value: "special" },
          ]}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("priceType", e.value);
            formik.setFieldTouched("priceType", true, false);
          }}
          currentOption={formik.values.priceType}
          footer={
            (formik.touched.priceType || formik.submitCount > 0) && formik.errors.priceType
              ? formik.errors.priceType
              : null
          }
          mode={(formik.touched.priceType || formik.submitCount > 0) && formik.errors.priceType ? "danger" : "default"}
          isEdited={!editable && !voucherId}
        />

        {formik.values.voucherType === "3" && (
          <DropdownText
            title="Client"
            placeholder="Select Client"
            options={clients?.data?.map(({ name, id }) => ({
              option: name,
              value: id,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("clientId", e.value);
              formik.setFieldTouched("priceType", true, false);
            }}
            currentOption={formik.values.clientId}
            footer={
              (formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId
                ? formik.errors.clientId
                : null
            }
            mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}
            isEdited={!editable}
          />
        )}
      </div>
    </div>
  );
};

export default VoucherInformationSection;
