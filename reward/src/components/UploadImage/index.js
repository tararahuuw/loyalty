import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PiPlus, PiFileArrowUp } from "react-icons/pi";

const UploadImage = ({
    title = "Title Dropzone",
    subtitle = "Format File PNG, JPEG, or JPG, Maximal File 5 MB",
    required = false,
    onDrop,
    maxFiles = 1,
    selectedFile,
    error = "",
    disabled,
    layout = "box",
    validateResolution = false,
    minResolution = { width: 300, height: 300 },
    maxResolution = { width: 5000, height: 5000 },
}) => {
    const [errorMessage, setErrorMessage] = useState("");

    const validateImageResolution = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (
                    img.naturalWidth < minResolution.width ||
                    img.naturalHeight < minResolution.height ||
                    img.naturalWidth > maxResolution.width ||
                    img.naturalHeight > maxResolution.height
                ) {
                    reject(
                        `Invalid image resolution.\nAllowed: ${minResolution.width}x${minResolution.height} px to ${maxResolution.width}x${maxResolution.height} px.`
                    );
                } else {
                    resolve();
                }
            };
            img.onerror = () => reject("Error loading image.");
        });
    };

    const handleDrop = async (acceptedFiles) => {
        setErrorMessage("");
        const validFiles = [];

        for (const file of acceptedFiles) {
            try {
                if (validateResolution) {
                    await validateImageResolution(file);
                }
                validFiles.push(file);
            } catch (err) {
                setErrorMessage(err);
            }
        }

        if (validFiles.length > 0 && onDrop) {
            onDrop(validFiles);
        }
    };

    const onDropRejected = (rejectedFiles) => {
        const file = rejectedFiles[0];
        if (file.errors[0]?.code === "file-too-large") {
            setErrorMessage("Your file is too large. Max file size is 5 MB");
        } else if (file.errors[0]?.code === "file-invalid-type") {
            setErrorMessage("Invalid file format. Only PNG, JPEG, or JPG files are allowed.");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
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
            <div className={`${disabled ? "cursor-default" : "cursor-pointer"}`}>
                <div
                    {...getRootProps({ className: "dropzone" })}
                    style={{
                        height: layout === "box" ? "120px" : "104px",
                    }}
                    className={`bg-neutral20 rounded-lg ${disabled ? "border-0" : "border-2"} ${error ? "border-danger500" : "border-neutral50"
                        } border-dashed`}
                >
                    <input {...getInputProps()} required={required} />
                    <div
                        className={
                            selectedFile
                                ? "flex w-full h-full items-center px-3 py-2 gap-3"
                                : "flex w-full h-full justify-center items-center text-center"
                        }
                    >
                        {!selectedFile ? (
                            <div className="flex flex-col justify-center items-center">
                                <PiFileArrowUp size={16} className="text-neutral300" />
                                <div>
                                    <p className="text-sm text-neutral300">Click to upload product images</p>
                                    <p className="text-sm text-neutral300">PNG, JPG, JPEG. Single Image Only</p>
                                    <p className="text-sm text-neutral300">Image larger than 5MB will be automatically compressed</p>
                                </div>
                                {errorMessage && (
                                    <p className="text-danger500 mt-1 whitespace-pre-line" style={{ fontSize: 10 }}>
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-start justify-between w-full px-3 py-2 gap-3">
                                <div className="w-14 h-14 shrink-0">
                                    {typeof selectedFile === "string" ? (
                                        <img
                                            src={selectedFile}
                                            alt="Selected Preview"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Selected Preview"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 overflow-hidden flex flex-col items-start text-left">
                                    <p className="text-sm text-black font-medium truncate">
                                        {typeof selectedFile === "string"
                                            ? new URL(selectedFile).searchParams.get("filename") || "File"
                                            : selectedFile.name}
                                    </p> 
                                    {!selectedFile && (
                                        <p className="text-xs text-neutral500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    )}
                                    <p className="text-xs text-success500 mt-1">✓ Ready to upload</p>
                                </div>

                                {!disabled && (
                                    <button
                                        type="button"
                                        className="text-neutral500 hover:text-danger500 text-sm ml-2"
                                        onClick={() => {
                                            if (onDrop) onDrop([]);
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedFile && errorMessage && <p className="text-danger500 text-xs mt-1">{errorMessage}</p>}
            {error && <p className="text-danger500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-neutral300 mt-1">{subtitle}</p>
        </div>
    );
};

export default UploadImage;
