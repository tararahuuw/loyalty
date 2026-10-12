import React, { useEffect, useState } from "react";
import { TextInput } from "sprint-asia-custom-component";
import ReCAPTCHA from "react-google-recaptcha";

import TextArea from "prezent/TextArea";
import CustomDatePicker from "../DatePicker/DatePicker";
import LandingPageSelectComponent from "prezent/LandingPageSelectComponent";
import LandingPageAddressInput from "prezent/LandingPageAddressInput";
import { Info } from "@phosphor-icons/react";
import { DropdownPhone } from "sprint-asia-custom-component";

const SectionTwo = ({ fields, formik, setAddressMode }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      let scaleValue = 1;

      if (screenWidth < 320) {
        scaleValue = 0.7;
      } else if (screenWidth >= 320) {
        scaleValue = 0.9;
      }

      setScale(scaleValue);
    };

    updateScale();

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    localStorage.removeItem("passedSection");
  }, []);

  const onChange = (val) => {
    formik.setFieldValue("captcha", val);
  };
  return (
    <section className="bg-neutral10 flex-1 flex flex-col px-4 py-2 gap-4">
      <p className="text-neutral300 text-sm">Please fill out the details below so we can proccess your redemption!</p>

      {fields?.length > 0 &&
        fields
          .sort((a, b) => a.sequence - b.sequence)
          .map((field) => {
            if (field.type === "Short Answer") {
              if (field.category === "phone number") {
                return (
                  <DropdownPhone
                    key={field.sequence}
                    title="Phone Number"
                    placeholder="Input Phone Number"
                    redeemType="ppob"
                    fields={fields}
                    dropdownCountry={formik.values.dropdownCountry}
                    setDropdownCountry={(val) => {
                      formik.setFieldValue("dropdownCountry", val);
                    }}
                    value={formik.values.phoneNumber}
                    onChangeInput={(e) => {
                      formik.setFieldValue("phoneNumber", e.target.value);
                      formik.setFieldTouched("phoneNumber", true, false);
                    }}
                    footer={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                    mode={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "danger"
                        : "default"
                    }
                  />
                );
              } else {
                return (
                  <TextInput
                    key={field.sequence}
                    title={field.label}
                    isRequired={field.isRequired}
                    placeholder={field.instruction}
                    type={
                      field.category === "number" ||
                        field.category === "phone number" ||
                        field.category === "meter number"
                        ? "number"
                        : "text"
                    }
                    footer={formik.errors[field.label]}
                    mode={formik.errors[field.label] ? "danger" : "default"}
                    value={formik.values[field.label]}
                    onChangeInput={(e) => formik.setFieldValue(field.label, e.target.value)}
                  />
                );
              }
            } else if (field.type === "Store Code") {
              return (
                <TextInput
                  key={field.sequence}
                  title={field.label}
                  isRequired={field.isRequired}
                  placeholder={field.instruction}
                  footer={formik.errors[field.label]}
                  mode={formik.errors[field.label] ? "danger" : "default"}
                  value={formik.values[field.label]}
                  onChangeInput={(e) => formik.setFieldValue(field.label, e.target.value)}
                />
              );
            } else if (field.type === "Paragraph") {
              return (
                <TextArea
                  key={field.sequence}
                  title={field.label}
                  type={field.category === "number" || field.category === "phone number" ? "number" : "text"}
                  isRequired={field.isRequired}
                  placeholder={field.instruction}
                  lengthChecker={false}
                  footer={formik.errors[field.label]}
                  mode={formik.errors[field.label] ? "danger" : "default"}
                  value={formik.values[field.label]}
                  onChange={(e) => formik.setFieldValue(field.label, e.target.value)}
                />
              );
            } else if (field.type === "Date Picker") {
              return (
                <CustomDatePicker
                  key={field.sequence}
                  title={field.label}
                  isRequired={field.isRequired}
                  placeholder={field.instruction}
                  footer={formik.errors[field.label]}
                  mode={formik.errors[field.label] ? "danger" : "default"}
                  value={formik.values[field.label]}
                  onChange={(date) => formik.setFieldValue(field.label, date)}
                />
              );
            } else if (field.type === "Single Choice" || field.type === "Multiple Choice") {
              return (
                <LandingPageSelectComponent
                  key={field.sequence}
                  title={field.label}
                  isRequired={field.isRequired}
                  options={field.options}
                  multipleSelect={field.type === "Single Choice" ? false : true}
                  value={formik.values[field.label]}
                  onChange={(value) => formik.setFieldValue(field.label, value)}
                  mode={formik.errors[field.label] ? "danger" : "default"}
                  footer={formik.errors[field.label]}
                />
              );
            } else if (field.type === "Address") {
              return (
                <LandingPageAddressInput
                  key={field.sequence}
                  formik={formik}
                  labels={field.label}
                  isRequired={field.isRequired}
                  onClickAddress={() => setAddressMode(true)}
                  mode={formik.errors["Province, City, District, Postal Code"] ? "danger" : "default"}
                />
              );
            }
          })}

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
        className="flex flex-col gap-1"
      >
        <ReCAPTCHA sitekey={process.env.REACT_APP_GRECAPTCHA_API_KEY} onChange={onChange} />
        {formik.errors.captcha && (
          <div className="flex items-center gap-1">
            <Info size={16} className="text-danger500" />
            <span className="text-xs text-danger500">{formik.errors.captcha}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionTwo;
