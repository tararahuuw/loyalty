import React from "react";
import { Description } from "sprint-asia-custom-component";

const BasicInformationSection = ({ data }) => {

  function parseCategoryPath(category) {
    const result = [];

    let current = category;
    while (current) {
      result.push(current.name);
      current = current.children;
    }

    return result.join(" > ");
  }
  return (
    <div className="bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <p className="text-lg font-semibold mb-4 text-left pb-2 border-b border-neutral40">Product Information</p>
      <div>
        <Description title="Category" value={parseCategoryPath(data?.category) || "-"} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Description title="Brand Name" value={data?.brand || "-"} />
        <Description title="Product Name" value={data?.productName || "-"} />
      </div>
    </div>
  );
};

export default BasicInformationSection;
