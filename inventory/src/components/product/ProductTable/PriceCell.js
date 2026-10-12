import { Trash } from "@phosphor-icons/react";
import React from "react";
const PriceCell = ({ row, isOpen, onDelete }) => {
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
          <div className="flex items-center justify-between">
            <p>Rp {product.price.toLocaleString("id")}</p>
            <Trash
              size={20}
              className="cursor-pointer text-primary500"
              onClick={() => onDelete(product)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceCell