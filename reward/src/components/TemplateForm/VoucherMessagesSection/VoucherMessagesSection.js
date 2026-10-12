import React, { useEffect } from "react";

import { DropdownText, TextInput } from "sprint-asia-custom-component";
import TextArea from "prezent/TextArea";
import { templateTheme } from "../../../utils/templateTheme/templateTheme";
import RadioButtonComponent from "../RadioButtonComponent/RadioButtonComponent";

const VoucherMessagesSection = ({ formik, type, setType }) => {
  const { themes } = templateTheme();

  const filterTheme = () => {
    const filteredTheme = themes.filter((item) => item.theme === formik.values.theme);
    return filteredTheme[0];
  };

  useEffect(() => {
    if (type === "template") {
      formik.setFieldValue(
        "messageTitle",
        formik.values.theme
          ? formik.values.language === "english"
            ? filterTheme()?.titleEnglish
            : filterTheme()?.titleIndonesia
          : "-"
      );
      formik.setFieldValue(
        "messageDescription",
        formik.values.theme
          ? formik.values.language === "english"
            ? filterTheme()?.messageEnglish
            : filterTheme()?.messageIndonesia
          : "-"
      );
    }
  }, [formik.values.language, formik.values.theme, type]);
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Messages</div>

      <div className="flex flex-row justify-between items-center">
        <RadioButtonComponent
          onChange={() => setType("manual")}
          checked={type === "manual"}
          value="manual"
          title="Manual Input"
          description="Write your own campaign message."
        />

        <RadioButtonComponent
          onChange={() => setType("template")}
          checked={type === "template"}
          value="template"
          title="Use Template"
          description="Select from our pre-made templates."
        />
      </div>

      {type === "manual" && (
        <>
          <TextInput
            title="Messages Title"
            placeholder="Input Messages Title"
            onChangeInput={(e) => {
              formik.setFieldValue("messageTitle", e.target.value);
              formik.setFieldTouched("messageTitle", true, false);
            }}
            isRequired
            value={formik.values.messageTitle}
            className="flex-1"
            footer={
              (formik.touched.messageTitle || formik.submitCount > 0) && formik.errors.messageTitle
                ? formik.errors.messageTitle
                : null
            }
            mode={
              (formik.touched.messageTitle || formik.submitCount > 0) && formik.errors.messageTitle
                ? "danger"
                : "default"
            }
          />

          <TextArea
            title="Messages"
            placeholder="Input Messages"
            onChange={(e) => {
              formik.setFieldValue("messageDescription", e.target.value);
              formik.setFieldTouched("messageDescription", true, false);
            }}
            isRequired
            value={formik.values.messageDescription}
            lengthChecker={false}
            footer={
              (formik.touched.messageDescription || formik.submitCount > 0) && formik.errors.messageDescription
                ? formik.errors.messageDescription
                : null
            }
            mode={
              (formik.touched.messageDescription || formik.submitCount > 0) && formik.errors.messageDescription
                ? "danger"
                : "default"
            }
          />
        </>
      )}

      {type === "template" && (
        <>
          <DropdownText
            title="Theme"
            placeholder="Select Theme"
            options={themes.map(({ theme }) => ({
              option: theme,
              value: theme,
            }))}
            isRequired
            onSelect={(e) => {
              formik.setFieldValue("theme", e.value);
              formik.setFieldTouched("theme", true, false);
            }}
            currentOption={formik.values.theme}
            footer={
              (formik.touched.theme || formik.submitCount > 0) && formik.errors.theme ? formik.errors.theme : null
            }
            mode={(formik.touched.theme || formik.submitCount > 0) && formik.errors.theme ? "danger" : "default"}
          />

          <div className="flex flex-row justify-between items-center">
            <RadioButtonComponent
              onChange={() => formik.setFieldValue("language", "english")}
              checked={formik.values.language === "english"}
              value="english"
              title="English Language"
              description="Share the campaign in English."
              adornment={
                <>
                  <p className="font-normal text-neutral300 text-xs m-0">Text :</p>

                  <div className="bg-neutral10 p-7 rounded-md flex flex-col gap-7 w-80">
                    <p className="font-bold text-neutral300 text-xs m-0">{filterTheme()?.titleEnglish}</p>
                    <p className="text-neutral300 text-xs m-0">{filterTheme()?.messageEnglish}</p>
                  </div>
                </>
              }
            />

            <RadioButtonComponent
              onChange={() => formik.setFieldValue("language", "indonesia")}
              checked={formik.values.language === "indonesia"}
              value="indonesia"
              title="Bahasa Indonesia"
              description="Sebarkan kampanye dalam bahasa indonesia."
              adornment={
                <>
                  <p className="font-normal text-neutral300 text-xs m-0">Teks :</p>

                  <div className="bg-neutral10 p-7 rounded-md flex flex-col gap-7 w-80">
                    <p className="font-bold text-neutral300 text-xs m-0">{filterTheme()?.titleIndonesia}</p>
                    <p className="text-neutral300 text-xs m-0">{filterTheme()?.messageIndonesia}</p>
                  </div>
                </>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherMessagesSection;
