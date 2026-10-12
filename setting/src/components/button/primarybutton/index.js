import React, { useState } from 'react';

const PrimaryButton = ({
    title = "Button",
    type = "wrap",
    isActive = true,
    size = "large",
    isIconVisible = false,
    icon = null,
    positionIcon = "left", //left, right // Position
    onClick = () => {}
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
            ${(isPressed && isActive) ? 'bg-primary700 text-white' : (isActive ? 'bg-primary500 hover:bg-primary600 text-white cursor-pointer' : 'bg-neutral30 text-neutral80 cursor-default')} 
            ${type === "full" && "w-full"}
            ${size === "small" && "text-sm h-7"}
            ${size === "medium" && "text-md h-8"}
            ${size === "large" && "text-lg h-10"}
            ${size === "very large" && "text-xl h-12"}
            ${size === "extra very large" && "text-2xl h-14"}
            ${size === "detail division" && "text-sm h-10"}
            ${size === "client approval" && "text-sm h-8"}
            rounded-lg drop-shadow-md text-center py-1.5 px-4 flex justify-center items-center`
        }
        disabled={!isActive}
        onClick={handleClick}
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
    >
        <div className='flex items-center'>
                {
                    isIconVisible && positionIcon == "left" && icon && <span className='mr-1'>{icon}</span>
                }
                <p>{title}</p>
                {
                    isIconVisible && positionIcon == "right" && icon && <span className='ml-1'>{icon}</span>
                }
            </div>
    </button>
  );
};

export default PrimaryButton;