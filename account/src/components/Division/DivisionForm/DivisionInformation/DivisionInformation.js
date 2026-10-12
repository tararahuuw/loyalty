import React from "react";

import { TextInput, DropdownText, DropdownPhone } from "sprint-asia-custom-component";

const DivisionInformation = ({ formik, clients, clientId, mode, roleAccess }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-5">
          {roleAccess === "System Administrator" && (
            <DropdownText
              title="Client"
              placeholder="Select Client"
              options={clients?.data?.map(({ name, id }) => ({
                option: name,
                value: id,
              }))}
              isEdited={mode === "Add" ? true : false}
              isRequired
              onSelect={(e) => {
                formik.setFieldValue("clientId", e.value);
                formik.setFieldTouched("clientId", true, false);
              }}
              footer={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? formik.errors.clientId : null}
              mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}
              currentOption={formik.values.clientId}
            />
          )}
          <TextInput
            title="PIC Email"
            placeholder="Input PIC Email"
            onChangeInput={(e) => {
              formik.setFieldValue("picEmail", e.target.value);
              formik.setFieldTouched("picEmail", true, false);
            }}
            footer={(formik.touched.picEmail || formik.submitCount > 0) && formik.errors.picEmail ? formik.errors.picEmail : null}
            mode={(formik.touched.picEmail || formik.submitCount > 0) && formik.errors.picEmail ? "danger" : "default"}
            isRequired
            value={formik.values.picEmail}
          />
          <DropdownPhone
            title="Phone Number"
            placeholder="Input Phone Number"
            dropdownCountry={formik.values.dropdownCountry}
            setDropdownCountry={(val) => {
              formik.setFieldValue("dropdownCountry", val);
            }}
            value={formik.values.picPhoneNumber}
            onChangeInput={(e) => {
              formik.setFieldValue("picPhoneNumber", e.target.value);
              formik.setFieldTouched("picPhoneNumber", true, false);
            }}
            footer={
              (formik.touched.picPhoneNumber || formik.submitCount > 0) &&
                formik.errors.picPhoneNumber
                ? formik.errors.picPhoneNumber
                : null
            }
            mode={
              (formik.touched.picPhoneNumber || formik.submitCount > 0) &&
                formik.errors.picPhoneNumber
                ? "danger"
                : "default"
            }
          />
        </div>

        <div className="flex flex-col gap-5">
          <TextInput
            title="Division Name"
            placeholder="Input Division Name"
            onChangeInput={(e) => {
              formik.setFieldValue("divisionName", e.target.value);
              formik.setFieldTouched("divisionName", true, false);
            }}
            footer={(formik.touched.divisionName || formik.submitCount > 0) && formik.errors.divisionName ? formik.errors.divisionName : null}
            mode={(formik.touched.divisionName || formik.submitCount > 0) && formik.errors.divisionName ? "danger" : "default"}
            isRequired
            value={formik.values.divisionName}
          />

          <DropdownText
            title="Gender"
            placeholder="Select Gender"
            options={[
              { option: "Male", value: "Male" },
              { option: "Female", value: "Female" },
            ]}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("gender", e.value);
              formik.setFieldTouched("gender", true, false);
            }}
            footer={(formik.touched.gender || formik.submitCount > 0) && formik.errors.gender ? formik.errors.gender : null}
            mode={(formik.touched.gender || formik.submitCount > 0) && formik.errors.gender ? "danger" : "default"}
            currentOption={formik.values.gender}
          />
        </div>

        <div className="flex flex-col gap-5">
          <TextInput
            title="PIC Name"
            placeholder="Input PIC Name"
            onChangeInput={(e) => {
              formik.setFieldValue("picName", e.target.value);
              formik.setFieldTouched("picName", true, false);
            }}
            footer={(formik.touched.picName || formik.submitCount > 0) && formik.errors.picName ? formik.errors.picName : null}
            mode={(formik.touched.picName || formik.submitCount > 0) && formik.errors.picName ? "danger" : "default"}
            isRequired
            value={formik.values.picName}
          />

          <TextInput
            title="Position"
            placeholder="Input Position"
            onChangeInput={(e) => {
              formik.setFieldValue("position", e.target.value);
              formik.setFieldTouched("position", true, false);
            }}
            footer={(formik.touched.position || formik.submitCount > 0) && formik.errors.position ? formik.errors.position : null}
            mode={(formik.touched.position || formik.submitCount > 0) && formik.errors.position ? "danger" : "default"}
            isRequired
            value={formik.values.position}
          />
        </div>
      </div>
    </div>
  );
};

export default DivisionInformation;
