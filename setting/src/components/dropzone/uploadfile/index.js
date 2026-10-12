import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PiFileArrowUpDuotone, PiFileDuotone } from "react-icons/pi";

const DropzoneUploadFile = ({
  title = "Title Dropzone",
  subtitle = "Format File PDF, JPEG JPG, Maximal File 5 MB",
  required = false,
  onDrop,
  maxFiles = 1,
  selectedFile,
  error = "",
  disabled,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const onDropRejected = (rejectedFiles) => {
    const file = rejectedFiles[0];
    if (file.errors[0]?.code === "file-too-large") {
      setErrorMessage("Your file is too large. Max file size is 5 MB");
    } else if (file.errors[0]?.code === "file-invalid-type") {
      setErrorMessage("File format not supported. Please try again with PNG, JPEG, JPG, or PDF file within 5 MB");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    noKeyboard: true,
    maxSize: 5242881,
    onDropRejected,
    disabled,
  });

  return (
    <div className="w-full">
      <div className="flex items-center">
        <p className="text-black text-sm mb-1">{title}</p>
        {required && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
      </div>
      <div className="cursor-pointer">
        <div
          {...getRootProps({ className: "dropzone" })}
          className={`bg-neutral20 w-full h-28 rounded-lg border-2 ${
            error ? "border-danger500" : "border-neutral50"
          } border-dashed`}
        >
          <input {...getInputProps()} required={required} />
          <div className="flex w-full h-full justify-center items-center text-center">
            <div>
              {!selectedFile ? (
                <>
                  <div className="flex justify-center">
                    <PiFileArrowUpDuotone size={16} className="text-neutral300" />
                  </div>
                  <p className="text-sm text-neutral300 mt-2">Drag & Drop File Here or Chose File</p>
                  {errorMessage && <p className="text-xs text-danger500">{errorMessage}</p>}
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <PiFileDuotone size={16} className="text-neutral300" />
                  </div>
                  <p className="text-sm text-black mt-2">{selectedFile?.name}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-danger500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-neutral300 mt-1">{subtitle}</p>
    </div>
  );
};

export default DropzoneUploadFile;
