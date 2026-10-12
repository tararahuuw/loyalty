import React from "react";
const ProductCell = ({ row, isOpen, onOpen }) => {
  const renderProduct = (product, index) => (
    <div
      key={product}
      className={`whitespace-nowrap mb-1 overflow-hidden overflow-ellipsis ${
        index !== 0 ? "pt-2" : ""
      } ${
        isOpen === false && index === 2 && row.length > 3
          ? "border-b border-neutral80"
          : "border-b border-dashed border-neutral80"
      }`}
    >
      {product.toLocaleString("id", "ID") || "-"}
    </div>
  );

  return (
    <div className="flex flex-col w-full text-neutral300">
      {(isOpen ? row : row?.slice(0, 3) || []).map(renderProduct)}
      {!isOpen && row?.length > 3 && (
        <a
          className="text-primary500 cursor-pointer mt-2 font-semibold"
          onClick={onOpen}
        >
          View All
        </a>
      )}
    </div>
  );
};

export default ProductCell