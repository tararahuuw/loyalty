import React from "react";
const SpecificationCell = ({ row, isOpen, onOpen }) => {
  const renderSpecification = (product, index) => (
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
      {product.specificationsFirst.name && product.specificationsSecond.name
        ? `${product.specificationsFirst.name}, ${product.specificationsSecond.name}`
        : product.specificationsFirst.name || product.specificationsSecond.name}
    </div>
  );

  return (
    <div className="flex flex-col w-full text-neutral300">
      {(isOpen ? row.combinations : row.combinations.slice(0, 3)).map(renderSpecification)}
      {!isOpen && row.combinations.length > 3 && (
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

export default SpecificationCell