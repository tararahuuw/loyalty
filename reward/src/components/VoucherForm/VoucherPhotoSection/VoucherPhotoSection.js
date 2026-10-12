import React, { useCallback } from "react";

import { DropzoneUploadPhoto } from "sprint-asia-custom-component";

const VoucherPhotoSection = ({ formik, disabled }) => {
  const onDropImage = useCallback((acceptedFiles) => {
    formik.setFieldValue("voucherPhoto", acceptedFiles[0]);
    formik.setFieldTouched("voucherPhoto", true, false);
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Photo</div>

      <DropzoneUploadPhoto
        title={!disabled && "This image will be displayed to all clients. This field is mandatory."}
        onDrop={onDropImage}
        selectedFile={
          formik.values.voucherPhoto
            ? typeof formik.values.voucherPhoto === "string"
              ? `${process.env.REACT_APP_API_URL}/voucher/${formik.values.voucherPhoto}`
              : formik.values.voucherPhoto
            : null
        }
        subtitle="Format File PNG, JPEG, or JPG, Maximal File 5 MB"
        required={disabled ? false : true}
        error={
          (formik.touched.voucherPhoto || formik.submitCount > 0) && formik.errors.voucherPhoto
            ? formik.errors.voucherPhoto
            : null
        }
        disabled={disabled}
        layout="rectangle"
      />
    </div>
  );
};

export default VoucherPhotoSection;
