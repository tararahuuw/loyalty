import React, { useState } from "react";

const OutlineButton = ({
  title = "Button",
  type = "wrap",
  isActive = true,
  size = "large",
  isIconVisible = false,
  icon = null,
  mode = "primary",
  onClick = () => {},
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonPress = () => {
    setIsPressed(true);
  };

  const handleButtonRelease = () => {
    setIsPressed(false);
  };

  const handleClick = (e) => {
    onClick(e);
  };

  return (
    <button
      className={`
      ${
        isPressed && isActive
          ? `bg-white text-${mode === "danger" ? "danger500" : "primary500"} border-2 border-${
              mode === "danger" ? "danger500" : "primary500"
            }`
          : isActive
          ? `bg-white border-2 border-${mode === "danger" ? "danger500" : "primary500"} text-${
              mode === "danger" ? "danger500" : "primary500"
            }`
          : "bg-neutral30 text-neutral80 cursor-default"
      }
      ${type === "full" && "w-full"}
      ${size === "small" && "text-sm h-7 w-32"}
      ${size === "medium" && "text-md h-8"}
      ${size === "large" && "text-lg h-10"}
      ${size === "very large" && "text-xl h-12"}
      ${size === "extra very large" && "text-2xl h-14"}
      ${size === "detail division" && "text-sm h-10 w-24"}
      ${size === "client approval" && "text-sm h-8"}
      rounded-lg drop-shadow-md text-center py-1.5 px-4 flex justify-center items-center`}
      disabled={!isActive}
      onClick={handleClick}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onTouchStart={handleButtonPress}
      onTouchEnd={handleButtonRelease}
    >
      <div className="flex items-center">
        {isIconVisible && icon && <span className="mr-1">{icon}</span>}
        <p>{title}</p>
      </div>
    </button>
  );
};

export default OutlineButton;
