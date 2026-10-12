import React, { useState, useEffect, useRef } from "react";

import {
  CalendarBlank,
  CaretDown,
  CaretRight,
  CheckSquare,
  ListBullets,
  Paragraph,
  Plus,
  RadioButton,
  TextAa,
} from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";

const AddContentButton = ({ setContents, triggerValidation }) => {
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: textMenuIsOpen, open: openTextMenu, close: closeTextMenu } = useDisclosure(false);
  const { isOpen: selectionMenuIsOpen, open: openSelectionMenu, close: closeSelectionMenu } = useDisclosure(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const handleOpenSubMenu = (menu) => {
    if (menu === "text") {
      openTextMenu();
      closeSelectionMenu();
    } else if (menu === "selection") {
      openSelectionMenu();
      closeTextMenu();
    }
  };

  const handleAddNewContent = (type) => {
    if (type === "Short Answer") {
      setContents((prevContents) => [
        ...prevContents,
        {
          type,
          category: "text",
          label: "",
          instruction: "",
          sequence: prevContents.length + 1,
          disabled: false,
          actions: true,
          isRequired: true,
        },
      ]);
    } else if (type === "Paragraph") {
      setContents((prevContents) => [
        ...prevContents,
        {
          type,
          category: "text",
          label: "",
          instruction: "",
          sequence: prevContents.length + 1,
          disabled: false,
          actions: true,
          isRequired: true,
        },
      ]);
    } else if (type === "Date Picker") {
      setContents((prevContents) => [
        ...prevContents,
        {
          type,
          category: "date picker",
          label: "",
          instruction: "",
          sequence: prevContents.length + 1,
          disabled: false,
          actions: true,
          isRequired: true,
        },
      ]);
    } else if (type === "Single Choice") {
      setContents((prevContents) => [
        ...prevContents,
        {
          type,
          category: "single choice",
          label: "",
          instruction: "",
          sequence: prevContents.length + 1,
          disabled: false,
          actions: true,
          isRequired: true,
          options: [],
        },
      ]);
    } else if (type === "Multiple Choice") {
      setContents((prevContents) => [
        ...prevContents,
        {
          type,
          category: "multiple choice",
          label: "",
          instruction: "",
          sequence: prevContents.length + 1,
          disabled: false,
          actions: true,
          isRequired: true,
          options: [],
        },
      ]);
    }

    toggle();
    closeTextMenu();
    closeSelectionMenu();
    triggerValidation();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        toggle();
        closeTextMenu();
        closeSelectionMenu();
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
        className="border-2 border-primary500 text-md rounded-lg cursor-pointer flex flex-row items-center justify-center gap-2 self-start px-3 py-1 w-44"
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        <Plus className="text-primary500" />
        <p className="text-primary500">Add Content</p>
        <CaretDown className="text-primary500" />
      </a>

      {isOpen && (
        <div
          className={`absolute ${
            dropdownPosition === "top" ? "bottom-14" : "top-14"
          } bg-white border border-neutral50 rounded-md flex flex-col gap-2 p-3`}
          ref={dropDownRef}
        >
          <a
            className="flex items-center justify-between gap-3 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
            onClick={() => handleOpenSubMenu("text")}
          >
            <div className="flex items-center gap-1">
              <TextAa size={18} /> <span className="text-sm">Text Answer</span>
            </div>
            <CaretRight size={18} />
          </a>
          {textMenuIsOpen && (
            <div
              className="absolute top-0 bg-white border border-neutral50 rounded-md flex flex-col gap-2 p-3 w-44"
              style={{ left: "185px" }}
            >
              <a
                className="flex items-center gap-2 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => handleAddNewContent("Short Answer")}
              >
                <TextAa size={18} /> <span className="text-sm">Short answer</span>
              </a>
              <a
                className="flex items-center gap-2 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => handleAddNewContent("Paragraph")}
              >
                <Paragraph size={18} /> <span className="text-sm">Paragraph</span>
              </a>
              <a
                className="flex items-center gap-2 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => handleAddNewContent("Date Picker")}
              >
                <CalendarBlank size={18} /> <span className="text-sm">Date picker</span>
              </a>
            </div>
          )}

          <a
            className="flex items-center justify-between gap-3 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
            onClick={() => handleOpenSubMenu("selection")}
          >
            <div className="flex items-center gap-1">
              <ListBullets size={18} /> <span className="text-sm">Selection</span>
            </div>
            <CaretRight size={18} />
          </a>
          {selectionMenuIsOpen && (
            <div
              className="absolute bg-white border border-neutral50 rounded-md flex flex-col gap-2 p-3 w-44"
              style={{ left: "185px", top: "54px" }}
            >
              <a
                className="flex items-center gap-2 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => handleAddNewContent("Single Choice")}
              >
                <RadioButton size={18} /> <span className="text-sm">Single Choice</span>
              </a>
              <a
                className="flex items-center gap-2 hover:bg-neutral20 py-2 px-3 rounded-lg cursor-pointer"
                onClick={() => handleAddNewContent("Multiple Choice")}
              >
                <CheckSquare size={18} /> <span className="text-sm">Multiple Choice</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddContentButton;
