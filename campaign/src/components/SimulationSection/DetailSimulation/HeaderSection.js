import React from "react";

const HeaderSection = ({ name }) => {
  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-2">
      <p className="text-sm">Campaign</p>
      <p className="font-medium text-sm">{name}</p>
    </div>
  );
};

export default HeaderSection;
