import React, { useState, useRef, useEffect } from "react";
import { PrimaryButton } from "sprint-asia-custom-component";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

const DownloadTemplateButton = ({
  title,
  data = [
    {
      title: "Add Single Recipient",
      action: () => {},
    },
    {
      title: "Add Bulk Recipient",
      action: () => {},
    },
  ],
  disabled = false,
  isIconVisible = false,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={modalRef}>
      <div>
        <PrimaryButton
          title={title}
          onClick={() => setOpenModal(!openModal)}
          isActive={!disabled}
          isIconVisible={isIconVisible}
          icon={openModal ? <CaretUp /> : <CaretDown />}
          positionIcon="right"
        />
      </div>
      {openModal && (
        <div className="absolute left-0 z-10 p-2 bg-white rounded-lg shadow-md mt-1 cursor-pointer">
          {data.map((value, index) => (
            <div
              key={index}
              className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md w-48"
              onClick={value.action}
            >
              <p className="text-sm text-black">{value.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadTemplateButton;
