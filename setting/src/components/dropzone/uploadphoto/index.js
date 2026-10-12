import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PiPlus } from "react-icons/pi";

const DropzoneUploadPhoto = ({
  title = "Title Dropzone",
  subtitle = "Format File PNG, JPEG, or JPG, Maximal File 5 MB",
  required = false,
  onDrop,
  maxFiles = 1,
  selectedFile,
  error = "",
  disabled,
  layout = "box",
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const onDropRejected = (rejectedFiles) => {
    const file = rejectedFiles[0];
    if (file.errors[0]?.code === "file-too-large") {
      setErrorMessage("Your file is too large. Max file size is 5 MB");
    } else if (file.errors[0]?.code === "file-invalid-type") {
      setErrorMessage("Invalid file format. Only PNG, JPEG, or JPG files are allowed.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
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
      <div className={`${disabled ? "cursor-default" : "cursor-pointer"}`} style={{ width: "fit-content" }}>
        <div
          {...getRootProps({ className: "dropzone" })}
          style={{
            width: layout === "box" ? "208px" : "347px",
            height: layout === "box" ? "208px" : "192px",
          }}
          className={`bg-neutral20 rounded-lg ${disabled ? "border-0" : "border-2"} ${
            error ? "border-danger500" : "border-neutral50"
          } border-dashed`}
        >
          <input {...getInputProps()} required={required} />
          <div className="flex w-full h-full justify-center items-center text-center">
            {!selectedFile ? (
              <div className="flex flex-col justify-center items-center">
                <PiPlus size={24} className="text-neutral300" />
                <p className="text-sm text-neutral300">Upload Photo</p>
                {errorMessage && (
                  <p className="text-danger500 mt-1" style={{ fontSize: 10 }}>
                    {errorMessage}
                  </p>
                )}
              </div>
            ) : typeof selectedFile === "string" ? (
              <img src={selectedFile} alt="Selected" className="object-contain rounded-lg w-full h-full" />
            ) : (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="object-contain rounded-lg w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-danger500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-neutral300 mt-1">{subtitle}</p>
    </div>
  );
};

export default DropzoneUploadPhoto;
