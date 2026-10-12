import React from "react";
import { DropdownText, TextInput } from "sprint-asia-custom-component";

const ModalBasicInformationSection = ({ formik, categories }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="grid grid-cols-3 gap-6 pt-4">
        <TextInput
          title="SKU / ID"
          placeholder="Input SKU / ID"
          onChangeInput={(e) => {
            formik.setFieldValue("skuId", e.target.value);
            formik.setFieldTouched("skuId", true, false);
          }}
          isRequired
          footer={(formik.touched.skuId || formik.submitCount > 0) && formik.errors.skuId ? formik.errors.skuId : null}
          mode={(formik.touched.skuId || formik.submitCount > 0) && formik.errors.skuId ? "danger" : "default"}
          value={formik.values.skuId}
        />

        <TextInput
          title="Product Name"
          placeholder="Input Product Name"
          onChangeInput={(e) => {
            formik.setFieldValue("productName", e.target.value);
            formik.setFieldTouched("productName", true, false);
          }}
          isRequired
          footer={
            (formik.touched.productName || formik.submitCount > 0) && formik.errors.productName
              ? formik.errors.productName
              : null
          }
          mode={
            (formik.touched.productName || formik.submitCount > 0) && formik.errors.productName ? "danger" : "default"
          }
          value={formik.values.productName}
        />

        <DropdownText
          title="Category"
          placeholder="Choose Category"
          options={categories?.data?.map(({ name }) => ({
            option: name,
            value: name,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("category", e.value);
            formik.setFieldTouched("category", true, false);
          }}
          currentOption={formik.values.category}
          footer={
            (formik.touched.category || formik.submitCount > 0) && formik.errors.category
              ? formik.errors.category
              : null
          }
          mode={(formik.touched.category || formik.submitCount > 0) && formik.errors.category ? "danger" : "default"}
        />
      </div>
    </div>
  );
};

export default ModalBasicInformationSection;
