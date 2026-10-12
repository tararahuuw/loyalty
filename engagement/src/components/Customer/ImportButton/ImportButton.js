import React, { useState, useEffect, useRef } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { Upload } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const ImportButton = () => {
  const navigate = useNavigate();
  const { isOpen, toggle } = useDisclosure(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        toggle();
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
        className="bg-primary500 rounded-lg cursor-pointer flex flex-row items-center justify-center gap-2 self-start py-2 px-3"
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        <Upload className="text-white" />
        <p className="text-white">Import</p>
      </a>

      {isOpen && (
        <div
          className={`absolute z-10 right-0 ${
            dropdownPosition === "top" ? "bottom-14" : "top-14"
          } bg-white border border-neutral50 rounded-md flex flex-col gap-2 p-3`}
          ref={dropDownRef}
        >
          <a
            className="flex hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/loyaltypoint/engagement/customer/import-points")}
          >
            Import Points
          </a>

          <a
            className="flex hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/loyaltypoint/engagement/customer/import-transactions")}
          >
            Import Transactions
          </a>
        </div>
      )}
    </div>
  );
};

export default ImportButton;
