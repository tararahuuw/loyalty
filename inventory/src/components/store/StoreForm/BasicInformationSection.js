import React from "react";
import { DropdownText } from "sprint-asia-custom-component";

const BasicInformationSection = ({ formik, clients, id }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="grid grid-cols-3 gap-6">
        <DropdownText
          title="Client"
          placeholder="Choose Client"
          options={clients?.data?.map(({ name, id }) => ({
            option: name,
            value: id,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("clientId", e.value);
            formik.setFieldTouched("clientId", true, false);
          }}
          currentOption={formik.values.clientId}
          footer={
            (formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId
              ? formik.errors.clientId
              : null
          }
          mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}
          isEdited={!id}
        />
      </div>
    </div>
  );
};

export default BasicInformationSection;
