import React from "react";
import TextArea from "prezent/TextArea";

const TierBenefitSection = ({ formik }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Benefit</div>

      <TextArea
        title="Benefit Description"
        placeholder="Input Description"
        onChange={(e) => {
          formik.setFieldValue("description", e.target.value);
          formik.setFieldTouched("description", true, false);
        }}
        footer={(formik.touched.description || formik.submitCount > 0) && formik.errors.description ? formik.errors.description : null}
        mode={(formik.touched.description || formik.submitCount > 0) && formik.errors.description ? "danger" : "default"}
        isRequired
        value={formik.values.description}
      />
    </div>
  );
};

export default TierBenefitSection;
