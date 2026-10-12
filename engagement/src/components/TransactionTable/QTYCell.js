import React from "react";
const QTYCell = ({ row, isOpen }) => {
  return (
    <div className="flex flex-col w-full text-neutral300">
      {(isOpen ? row?.products : row?.products?.slice(0, 3) || []).map((product, index) => (
        <div
          key={product.id}
          className={`whitespace-nowrap mb-1 overflow-hidden overflow-ellipsis ${
            index !== 0 ? "pt-2" : ""
          } ${
            isOpen === false && index === 2 && row?.products?.length > 3
              ? "border-b border-neutral80"
              : "border-b border-dashed border-neutral80"
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{product?.qty ? product?.qty?.toLocaleString("id") : 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QTYCell