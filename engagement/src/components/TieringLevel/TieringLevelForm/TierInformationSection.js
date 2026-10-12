import React from "react";
import { DropdownText, TextInput } from "sprint-asia-custom-component";

const TierInformationSection = ({ clients, divisions, formik, roleAccess }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Information</div>

      <div className="grid grid-cols-3 gap-6 pointer-events-none">
        <TextInput
          title="Tier Level"
          placeholder="Select division first"
          onChangeInput={(e) => {
            formik.setFieldValue("level", e.target.value);
            formik.setFieldTouched("level", true, false);
          }}
          footer={(formik.touched.level || formik.submitCount > 0) && formik.values.level === "" && formik.errors.level ? formik.errors.level : null}
          isRequired
          mode={(formik.touched.level || formik.submitCount > 0) && formik.values.level === "" && formik.errors.level ? "danger" : "disable"}
          value={formik.values.level}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <TextInput
          title="Tier Name"
          placeholder="Input Tier Name"
          onChangeInput={(e) => {
            formik.setFieldValue("name", e.target.value);
            formik.setFieldTouched("name", true, false);
          }}
          footer={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? formik.errors.name : null}
          mode={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"}
          isRequired
          value={formik.values.name}
        />

        {roleAccess === "System Administrator" && (
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
              formik.setFieldValue("divisionId", null);
              formik.setFieldTouched("level", false, false);
            }}
            footer={(formik.touched.clientId || formik.submitCount > 0) && formik.values.clientId === "" && formik.errors.clientId ? formik.errors.clientId : null}
            mode={(formik.touched.clientId || formik.submitCount > 0) && formik.values.clientId === "" && formik.errors.clientId ? "danger" : "default"}  
            currentOption={formik.values.clientId}
          />
        )}

        <DropdownText
          title="Division"
          placeholder="Choose Division"
          options={divisions?.data?.map(({ name, id }) => ({
            option: name,
            value: id,
          }))}
          isRequired
          onSelect={(e) => {
            formik.setFieldValue("divisionId", e.value);
            formik.setFieldTouched("divisionId", true, false);
            formik.setFieldTouched("level", true, false);
          }}
          footer={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? formik.errors.divisionId : null}
          mode={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? "danger" : "default"}  
          currentOption={formik.values.divisionId}
        />
      </div>
    </div>
  );
};

export default TierInformationSection;
