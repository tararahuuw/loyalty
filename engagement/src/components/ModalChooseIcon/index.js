import React, { useEffect, useState } from "react";
import Modal from "prezent/Modal";
import { CreateIconTier } from "../../service/TieringManagement/endpoint/tieringLevel";
import UploadImageBox from "../UploadImageBox";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const ModalChooseIcon = ({
  isOpen = false,
  handleSubmitModal,
  currentImage,
  images,
  setReRender,
  onClose = () => {},
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (currentImage) {
      setSelectedImage(currentImage);
    }
  }, [isOpen]);

  async function handleUploadImage(file) {
    try {
      const formDataImage = new FormData();
      formDataImage.append("icons", file);
      await CreateIconTier(formDataImage);
      setReRender();
    } catch (e) {
      handleOpenModalResult("failed", `Sorry, unable to icon tier at the moment. Please try again`);
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-xl">
        <div className="flex justify-between py-3 px-6">
          <p className="font-semibold text-xl text-black">Choose icon template</p>
          <p className="cursor-pointer text-xl" onClick={onClose}>
            ×
          </p>
        </div>
        <div className="border-t border-b border-neutral30 py-6 text-neutral500">
          <div className="grid grid-cols-4 gap-4 mb-4 px-6">
            {images &&
              images?.data &&
              images.data.map((value) => {
                const selected = value?.icons === selectedImage?.icons;
                return (
                  <div
                    className={`border-2 ${selected ? "border-primary500" : "border-neutral40"} w-full h-full flex items-center justify-center rounded-md overflow-hidden`}
                    onClick={() => setSelectedImage(value)}
                  >
                    <img
                      src={value.icons}
                      alt="example"
                      className={`h-28 w-auto object-cover cursor-pointer ${selected ? "bg-primary50" : ""}`}
                    />
                  </div>
                );
              })}

            <div className="w-full h-full flex items-center justify-center px-6">
              <UploadImageBox UploadImage={handleUploadImage} />
            </div>
          </div>
          <p className="text-md mb-4 px-6">
            <span className="font-semibold">Recommended upload size: 128 × 128 px.</span> Use a square PNG or JPG with
            transparent background for best results.
          </p>
          <div className="border-t px-6 border-neutral40 pt-4 px-2 flex justify-end items-center">
            <div className="w-28">
              <OutlineButton title={"Cancel"} type="full" onClick={onClose} />
            </div>
            <div className="w-28 ml-4">
              <PrimaryButton
                title={"Save"}
                type="full"
                onClick={() => {
                  handleSubmitModal(selectedImage);
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalChooseIcon;
