import React from "react";
import { TextInput, DropdownText } from "sprint-asia-custom-component";

const AddressInformationSection = ({ formik, provinces, cities, districts, selectedStore }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Address Information
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <DropdownText
            title="Province"
            placeholder="Select Province"
            options={provinces?.data?.map(({ name }) => ({
              option: name,
              value: name,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setValues({
                ...formik.values,
                province: e.option,
                city: "",
                district: "",
              });
              formik.setFieldTouched("province", true, false);
            }}
            currentOption={formik.values.province}
            footer={
              (formik.touched.province || formik.submitCount > 0) && formik.errors.province
                ? formik.errors.province
                : null
            }
            mode={(formik.touched.province || formik.submitCount > 0) && formik.errors.province ? "danger" : "default"}
          />
        </div>
        <div>
          <DropdownText
            title="City / Regencies"
            placeholder="Select City / Regencies"
            options={cities?.data?.map(({ name }) => ({
              option: name,
              value: name,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setValues({
                ...formik.values,
                city: e.option,
                district: "",
              });
              formik.setFieldTouched("city", true, false);
            }}
            currentOption={formik.values.city}
            footer={(formik.touched.city || formik.submitCount > 0) && formik.errors.city ? formik.errors.city : null}
            mode={(formik.touched.city || formik.submitCount > 0) && formik.errors.city ? "danger" : "default"}
          />
        </div>
        <div>
          <DropdownText
            title="District"
            placeholder="Select District"
            options={districts?.data?.map(({ name }) => ({
              option: name,
              value: name,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("district", e.option);
              formik.setFieldTouched("disctrict", true, false);
            }}
            currentOption={formik.values.district}
            footer={
              (formik.touched.district || formik.submitCount > 0) && formik.errors.district
                ? formik.errors.district
                : null
            }
            mode={(formik.touched.district || formik.submitCount > 0) && formik.errors.district ? "danger" : "default"}
          />
        </div>
        <div className="col-span-2">
          <TextInput
            title="Detail Address"
            placeholder="Choose Address"
            onChangeInput={(e) => {
              formik.setFieldValue("address", e.target.value);
              formik.setFieldTouched("address", true, false);
            }}
            isRequired
            footer={
              (formik.touched.address || formik.submitCount > 0) && formik.errors.address ? formik.errors.address : null
            }
            mode={(formik.touched.address || formik.submitCount > 0) && formik.errors.address ? "danger" : "default"}
            value={formik.values.address}
          />
        </div>
        <div>
          <TextInput
            title="Postal Code"
            placeholder="Input Postal Code"
            onChangeInput={(e) => {
              const value = e.target.value;

              // Allow only digits
              if (/^\d*$/.test(value)) {
                formik.setFieldValue("postalCode", value);
              }

              formik.setFieldTouched("postalCode", true, false);
            }}
            isRequired
            footer={
              (formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode
                ? formik.errors.postalCode
                : null
            }
            mode={
              (formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode ? "danger" : "default"
            }
            value={formik.values.postalCode}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInformationSection;
