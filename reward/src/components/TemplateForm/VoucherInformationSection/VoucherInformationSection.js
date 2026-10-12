import React, { useCallback, useEffect, useRef, useState } from "react";

import { DropdownText, DropzoneUploadPhoto, TextInput } from "sprint-asia-custom-component";
import TextInputMask from "prezent/TextInputMask";
import { ChromePicker } from "react-color";

const VoucherInformationSection = ({ formik, setImageUrl, clients, divisions }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleOnChangeColor = (value) => {
    if (value[0] !== "#") {
      // push symbol # to the very first of the value
      value = `#${value}`;
    }

    formik.setFieldValue("templateName", value);
    formik.setFieldTouched("templateName", true, false);
  };

  const onDropImage = useCallback((acceptedFiles) => {
    formik.setFieldValue("templateVoucherPhoto", acceptedFiles[0]);
    formik.setFieldTouched("templateVoucherPhoto", true, false);
    const photoUrl = URL.createObjectURL(acceptedFiles[0]);
    setImageUrl(photoUrl);
  }, []);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Voucher Information
      </div>

      <DropdownText
        title="Background"
        placeholder="Choose Background"
        options={[
          { option: "Upload Image", value: "upload_image" },
          { option: "Solid Color", value: "solid_color" },
        ]}
        isRequired
        onSelect={(e) => {
          formik.setFieldValue("background", e.value);
          formik.setFieldTouched("background", true, false);
        }}
        currentOption={formik.values.background}
        footer={
          (formik.touched.background || formik.submitCount > 0) && formik.errors.background
            ? formik.errors.background
            : null
        }
        mode={(formik.touched.background || formik.submitCount > 0) && formik.errors.background ? "danger" : "default"}
      />

      {formik.values.background === "upload_image" && (
        <DropzoneUploadPhoto
          onDrop={onDropImage}
          selectedFile={
            formik.values.templateVoucherPhoto
              ? typeof formik.values.templateVoucherPhoto === "string"
                ? `${process.env.REACT_APP_API_URL}/template_voucher/${formik.values.templateVoucherPhoto}`
                : formik.values.templateVoucherPhoto
              : null
          }
          title="Upload a photos with minimum resolution 300 x 300 px and maximum 5000 x 5000 px."
          subtitle="Format File PNG, JPEG, or JPG, Maximal File 5 MB"
          required={true}
          error={
            (formik.touched.templateVoucherPhoto || formik.submitCount > 0) && formik.errors.templateVoucherPhoto
              ? formik.errors.templateVoucherPhoto
              : null
          }
          validateResolution
          minResolution={{ width: 300, height: 300 }}
          maxResolution={{ width: 5000, height: 5000 }}
        />
      )}

      {formik.values.background === "solid_color" && (
        <div className="flex flex-row items-center gap-4 relative">
          {/* Color preview box */}
          <div
            className="rounded-lg h-12 w-12 border cursor-pointer"
            style={{ background: formik.values.templateName }}
            onClick={() => setShowPicker((prev) => !prev)}
          />

          {showPicker && (
            <div ref={pickerRef} className="absolute z-10 left-12 top-0">
              <ChromePicker
                color={formik.values.templateName}
                onChangeComplete={(color) => {
                  formik.setFieldValue("templateName", color.hex);
                  formik.setFieldTouched("templateName", true, false);
                }}
              />
            </div>
          )}

          <TextInputMask
            mask="#******"
            onChange={(e) => handleOnChangeColor(e.target.value)}
            value={formik.values.templateName}
            footer={
              (formik.touched.templateName || formik.submitCount > 0) && formik.errors.templateName
                ? formik.errors.templateName
                : null
            }
            mode={
              (formik.touched.templateName || formik.submitCount > 0) && formik.errors.templateName
                ? "danger"
                : "default"
            }
          />
        </div>
      )}

      <div className={`grid grid-cols-2 gap-4`}>
        {formik.values.background !== "solid_color" && (
          <div>
            <TextInput
              title="Template Name"
              placeholder="Input Template Name"
              onChangeInput={(e) => {
                formik.setFieldValue("templateName", e.target.value);
                formik.setFieldTouched("templateName", true, false);
              }}
              isRequired
              footer={
                (formik.touched.templateName || formik.submitCount > 0) && formik.errors.templateName
                  ? formik.errors.templateName
                  : null
              }
              mode={
                (formik.touched.templateName || formik.submitCount > 0) && formik.errors.templateName
                  ? "danger"
                  : "default"
              }
              value={formik.values.templateName}
            />
          </div>
        )}

        <div>
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
          />
        </div>

        <div>
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
            }}
            currentOption={formik.values.divisionId}
            footer={
              (formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId
                ? formik.errors.divisionId
                : null
            }
            mode={
              (formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? "danger" : "default"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VoucherInformationSection;
