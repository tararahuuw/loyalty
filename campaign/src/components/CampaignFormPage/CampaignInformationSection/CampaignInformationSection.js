import React from "react";
import { TextInput } from "sprint-asia-custom-component";
import moment from "moment";
import DateTimePicker from "../../../components/DateTimePicker";
import TextArea from "prezent/TextArea";

const CampaignInformationSection = ({ formik }) => {
  return (
    <div className="bg-white rounded-lg py-5 px-6 shadow-md">
      <div className="mb-4">
        <p className="text-black text-lg font-semibold">Campaign Information</p>
        <div className="h-px bg-neutral30 mt-2 mb-4"></div>
        <div class="grid grid-cols-3 gap-4">
          <TextInput
            title="Campaign Name"
            placeholder="Input Campaign Name"
            onChangeInput={(e) => {
              formik.setFieldValue("name", e.target.value);
              formik.setFieldValue("subject", e.target.value);
              formik.setFieldValue("subject2", e.target.value);
              formik.setFieldTouched("name", true, false);
              formik.setFieldTouched("subject", true, false);
              formik.setFieldTouched("subject2", true, false);
            }}
            footer={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? formik.errors.name : null}
            mode={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"}
            isRequired
            value={formik.values.name}
          />
          <DateTimePicker
            title="Start Date Period"
            placeholder="Select Period"
            isRequired
            onChange={(e) => {
              formik.setFieldValue("startDate", e);
              formik.setFieldTouched(`startDate`, true, false);
            }}
            minDate={moment().format("YYYY-MM-DD")}
            footer={
              (formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate
                ? formik.errors.startDate
                : null
            }
            mode={
              (formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate ? "danger" : "default"
            }
            value={formik.values.startDate}
            defaultTime="00:00"
          />
          <DateTimePicker
            title="End Date Period"
            placeholder="Select Period"
            isRequired
            onChange={(e) => {
              formik.setFieldValue("endDate", e);
              formik.setFieldTouched(`endDate`, true, false);
            }}
            footer={
              (formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate ? formik.errors.endDate : null
            }
            minDate={formik.values.startDate}
            mode={(formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate ? "danger" : "default"}
            value={formik.values.endDate}
            defaultTime="23:59"
            className={`${formik.values.startDate ? "pointer-events-auto" : "pointer-events-none"}`}
          />
        </div>
        <div class="grid grid-cols-1 gap-4 mt-4">
          <TextArea
            title="Campaign Description"
            placeholder="Input Description"
            onChange={(e) => {
              formik.setFieldValue("description", e.target.value);
              formik.setFieldTouched("description", true, false);
            }}
            footer={
              (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                ? formik.errors.description
                : null
            }
            mode={
              (formik.touched.description || formik.submitCount > 0) && formik.errors.description ? "danger" : "default"
            }
            isRequired={false}
            value={formik.values.description}
            lengthChecker={false}
            height={36}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignInformationSection;
