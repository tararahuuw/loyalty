import React from "react";

import { DropzoneUploadFile } from "sprint-asia-custom-component";

const UploadDocument = ({ formik, onDropProjectBrief, onDropFile1, onDropFile2 }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Upload Document</div>

      <div className="flex flex-row gap-7 flex-wrap">
        <div className="flex-1">
          <DropzoneUploadFile
            title="Project Brief"
            required={true}
            subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
            onDrop={onDropProjectBrief}
            selectedFile={formik.values.projectBrief}
            maxFiles={1}
            error={(formik.touched.projectBrief || formik.submitCount > 0) && formik.errors.projectBrief ? formik.errors.projectBrief : null}
          />
        </div>
        <div className="flex-1">
          <DropzoneUploadFile
            title="Optional Document"
            subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
            onDrop={onDropFile1}
            selectedFile={formik.values.optionalDocument1}
            maxFiles={1}
            error={(formik.touched.optionalDocument1 || formik.submitCount > 0) && formik.errors.optionalDocument1 ? formik.errors.optionalDocument1 : null}
          />
        </div>
        <div className="flex-1">
          <DropzoneUploadFile
            title="Optional Document"
            subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
            onDrop={onDropFile2}
            selectedFile={formik.values.optionalDocument2}
            maxFiles={1}
            error={(formik.touched.optionalDocument2 || formik.submitCount > 0) && formik.errors.optionalDocument2 ? formik.errors.optionalDocument2 : null}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
