import React, { useState, useCallback } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { useDropzone } from "react-dropzone";

import { DropdownText, ModalState, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { DeleteSpesificPhoto } from "../../../service/voucherManagement/endpoint/voucherManagement";

const SpecificVoucherPhotoSection = ({ photos, setPhotos, clients, refetchVoucher, roleAccess }) => {
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationDeletePhotoIsOpen, toggle: toggleConfirmationDeletePhoto } = useDisclosure(false);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  };

  // Add a blank photo with clientId
  const addPhotoBlankPhotoHandler = () => {
    setPhotos((prevItems) => [...prevItems, { image: null, clientId: "", errorMessage: "" }]);
  };

  const deletePhotoHandler = (idx) => {
    const filteredPhotos = photos.filter((_, index) => index !== idx);
    setPhotos(filteredPhotos);
  };

  const openDeletePhotoConfirmation = (photo) => {
    toggleConfirmationDeletePhoto();
    setSelectedPhoto(photo);
  };

  const deleteSpecificVoucherPhoto = async () => {
    try {
      toggleConfirmationDeletePhoto();
      toggleLoadingModal();
      const response = await DeleteSpesificPhoto(roleAccess, {
        voucherId: selectedPhoto.voucherId,
        clientId: selectedPhoto.clientId,
      });
      if (response.code === 200) {
        setSelectedPhoto(null);
        refetchVoucher();
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Photo has been successfully deleted");
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to delete photo at the moment. Please try again");
    }
  };

  // Handle rejected files
  const onDropRejected = (rejectedFiles, idx) => {
    const file = rejectedFiles[0];
    let errorMessage = "";
    if (file.errors[0]?.code === "file-too-large") {
      errorMessage = "Your file is too large. Max file size is 5 MB";
    } else if (file.errors[0]?.code === "file-invalid-type") {
      errorMessage = "Invalid file format. Only PNG, JPEG, or JPG files are allowed.";
    }

    setPhotos((prevItems) => {
      const updatedPhotos = [...prevItems];
      updatedPhotos[idx] = { ...updatedPhotos[idx], errorMessage };
      return updatedPhotos;
    });
  };

  // Handle accepted files
  const onDropImage = useCallback(
    (acceptedFiles, idx) => {
      const file = acceptedFiles[0];
      setPhotos((prevItems) => {
        const updatedPhotos = [...prevItems];
        updatedPhotos[idx].image = file;
        updatedPhotos[idx].errorMessage = "";
        return updatedPhotos;
      });
    },
    [setPhotos]
  );

  // Handle selecting client
  const handleClientSelect = (value, idx) => {
    setPhotos((prevItems) => {
      const updatedPhotos = [...prevItems];
      updatedPhotos[idx].clientId = value;
      updatedPhotos[idx].clientName = clients.data.filter((client) => client.id === value)[0].name;
      return updatedPhotos;
    });
  };

  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Specific Voucher Photo
        </div>

        <div className="flex flex-row gap-5 items-center justify-between">
          <p className="font-normal text-sm">
            Upload an image that will only be displayed to the selected client with format File PNG, JPEG, or JPG,
            Maximal File 5 MB
          </p>

          <a className="flex flex-row items-center gap-2 cursor-pointer" onClick={addPhotoBlankPhotoHandler}>
            <Plus className="text-primary500" />
            <p className="text-primary500">Add photo</p>
          </a>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {photos.length
            ? photos.map((photo, idx) => {
                // Check for duplicates excluding the current photo
                const isDuplicate = photos.filter((_, i) => i !== idx).some((item) => item.clientId === photo.clientId);
                // Check if the current photo's clientId is empty
                const isEmpty = !photo.clientId;

                return (
                  <div key={idx} className="flex flex-row items-center gap-2 col-span-3">
                    <a
                      className="cursor-pointer text-primary500"
                      onClick={() => {
                        if (photo.voucherId) {
                          openDeletePhotoConfirmation(photo);
                        } else {
                          deletePhotoHandler(idx);
                        }
                      }}
                    >
                      <Trash />
                    </a>

                    {/* Image Upload Section */}
                    <ImageUpload idx={idx} photo={photo} onDropImage={onDropImage} onDropRejected={onDropRejected} />

                    {/* Client Dropdown */}
                    <DropdownText
                      title="Client"
                      placeholder="Choose client"
                      options={clients?.data?.map(({ name, id }) => ({
                        option: name,
                        value: id,
                      }))}
                      isRequired
                      onSelect={(e) => handleClientSelect(e.value, idx)}
                      currentOption={photo.clientId}
                      footer={isDuplicate ? "Same client is found" : isEmpty ? "Client can't be empty" : ""}
                      mode={isDuplicate || isEmpty ? "danger" : "default"}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>

      <ModalState
        title="Delete photo"
        subtitle="Are you sure you want to delete this specific voucher photo?"
        isOpen={confirmationDeletePhotoIsOpen}
        onClose={toggleConfirmationDeletePhoto}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <span>Delete photo</span>
          </div>
        }
        leftAction={toggleConfirmationDeletePhoto}
        rightAction={deleteSpecificVoucherPhoto}
      />

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

// Create a separate component for image upload handling to avoid conditional hooks
const ImageUpload = ({ idx, photo, onDropImage, onDropRejected }) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    noKeyboard: true,
    maxSize: 5242881,
    onDrop: (acceptedFiles) => onDropImage(acceptedFiles, idx),
    onDropRejected: (rejectedFiles) => onDropRejected(rejectedFiles, idx),
  });

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps({
          className: `rounded-md ${
            !photo.image && "border border-dashed border-neutral50"
          } bg-neutral20 cursor-pointer w-36 h-20`,
        })}
      >
        <input {...getInputProps()} />
        {photo.image ? (
          <img
            src={
              photo.image
                ? typeof photo.image === "string"
                  ? `${process.env.REACT_APP_API_URL}/voucher/${photo.image}`
                  : URL.createObjectURL(photo.image)
                : null
            }
            alt="Uploaded"
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <Plus className="text-neutral300" size={20} />
            <p className="text-sm text-neutral300">Upload Image</p>
          </div>
        )}
      </div>
      {photo.errorMessage && <p className="text-danger500 text-xs mt-1">{photo.errorMessage}</p>}
    </div>
  );
};

export default SpecificVoucherPhotoSection;
