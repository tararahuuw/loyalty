import React from "react";
const SKUCell = ({ row, isOpen }) => {
  return (
    <div className="flex flex-col w-full text-neutral300">
      {(isOpen ? row.combinations : row.combinations.slice(0, 3)).map((product, index) => (
        <div
          key={product.id}
          className={`whitespace-nowrap mb-1 overflow-hidden overflow-ellipsis ${
            index !== 0 ? "pt-2" : ""
          } ${
            isOpen === false && index === 2 && row.combinations.length > 3
              ? "border-b border-neutral80"
              : "border-b border-dashed border-neutral80"
          }`}
        >
          {product.sku}
        </div>
      ))}
    </div>
  );
};

export default SKUCell