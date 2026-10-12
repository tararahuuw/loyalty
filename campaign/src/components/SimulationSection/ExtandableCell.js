import React from "react";

const ExtandableCell = ({ values = [], isOpen, onOpen }) => {
  const renderItems = (item, index) => (
    <div
      key={index}
      className={`whitespace-nowrap mb-1 overflow-hidden overflow-ellipsis 
        ${index !== 0 ? "pt-2" : ""} 
        ${
          !isOpen && index === 2 && values.length > 3
            ? "border-b border-neutral80"
            : "border-b border-dashed border-neutral80"
        }`}
    >
      {item}
    </div>
  );

  return (
    <div className="flex flex-col w-full text-neutral300">
      {(isOpen ? values : values.slice(0, 3)).map(renderItems)}
      {!isOpen && values.length > 3 && (
        <a className="text-primary500 cursor-pointer mt-2 font-semibold" onClick={onOpen}>
          View All
        </a>
      )}
    </div>
  );
};

export default ExtandableCell;
