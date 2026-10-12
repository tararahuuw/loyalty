import React, { useRef, useState, useEffect } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { Plus } from "@phosphor-icons/react";

const AddButton = ({ addSingleHandler, addBulkHandler, title }) => {
  const buttonRef = useRef(null);
  const dropDownRef = useRef(null);
  const { isOpen, toggle, close } = useDisclosure(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);

      // Dynamically check if dropdown should be displayed above or below
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 250; // estimate dropdown height or calculate it dynamically if needed
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      if (spaceBelow < dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={buttonRef}>
      <a
        className="bg-primary500 text-md rounded-lg cursor-pointer flex flex-row items-center justify-center gap-2 self-start px-3 py-2"
        onClick={(e) => {
          e.preventDefault();
          if (isOpen) {
            close();
          } else {
            toggle();
          }
        }}
      >
        <Plus className="text-white" size={20} />
        <p className="text-white">{title}</p>
      </a>

      {isOpen && (
        <div
          className={`absolute ${
            dropdownPosition === "top" ? "bottom-14" : "top-10"
          } right-0 bg-white border border-neutral50 rounded-md flex flex-col gap-2 p-3 z-10 w-48 mt-2`}
          ref={dropDownRef}
        >
          <a
            className="flex items-center justify-between gap-3 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
            onClick={() => {
              addSingleHandler();
              close();
            }}
          >
            <div className="flex items-center gap-1">
              <span className="text-sm">Add Single</span>
            </div>
          </a>

          <a
            className="flex items-center justify-between gap-3 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
            onClick={() => {
              addBulkHandler();
              close();
            }}
          >
            <div className="flex items-center gap-1">
              <span className="text-sm">Add Bulk</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default AddButton;
