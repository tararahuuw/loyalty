import React, { useState } from "react";

const DangerButton = ({
  title = "Button",
  type = "wrap",
  isActive = true,
  size = "large",
  onClick = () => {},
  variant = "filled", // 'filled' or 'outlined'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonPress = () => setIsPressed(true);
  const handleButtonRelease = () => setIsPressed(false);
  const handleClick = (e) => onClick(e);

  // Determine base style
  const baseStyle = `
    ${type === "full" && "w-full"}
    ${size === "small" && "text-sm h-7"}
    ${size === "medium" && "text-md h-8"}
    ${size === "large" && "text-lg h-10"}
    ${size === "very large" && "text-xl h-12"}
    ${size === "extra very large" && "text-2xl h-14"}
    ${size === "detail division" && "text-sm h-10"}
    rounded-lg drop-shadow-md text-center py-1.5 px-4 flex justify-center items-center
  `;

  // Variant styles
  const variantStyle = (() => {
    if (variant === "outlined") {
      if (!isActive) return "border border-danger500 text-danger500 bg-white cursor-default";
      if (isPressed) return "border border-danger700 text-danger500";
      return "border border-danger500 text-danger500 bg-white";
    } else {
      // filled
      if (!isActive) return "bg-neutral30 text-neutral80 cursor-default";
      if (isPressed) return "bg-danger700 text-white";
      return "bg-danger500 hover:bg-danger600 text-white";
    }
  })();

  return (
    <button
      className={`${baseStyle} ${variantStyle}`}
      disabled={!isActive}
      onClick={handleClick}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onTouchStart={handleButtonPress}
      onTouchEnd={handleButtonRelease}
    >
      {title}
    </button>
  );
};

export default DangerButton;
