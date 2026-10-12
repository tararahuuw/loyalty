import React from "react";

import { TextInput, DropdownText } from "sprint-asia-custom-component";

const AddressInformation = ({ formik, provinces, cities, districts }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Address Information
      </div>

      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-2">
          <DropdownText
            title="Province"
            placeholder="Select Province"
            options={provinces?.data?.map(({ name, code }) => ({
              option: name,
              value: code,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setValues({
                ...formik.values,
                provinceCode: e.value,
                cityCode: "",
                districtCode: "",
              });
              formik.setFieldTouched("provinceCode", true, false);
            }}
            footer={(formik.touched.provinceCode || formik.submitCount > 0) && formik.errors.provinceCode ? formik.errors.provinceCode : null}
            mode={(formik.touched.provinceCode || formik.submitCount > 0) && formik.errors.provinceCode ? "danger" : "default"}
            currentOption={formik.values.provinceCode}
          />
        </div>
        <div className="col-span-2">
          <DropdownText
            title="City"
            placeholder="Select City"
            options={cities?.data?.map(({ name, code }) => ({
              option: name,
              value: code,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setValues({
                ...formik.values,
                cityCode: e.value,
                districtCode: "",
              });
              formik.setFieldTouched("cityCode", true, false);
            }}
            footer={(formik.touched.cityCode || formik.submitCount > 0) && formik.errors.cityCode ? formik.errors.cityCode : null}
            mode={(formik.touched.cityCode || formik.submitCount > 0) && formik.errors.cityCode ? "danger" : "default"}
            currentOption={formik.values.cityCode}
          />
        </div>
        <div className="col-span-2">
          <DropdownText
            title="District"
            placeholder="Select District"
            options={districts?.data?.map(({ name, code }) => ({
              option: name,
              value: code,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("districtCode", e.value);
              formik.setFieldTouched("districtCode", true, false);
            }}
            footer={(formik.touched.districtCode || formik.submitCount > 0) && formik.errors.districtCode ? formik.errors.districtCode : null}
            mode={(formik.touched.districtCode || formik.submitCount > 0) && formik.errors.districtCode ? "danger" : "default"}
            currentOption={formik.values.districtCode}
          />
        </div>

        {/* Row 2 */}
        <div className="col-span-4">
          <TextInput
            title="Detail Address"
            placeholder="Input Detail Address"
            onChangeInput={(e) => {
              formik.setFieldValue("detailAddress", e.target.value);
              formik.setFieldTouched("detailAddress", true, false);
            }}
            footer={(formik.touched.detailAddress || formik.submitCount > 0) && formik.errors.detailAddress ? formik.errors.detailAddress : null}
            mode={(formik.touched.detailAddress || formik.submitCount > 0) && formik.errors.detailAddress ? "danger" : "default"}
            isRequired
            value={formik.values.detailAddress}
          />
        </div>
        <div className="col-span-2">
          <TextInput
            title="Postal Code"
            placeholder="Input Postal Code"
            onChangeInput={(e) => {
              formik.setFieldValue("postalCode", e.target.value);
              formik.setFieldTouched("postalCode", true, false);
            }}
            footer={(formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode ? formik.errors.postalCode : null}
            mode={(formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode ? "danger" : "default"}
            isRequired
            value={formik.values.postalCode}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
