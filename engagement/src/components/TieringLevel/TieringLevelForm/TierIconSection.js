import React, { useCallback } from "react";
import RadioButton from "prezent/RadioButton";
import { DropzoneUploadPhoto } from "sprint-asia-custom-component";
import badge1 from "../../../assets/badge1.png";

const TierIconSection = ({ formik, icon, level }) => {
  const onDropImage = useCallback((acceptedFiles) => {
    formik.setFieldValue("tierIcon", acceptedFiles[0]);
    formik.setFieldTouched("tierIcon", true, false);
    const photoUrl = URL.createObjectURL(acceptedFiles[0]);
    setImageUrl(photoUrl);
  }, []);
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Icon Section</div>

      <div className="flex flex-row justify-between items-center">
        <RadioButton
          onChange={() => formik.setFieldValue("typeTierIcon", "Prezent")}
          checked={formik.values.typeTierIcon === "Prezent"}
          value="Prezent"
          title="Prezent Tier icon"
          description="By selecting this icon, the icon will appear in loyalty program app."
        />

        <RadioButton
          onChange={() => formik.setFieldValue("typeTierIcon", "Custom")}
          checked={formik.values.typeTierIcon === "Custom"}
          value="Custom"
          title="Custom Tier icon"
          description="Upload your personal tier icon."
        />
      </div>

      {formik.values.typeTierIcon === "Prezent" ? (
        <div className="flex flex-col self-start">
          <div className="rounded-t-md border border-neutral50 p-4">
            <img src={icon || badge1} className="h-40 w-40" alt="prezent-tier-logo" />
          </div>
          <div className="rounded-b-md border border-t-0 border-neutral50 flex justify-center py-2 bg-primary50">
            <p className="font-semibold">Level {level || 1}</p>
          </div>
        </div>
      ) : (
        <DropzoneUploadPhoto
          onDrop={onDropImage}
          selectedFile={formik.values.tierIcon}
          title="This image will be displayed on app loyalty."
          subtitle="Format File PNG, SVG, JPEG or JPG, Maximal File 5 MB"
          error={(formik.touched.tierIcon || formik.submitCount > 0) && formik.errors.tierIcon ? formik.errors.tierIcon : null}
        />
      )}
    </div>
  );
};

export default TierIconSection;
